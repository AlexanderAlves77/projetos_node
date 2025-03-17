const qrcode = require("qrcode-terminal")
const fs = require("fs")
const readLine = require("readLine")
const { Client, LocalAuth, MessageTypes } = require("whatsapp-web.js")
const { google } = require("googleapis")
const { parse } = require("csv-parse/sync")

const SHEET_ID = process.env.SHEED_ID
const GOOGLE_CREDENTIALS_JSON = process.env.GOOGLE_CREDENTIALS_JSON

require('dotenv').config()

// Inicializa o cliente com autenticação persistente
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
})

// Exibe o QR Code no terminal
client.on('qr', qr => { qrcode.generate(qr, { small: true }) })

// Confirmação de que o bot está online
client.on('ready', () => { console.log("Tudo certo! Whatsapp conectado.") })

// Lidar com autenticação e possíveis erros
client.on('authenticated', () => { console.log("Autenticado com sucesso!") })

client.on('auth_failure', msg => { console.log("Falha na autenticação:", msg) })

// Inicializa o bot
client.initialize()

const delay = ms => new Promise(res => setTimeout(res, ms))

// Autenticação com Google Sheets
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

const auth = async () => {
    if(!GOOGLE_CREDENTIALS_JSON) {
        console.error('Variável de ambiente GOOGLE_CREDENTIALS não configurada.');
        throw new Error('Credenciais do Google não encontradas.');
    }

    const credentials = JSON.parse(GOOGLE_CREDENTIALS_JSON)
    const { client_email, private_key } = credentials
    const authClient = new google.auth.JWT(client_email, null, private_key, SCOPES)
    return authClient
}

// Obter o último Id do Google Sheets
const obterUltimoIdGoogleSheets = async () => {
    const authClient = await auth();
    const sheets = google.sheets({ version: 'v4', auth: authClient })

    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: `A:A`,
        })
        const values = response.data.values || [];

        if(values.length > 1) {
            const lastIdString = values[values.length - 1][0]
            const lastId = parseInt(lastIdString, 10)            
            if(!isNaN(lastId)) return lastId;
        }
        return 0;
    }
    catch(error) {
        console.log(`Erro ao obter o último ID da planilha:`, error);
        return -1;
    }
}

const gerarProximoId = async () => {
    const ultimoId = await obterUltimoIdGoogleSheets();
    if(ultimoId === -1) {
        console.log("Não possível gerar o próximo ID devido a um erro ao ler a planila.")
        return null;
    }
    return ultimoId + 1;
}

// Função para adicionar usuário ao Google Sheets
const adiconarUsuarioGoogleSheets = async (nome, telefone, opcoes) => {
    const authClient = await auth();
    const sheets = google.sheets({ version: 'v4', auth: authClient })

    const proximoId = await gerarProximoId()
    if(proximoId === null) {
        console.log("Não possível adicionar o usuário devido a um erro na geração do ID.")
        return;
    }

    const dataAtual = new Date();
    const dataFormatada = `${dataAtual.getFullYear()}-${(dataAtual.getMonth() + 1).toString().padStart(2, '0')}-${dataAtual.getDate().toString().padStart(2, '0')} ${dataAtual.getHours().toString().padStart(2, '0')}:${dataAtual.getMinutes().toString().padStart(2, '0')}:${dataAtual.getSeconds().toString().padStart(2, '0')}`;

    const data = [ [proximoId, nome , telefone, JSON.stringify(opcoes), dataFormatada] ]

    const request = {
        spreadsheetId: SHEET_ID,
        range: 'A2:E',
        valueInputOption: 'RAW',
        resource: { values: data }
    }

    try {
        await sheets.spreadsheetId.values.append(request)
        console.log(`Usuário ${nome} (ID: ${proximoId}) registrada com opções: ${JSON.stringify(opcoes)}`)
    }
    catch(error) {
        console.log(`Erro ao adicionar usuário à planilha:`, error)
    }
}

// Opções do menu
const menuOptions = `Olá! Sou o assistente virtual do consultor Alexander Alves. 
Como posso ajudá-lo hoje?

1 - Economizar na Conta de Energia 
2 - Ganhar o Clube de Benefícios Exclusivo 
3 - Concorrer ao Cruzeiro apenas pagando sua conta de Energia
4 - Indicar amigos pra receber todos esses benefícios
5 - Receber comissões recorrentes sempre que alguém pagar conta de energia
0 - Menu principal`;

const answers = {
    '1': '💚 Por favor para adiantar o atendimento, preenche esse cálculo é gratuito e rapidinho de preencher. 💚\n\nClique no Link: https://bit.ly/CalcularConta\n\nDigite *0* para voltar ao menu principal.',
    '2': 'Planos disponíveis:\n\n*Individual:* R$22,50/mês\n*Família:* R$39,90/mês (você + 3 dependentes)\n*TOP Individual:* R$42,50/mês\n*TOP Família:* R$79,90/mês\n\nLink para cadastro: https://site.com\n\nDigite *0* para voltar ao menu principal.',
    '3': 'Benefícios:\n- Sorteios anuais de prêmios\n- Atendimento médico 24h\n- Receitas de medicamentos\n\nLink para cadastro: https://site.com\n\nDigite *0* para voltar ao menu principal.',
    '4': 'Aderir é simples! Escolha um plano e faça seu cadastro pelo site ou WhatsApp.\n\nLink para cadastro: https://site.com\n\nDigite *0* para voltar ao menu principal.',
    '5': 'Seja um Licenciado Igreen Energy.\n\nClique no Link: https://bit.ly/NovoConsultorIgreen\n\nDigite *0* para voltar ao menu principal.',    
    '0': menuOptions
}

const availableOptions = ['1', '2', '3', '4', '5', '0'];
// Objeto para armazenar as opções digitadas pelo usuário durante a interação
const userOptions = {}; 

const handleInvalidOption = async (msg, validOption) => {
    const optionsText = validOption.filter(opt => opt !== '0').join(', ');
    await msg.reply(`Desculpe, a opção que você digitou não é válida. Por favor, escolha uma das seguintes opções: ${optionsText} ou digite *0* para voltar ao menu principal.`)
}

// Lógica do bot acionando com qualquer mensagem e cadastrando usuário
client.on('message', async msg => {
    // Garante que a mensagem é de um usuário real
    if(!msg.from.endsWith('@c.us')) return;  

    const chat = await msg.getChat()
    const contact = await msg.getContact()
    const nome = contact.pushname
    const telefone = msg.from.replace('@c.us', '')
    const messageBody = msg.body.trim()
    const userId = msg.from;

    // Inicializa o array de opções para o usuário se não existir
    if(!userOptions[userId]) userOptions[userId] = []

    if(availableOptions.includes(messageBody)) {
        if(messageBody !== '0') {
            if(!userOptions[userId].includes(messageBody)) {
                userOptions[userId].push(messageBody)
            }
            await client.sendMessage(msg.from, answers[messageBody])
        }
        else {
            await client.sendMessage(msg.from, answers['0'])
            // Limpa as opções ao voltar para o menu principal
            userOptions[userId] = []
        }
    }
    else {
        // Verifica se o usuário digitou algo diferente das opções válidas
        const isNumeric = !isNaN(parseInt(messageBody)) && isFinite(messageBody)
        const isCommaSeparated = messageBody.includes(',')
        const areAllInvalid = (isNumeric || isCommaSeparated) && messageBody.split(',').map(opt => opt.trim()).every(opt => !availableOptions.includes(opt))
        const isNotMenuRelated = !isNumeric && !isCommaSeparated

        if(areAllInvalid || isNotMenuRelated) {
            await handleInvalidOption(msg, availableOptions)
        }
        else if(isCommaSeparated) {
            const selected = messageBody.split(',').map(opt => opt.trim())
            let validSelection = false; 

            for(const opt of selected) {
                if(availableOptions.includes(opt)) {
                    if(opt !== '0' && !userOptions[userId].includes(opt)) {
                        userOptions[userId].push(opt)
                    }
                    else if(opt === '0') {
                        userOptions[userId] = []
                        await chat.sendStateTyping()
                        await delay(5000)
                        await client.sendMessage(msg.from, answers['0'])
                    }
                    
                    await chat.sendStateTyping()
                    await delay(5000)
                    await client.sendMessage(msg.from, answers[opt])
                    validSelection = true;
                }
            }

            if(!validSelection) {
                await handleInvalidOption(msg, availableOptions);
            }
        }
    }

    // Adiciona a interação à planilha no final da interação (ou quando o menu principal é solicitado)
    if(messageBody === '0') {
        await delay(10000)
        await adiconarUsuarioGoogleSheets(nome, telefone, userOptions[userId])
        delete userOptions[userId]
    }
    else if (!isNaN(parseInt(messageBody)) && availableOptions.includes(messageBody) && messageBody !== '0') {
        // Registra a interação após uma seleção de menu válida (não o menu principal)
        // Você pode ajustar essa lógica para registrar em momentos diferentes, se necessário.
        // Por exemplo, registrar após um certo número de interações ou um tempo limite.
        // Para registrar a cada interação válida (não o menu principal):
        await delay(10000)
        await adiconarUsuarioGoogleSheets(nome, telefone, userOptions[userId])
        // Não apagar userOptions aqui se quiser acumular mais opções na mesma interação.
    }

    // Reduzi o delay para uma interação mais fluida
    await delay(10000)
})