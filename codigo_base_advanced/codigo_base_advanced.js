// Invocamos o leitor de qr code
const qrcode = require('qrcode-terminal');
const { Client, Buttons, List, MessageMedia, LocalAuth } = require('whatsapp-web.js');
const fs = require('fs');

// Final das variáveis do seu modelo
const wwebVersion = '2.2407.3';
const sessao = 'advanced';

const client = new Client({
  authStrategy: new LocalAuth({ clientId: sessao }),
  puppeteer: {
    headless: true,
    //CAMINHO DO CHROME PARA WINDOWS (COLOQUE O SEU PROPRIO CAMINHO DO CHROME AQUI)
    executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    //===================================================================================
    // CAMINHO DO CHROME PARA MAC (REMOVER O COMENTÁRIO ABAIXO)
    //executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    //===================================================================================
    // CAMINHO DO CHROME PARA LINUX (REMOVER O COMENTÁRIO ABAIXO)
    //executablePath: '/usr/bin/google-chrome-stable',
    //===================================================================================    
  },
  webVersionCache: {
      type: 'remote',
      remotePath: `https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/${wwebVersion}.html`,
  }
});


//Kit com os comandos otimizados para nuvem Ubuntu Linux (créditos Pedrinho da Nasa Comunidade ZDG)
/*const client = new Client({
  authStrategy: new LocalAuth({ clientId: sessao }),
  puppeteer: {
    headless: true,
    //CAMINHO DO CHROME PARA WINDOWS (REMOVER O COMENTÁRIO ABAIXO)
    //executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    //===================================================================================
    // CAMINHO DO CHROME PARA MAC (REMOVER O COMENTÁRIO ABAIXO)
    //executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    //===================================================================================
    // CAMINHO DO CHROME PARA LINUX (REMOVER O COMENTÁRIO ABAIXO)
     executablePath: '/usr/bin/google-chrome-stable',
    //===================================================================================
    args: [
      '--no-sandbox', //Necessário para sistemas Linux
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process', // <- Este não funciona no Windows, apague caso suba numa máquina Windows
      '--disable-gpu'
    ]
  },
  webVersionCache: {
      type: 'remote',
      remotePath: `https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/${wwebVersion}.html`,
  }
});*/

// entao habilitamos o usuario a acessar o serviço de leitura do qr code
client.on('qr', qr => {
  qrcode.generate(qr, {small: true});
});

// apos isso ele diz que foi tudo certin
client.on('ready', () => {
  console.log('Tudo certo! WhatsApp conectado.');
});

// E inicializa tudo para fazer a nossa magica =)
client.initialize();

const delay = ms => new Promise(res => setTimeout(res, ms)); // Função que usamos para criar o delay entre uma ação e outra

// Código Base Advanced

const DATABASE_FILE = 'advancedbase.json';

// Funções de controle e gestão do JSON

// Função auxiliar para ler o arquivo JSON
function readJSONFile(nomeArquivo) {
  if (fs.existsSync(nomeArquivo)) {
    const dados = fs.readFileSync(nomeArquivo);
    return JSON.parse(dados);
  } else {
    return [];
  }
}

// Função auxiliar para escrever no arquivo JSON
function writeJSONFile(nomeArquivo, dados) {
  const dadosJSON = JSON.stringify(dados, null, 2);
  fs.writeFileSync(nomeArquivo, dadosJSON);
}

function salvarNoJSON(nomeArquivo, numeroId) {
  const dadosAtuais = readJSONFile(DATABASE_FILE);

  // Encontrar o objeto com o número de ID correspondente
  const objetoEncontrado = dadosAtuais.find(objeto => objeto.numeroId === numeroId);

  if (!objetoEncontrado) {
    throw new Error('Não foi encontrado um objeto com o numeroId fornecido.');
  }

  // Verificar se o nome do arquivo foi fornecido
  if (!nomeArquivo) {
    throw new Error('É necessário fornecer um nome de arquivo.');
  }

  // Adicionar a extensão .json ao nome do arquivo, se necessário
  if (!nomeArquivo.endsWith('.json')) {
    nomeArquivo += '.json';
  }

  let objetosExistente = [];
  if (fs.existsSync(nomeArquivo)) {
    // Se o arquivo já existe, ler os objetos existentes
    const arquivoExistente = fs.readFileSync(nomeArquivo, 'utf-8');
    objetosExistente = JSON.parse(arquivoExistente);
  }

  // Adicionar o objeto encontrado ao array de objetos existentes
  objetosExistente.push(objetoEncontrado);

  // Salvar os objetos no arquivo JSON
  fs.writeFileSync(nomeArquivo, JSON.stringify(objetosExistente, null, 2));
}

//Fim das Funções de controle JSON

// Adicionar um objeto e excluir o objeto mais antigo se necessário
//Vamos criar a estrutura do banco de dados que agora ficará num arquivo JSON
function addObject(numeroId, flowState, id, interact, nome, maxObjects) {
  const dadosAtuais = readJSONFile(DATABASE_FILE);

  // Verificar a unicidade do numeroId
  const existeNumeroId = dadosAtuais.some(objeto => objeto.numeroId === numeroId);
  if (existeNumeroId) {
    throw new Error('O numeroId já existe no banco de dados.');
  }

  const objeto = { numeroId, flowState, id, interact, nome};

  if (dadosAtuais.length >= maxObjects) {
    // Excluir o objeto mais antigo
    dadosAtuais.shift();
  }

  dadosAtuais.push(objeto);
  writeJSONFile(DATABASE_FILE, dadosAtuais);
}

// Excluir um objeto
function deleteObject(numeroId) {
  const dadosAtuais = readJSONFile(DATABASE_FILE);
  const novosDados = dadosAtuais.filter(obj => obj.numeroId !== numeroId);
  writeJSONFile(DATABASE_FILE, novosDados);
}

// Verificar se o objeto existe no banco de dados
function existsDB(numeroId) {
  const dadosAtuais = readJSONFile(DATABASE_FILE);
  return dadosAtuais.some(obj => obj.numeroId === numeroId);
}

// Atualizar a propriedade "nome"
function updateNome(numeroId, nome) {
  const dadosAtuais = readJSONFile(DATABASE_FILE);
  const objeto = dadosAtuais.find(obj => obj.numeroId === numeroId);
  if (objeto) {
    objeto.nome = nome;
    writeJSONFile(DATABASE_FILE, dadosAtuais);
  }
}
  
// Ler a propriedade "nome"
function readNome(numeroId) {
  const objeto = readMap(numeroId);
  return objeto ? objeto.nome : undefined;
}

// Atualizar a propriedade "flowState"
function updateFlow(numeroId, flowState) {
  const dadosAtuais = readJSONFile(DATABASE_FILE);
  const objeto = dadosAtuais.find(obj => obj.numeroId === numeroId);
  if (objeto) {
    objeto.flowState = flowState;
    writeJSONFile(DATABASE_FILE, dadosAtuais);
  }
}
  
// Ler a propriedade "flowState"
function readFlow(numeroId) {
  const objeto = readMap(numeroId);
  return objeto ? objeto.flowState : undefined;
}

// Atualizar a propriedade "id"
function updateId(numeroId, id) {
  const dadosAtuais = readJSONFile(DATABASE_FILE);
  const objeto = dadosAtuais.find(obj => obj.numeroId === numeroId);
  if (objeto) {
    objeto.id = id;
    writeJSONFile(DATABASE_FILE, dadosAtuais);
  }
}
  
// Ler a propriedade "id"
function readId(numeroId) {
  const objeto = readMap(numeroId);
  return objeto ? objeto.id : undefined;
}

// Atualizar a propriedade "interact"
function updateInteract(numeroId, interact) {
  const dadosAtuais = readJSONFile(DATABASE_FILE);
  const objeto = dadosAtuais.find(obj => obj.numeroId === numeroId);
  if (objeto) {
    objeto.interact = interact;
    writeJSONFile(DATABASE_FILE, dadosAtuais);
  }
}
  
// Ler a propriedade "interact"
function readInteract(numeroId) {
  const objeto = readMap(numeroId);
  return objeto ? objeto.interact : undefined;
}

// Ler o objeto completo
function readMap(numeroId) {
  const dadosAtuais = readJSONFile(DATABASE_FILE);
  const objeto = dadosAtuais.find(obj => obj.numeroId === numeroId);
  return objeto;
}

client.on('message', async msg => {

if (!existsDB(msg.from) && (msg.body === 'ATIVAR FUNIL BASICO' || msg.body === 'ativar funil basico' || msg.body === 'Ativar funil basico') && msg.from.endsWith('@c.us') && !msg.hasMedia) {
      const chat = await msg.getChat();
      await chat.sendStateTyping(); // Simulando Digitação
      await delay(3000); //Delay de 3000 milisegundos mais conhecido como 3 segundos
      await msg.reply('Olá! Seja muito bem vindo. Você entrou no *Funil Basico Advanced* do treinamento Chatbot projetado pelo Johnny'); //Primeira mensagem de texto
      await delay(3000); //delay de 1 segundo
      await client.sendMessage(msg.from, 'Você vai ter contato com as funcionalidades básicas do nosso projeto e poderá ver o quanto é fácil criar seus próprios funis personalizados ao seu negócio.');
      await delay(3000); //delay de 3 segundos        
      await client.sendMessage(msg.from, '*Olha que bacana*\n\nDigite:\n⏩ 1. Se acha Bacana Demais\n⏩ 2. Se concorda muito mesmo\n\nDigite abaixo 👇');
      addObject(msg.from, 'step00', JSON.stringify(msg.id.id), 'done', null, 100);
      salvarNoJSON('advancedintro.json',msg.from);
}
  
if (existsDB(msg.from) && readFlow(msg.from) === 'step00' && readId(msg.from) !== JSON.stringify(msg.id.id) && readInteract(msg.from) === 'done' && msg.body === '1' && msg.from.endsWith('@c.us')) {
      updateInteract(msg.from, 'typing');
      updateId(msg.from, JSON.stringify(msg.id.id));
      const chat = await msg.getChat();
      await msg.react('👍');
      await chat.sendStateTyping(); //Simulando digitação
      await delay(3000); //Delay de 3 segundos
      await client.sendMessage(msg.from, 'Você escolheu a opção *Bacana demais*. Isso é muito bom, pois na prática você vai se comunicar com seus clientes exatamente desta maneira.');
      await delay(3000); //Delay de 3 segundos
      await client.sendMessage(msg.from, 'Agora eu vou te mandar um audio gravado mas enviado como se fosse fresquinho!!');
      await chat.sendStateRecording(); //Simulando audio gravando
      await delay(5000); //Delay de 5 segundos
      const formal1 = MessageMedia.fromFilePath('./audio_base.ogg'); // Arquivo de audio em ogg gravado
      await client.sendMessage(msg.from, formal1, {sendAudioAsVoice: true}); // enviando o audio1
      await delay(4000); //Delay de 4 segundos
      await client.sendMessage(msg.from, 'Agora quero te mandar uma imagem');
      await delay(3000); //Delay de 3 segundos
      const img1 = MessageMedia.fromFilePath('./imagem_base.png'); // arquivo em imagem
      await client.sendMessage(msg.from, img1, {caption: 'Olha que legal'}); //Enviando a imagem
      await delay(3000); //Delay de 3 segundos
      await client.sendMessage(msg.from, 'Prontinho! Agora use a sua criatividade para criar sequencias poderosas. O céu é o limite');
      updateFlow(msg.from,'stepBacana');
      updateInteract(msg.from, 'done');
      salvarNoJSON('advancedmid.json',msg.from);
}

if (existsDB(msg.from) && readFlow(msg.from) === 'step00' && readId(msg.from) !== JSON.stringify(msg.id.id) && readInteract(msg.from) === 'done' && msg.body === '2' && msg.from.endsWith('@c.us')) {
      updateInteract(msg.from, 'typing');
      updateId(msg.from, JSON.stringify(msg.id.id));
      const chat = await msg.getChat();
      await chat.sendStateTyping(); //Simulando digitação
      await delay(3000); //Delay de 3 segundos
      await client.sendMessage(msg.from, 'Você escolheu a opção *Eu concordo, mto mesmo..* Isso é muito bom, pois na prática você vai se comunicar com seus clientes exatamente desta maneira.');
      await delay(3000); //Delay de 3 segundos
      await client.sendMessage(msg.from, 'Vou te mostrar agora as formatações de texto\n\nNegrito:\n*Olha eu estou em negrito*\n\nItálico:\n_Olha eu estou em itálico_\n\nMonoespaçado:\n```Olha eu estou monoespaçado```\n\nTachado:\n~Olha eu estou tachado~\n\nE para não esquecer, os emojis:\n😂 😍 🚀 🎉 🐱');
      await delay(3000); //Delay de 3 segundos
      await client.sendMessage(msg.from, 'Agora eu vou te mandar um audio gravado mas enviado como se fosse fresquinho!!');
      await chat.sendStateRecording(); //Simulando audio gravando
      await delay(5000); //Delay de 5 segundos
      const audio = MessageMedia.fromFilePath('./audio_base.ogg'); // Arquivo de audio em ogg gravado
      await client.sendMessage(msg.from, audio, {sendAudioAsVoice: true}); // enviando o audio
      await delay(4000); //Delay de 4 segundos
      await client.sendMessage(msg.from, 'Agora quero te mandar uma imagem');
      await delay(3000); //Delay de 3 segundos
      const imagem = MessageMedia.fromFilePath('./imagem_base.png'); // arquivo em imagem
      await client.sendMessage(msg.from, imagem, {caption: 'Eis a imagem'}); //Enviando a imagem
      await delay(4000); //Delay de 4 segundos
      await client.sendMessage(msg.from, 'Agora quero te mandar um arquivo em PDF');
      await delay(3000); //Delay de 3 segundos
      const pdf = MessageMedia.fromFilePath('./pdf_base.pdf'); // arquivo PDF
      await client.sendMessage(msg.from, pdf, {caption: 'Eis o PDF'}); //Enviando PDF
      await delay(4000); //Delay de 4 segundos
      await client.sendMessage(msg.from, 'E pra terminar o videozin (caminho para o chrome definido laaa pra cima)');
      await delay(3000); //Delay de 3 segundos
      const video = MessageMedia.fromFilePath('./video_base.mp4'); // arquivo Video
      await client.sendMessage(msg.from, video, {caption: 'Eis o Video'}); //Enviando Video
      await delay(3000); //Delay de 3 segundos
      await client.sendMessage(msg.from, 'Prontinho! Agora use a sua criatividade para criar fluxos poderosos. O céu é o limite\n\n⏩ 1. Para continuar no fluxo digite 1');
      updateFlow(msg.from,'stepConcordo');
      updateInteract(msg.from, 'done');
      salvarNoJSON('advancedmid.json',msg.from);
}

if (existsDB(msg.from) && readFlow(msg.from) === 'stepConcordo' && readId(msg.from) !== JSON.stringify(msg.id.id) && readInteract(msg.from) === 'done' && msg.body === '1' && msg.from.endsWith('@c.us')) {
      updateInteract(msg.from, 'typing');
      updateId(msg.from, JSON.stringify(msg.id.id));
      const chat = await msg.getChat();
      await msg.react('👍');
      await chat.sendStateTyping(); //Simulando digitação
      await delay(3000); //Delay de 3 segundos
      await client.sendMessage(msg.from, 'Eeeeita nois!! Vamos pra cima. Você apertou 2 e depois apertou 1. \n\nIsso é possível porque agora usamos banco de dados para acompanhar o fluxo.\n\nAh, e antes que eu me esqueça. *Me diga o seu nome*');
      updateFlow(msg.from,'stepEndConcordo');
      updateInteract(msg.from, 'done');
      salvarNoJSON('advancedconcordo.json',msg.from);
}

if (existsDB(msg.from) && readFlow(msg.from) === 'stepEndConcordo' && readId(msg.from) !== JSON.stringify(msg.id.id) && readInteract(msg.from) === 'done' && msg.body !== null && msg.from.endsWith('@c.us')) {
    updateInteract(msg.from, 'typing');
    updateId(msg.from, JSON.stringify(msg.id.id));
    updateNome(msg.from, msg.body);
    const chat = await msg.getChat();
    await chat.sendStateTyping(); //Simulando digitação
    await delay(3000); //Delay de 3 segundos
    await client.sendMessage(msg.from, `Olha que loucura, você falou o seu nome e eu consegui guarda-lo em meu *banco de dados*.\n\nSeu nome é ${readNome(msg.from)}`);
    updateFlow(msg.from,'stepNome');
    updateInteract(msg.from, 'done');
    salvarNoJSON('advancednome.json',msg.from);
}
  
});

// Central de Controle Advanced

function formatarContato(numero, prefixo) {
  const regex = new RegExp(`^${prefixo}(\\d+)`);
  const match = numero.match(regex);

  if (match && match[1]) {
    const digits = match[1];
    return `55${digits}@c.us`;
  }

  return numero;
}

function getRandomDelay(minDelay, maxDelay) {
  const randomDelay = Math.random() * (maxDelay - minDelay) + minDelay;
  return Math.floor(randomDelay);
}

function extrairNomeArquivo(str, posicao) {
  const partes = str.split(' ');
  if (posicao >= 0 && posicao < partes.length) {
    return partes[posicao];
  }
  return null;
}

function extrairContatos(leadsTopo, leadsFundo, quantidade) {
  if (leadsFundo === null) {
    return leadsTopo.slice(0, quantidade).map(objeto => objeto.numeroId);
  }

  const contatos = leadsTopo
    .filter(contato => !leadsFundo.includes(contato))
    .slice(0, quantidade)
    .map(objeto => objeto.numeroId);
  return contatos;
}

async function obterUltimaMensagem(contato) {
  const chat = await client.getChatById(contato);
  const mensagens = await chat.fetchMessages({ limit: 1 });

  if (mensagens.length > 0) {
    const ultimaMensagem = mensagens[mensagens.length - 1];
    return ultimaMensagem.body;
  }

  return "Nenhuma mensagem encontrada";
}  

async function escutarGrupos() {
  const chats = await client.getChats();
  const contatos = [];

  for (let i = 0; i < chats.length; i++) {
    const chat = chats[i];
    if (!chat.isGroup) continue; // Ignora contatos individuais

    const contato = chat.id._serialized;
    const ultimaMensagem = await obterUltimaMensagem(contato);

    contatos.push({ contato, ultimaMensagem });
  }

  return contatos;
}

async function extrairGrupo(grupoId) {
  const chat = await client.getChatById(grupoId);
  const contatos = [];

  chat.participants.forEach(participant => {
    if (!participant.isMe) {
      contatos.push(participant.id._serialized);
    }
  });

  return contatos;
}

function gerarStringAleatoria(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  
  return result;
}

client.on('message_create', async (msg) => {

  //Instruções da Central de Controle
  if (msg.fromMe && msg.body.startsWith('!help') && msg.to === msg.from) {    
    await client.sendMessage(msg.from, `*Sistema de Controle v1.0*\n\nFormato do *contato*: xxyyyyyyyyy\n\n*Atendimento Humano*\nMétodo Direto: "Ativar humano"\nMétodo Indireto: "!humano xxyyyyyyyyy"\n\n*Adicionar Lead a Base*\nMétodo Direto: "Muito legal te ver por aqui!"\nMétodo Indireto: "!start xxyyyyyyyyy"\n\n*Criar Lista de Remarketing*\n!listarmkt leadstopo.json leadsfundo.json listarmkt.json quantidade\n\n*Criar Lista de Grupo*\n!listagrupo id_grupo listagrupo.json\n\n*Pegar o Id de um Grupo*\nForma Direta: 'Hm, 🤔'\nForma Indireta: !escutargrupos\n\n*Disparar Mensagens*\n!disparo lista.json min_delay max_delay init_pos end_pos`);
  }

  //Deletar um contato da Base de Dados (Atendimento Humano)
  if (msg.fromMe && msg.body.startsWith('!humano ') && msg.to === msg.from) {
    let contato = formatarContato(msg.body,'!humano ');
    if(existsDB(contato)){
    deleteObject(contato);}
    await client.sendMessage(msg.from, `Deletei da Base de Dados o numero: ${contato}`);
  }
  
  //Deletar um contato da Base de Dados Método Direto (Atendimento Humano)
  if (msg.fromMe && msg.body === 'Ativar humano' && msg.to !== msg.from) {
    if(existsDB(msg.to)){
      deleteObject(msg.to);}
      await client.sendMessage(msg.from, `Deletei da Base de Dados o numero: ${msg.to}`);    
  }

  //Adicionar um contato na base de dados (Método Indireto)
  if (msg.fromMe && msg.body.startsWith('!start ') && msg.to === msg.from) {
    let contato = formatarContato(msg.body,'!start ');
    if(existsDB(contato)){
    deleteObject(contato);}
    await delay(1000); //Delay de 3000 milisegundos mais conhecido como 3 segundos
    await client.sendMessage(contato, 'Olá! Seja muito bem vindo. Você entrou no Funil Basico do treinamento Chatbot projetado pelo Johnny');
    await delay(1000); //delay de 1 segundo
    await client.sendMessage(contato, 'Você vai ter contato com as funcionalidades básicas do nosso projeto e poderá ver o quanto é fácil criar seus próprios funis personalizados ao seu negócio.');
    await delay(3000); //delay de 3 segundos        
    await client.sendMessage(contato, '*Olha que bacana*\n\nDigite:\n⏩ 1. Se acha Bacana Demais\n⏩ 2. Se concorda muito mesmo\n\nDigite abaixo 👇');
    addObject(contato, 'step0', JSON.stringify(msg.id.id), 'done', 50);
    salvarNoJSON('advancedintro.json',contato);
    await client.sendMessage(msg.from, `Enviei o bloco start ao numero: ${contato}`);
  }

  //Adicionar um contato na base de dados (Método Direto)
  if (msg.fromMe && msg.body === 'Opa, tudo bom?' && msg.to !== msg.from) {
    if(await !existsDB(msg.to)){
    await client.sendMessage(msg.to, 'Olá! Seja muito bem vindo. Você entrou no Funil Basico do treinamento Chatbot projetado pelo Johnny');
    await delay(1000); //delay de 1 segundo
    await client.sendMessage(msg.to, 'Você vai ter contato com as funcionalidades básicas do nosso projeto e poderá ver o quanto é fácil criar seus próprios funis personalizados ao seu negócio.');
    await delay(3000); //delay de 3 segundos        
    await client.sendMessage(msg.to, '*Olha que bacana*\n\nDigite:\n⏩ 1. Se acha Bacana Demais\n⏩ 2. Se concorda muito mesmo\n\nDigite abaixo 👇');
    //addObject(msg.to, 'step0', JSON.stringify(msg.id.id), 'done', 50);
    salvarNoJSON('advancedintro.json',msg.to);
    await client.sendMessage(msg.from, `Enviei o bloco wpp0 ao numero pelo método direto: ${msg.to}`);
    }
  }
  
  //Criar lista de Remarketing
  if (msg.fromMe && msg.body.startsWith('!listarmkt') && msg.to === msg.from) {
    const listaContatos = await extrairContatos(await extrairNomeArquivo(msg.body,1),await extrairNomeArquivo(msg.body,2),await extrairNomeArquivo(msg.body,4));    
    await client.sendMessage(msg.from, `Lista de RMT preparada: \n\n${listaContatos.slice(0, 5)}`);
    writeJSONFile(await extrairNomeArquivo(msg.body,3),listaContatos);
    await client.sendMessage(msg.from, `Arquivos com os contatos pronto: \n\n${await extrairNomeArquivo(msg.body,3)}\n\nQuantidade de Contatos extraidos: ${listaContatos.length}`);
    }

  //Criar lista de Grupo
  if (msg.fromMe && msg.body.startsWith('!listagrupo') && msg.to === msg.from) {
    const listaContatos = await extrairGrupo(await extrairNomeArquivo(msg.body,1));
    await client.sendMessage(msg.from, `Lista de leads preparada: \n\n${listaContatos.slice(0, 5)}`);
    writeJSONFile(await extrairNomeArquivo(msg.body,2),listaContatos);
    await client.sendMessage(msg.from, `Arquivos com os contatos pronto: \n\n${await extrairNomeArquivo(msg.body,2)}\n\nQuantidade de Contatos extraidos: ${listaContatos.length}`);
    }

  //Pegar Id de um grupo (Forma Direta)  
  if (msg.fromMe && msg.body === 'Hm, 🤔' && msg.to !== msg.from) {
    await client.sendMessage(msg.from, `O Id do grupo é:`);
    await client.sendMessage(msg.from, `${msg.to}`);
    }
  
  //Pegar Id de um grupo (Forma Indireta)
  if (msg.fromMe && msg.body.startsWith('!escutargrupos') && msg.to === msg.from) {
    const listaContatos = await escutarGrupos();
    await client.sendMessage(msg.from, `Lista de Grupos: \n\n${JSON.stringify(listaContatos)}`);
    }
  
  //Disparo para Lista 
  if (msg.fromMe && msg.body.startsWith('!disparo') && msg.to === msg.from) {
    const listaContatos = readJSONFile(await extrairNomeArquivo(msg.body, 1));
    const init_pos = await extrairNomeArquivo(msg.body, 4);
    const end_pos = await extrairNomeArquivo(msg.body, 5);
    const min_delay = await extrairNomeArquivo(msg.body, 2);
    const max_delay = await extrairNomeArquivo(msg.body, 3);

    await client.sendMessage(msg.from, `Mínimo Delay: ${min_delay}\nMáximo Delay: ${max_delay}\n\nSegue o topo da lista de contatos, preparando o disparo: \n\n${listaContatos.slice(0, 5)}`);
    await delay(1000); // Delay de 1 segundo
    let index = init_pos;
    const enviarProximaMensagem = async () => {
      if (index < end_pos) {
        const contato = listaContatos[index];            
        await client.sendMessage(contato, 'Opa! Sou o *Johnny Love* e essa é a minha mensagem de remarketing.');
        //await delay(2000);
        //audio
        //await delay(1000);
        //imagem
        //await delay(1000);
        //texto
        //await delay(1000);        
        addObject(contato, 'step00', JSON.stringify(msg.id.id), 'done', null, 100);
        salvarNoJSON('projetoverdade00.json',contato);
        const delayAleatorio = Math.floor(Math.random() * (parseInt(max_delay, 10) - parseInt(min_delay, 10) + 1)) + parseInt(min_delay, 10);
        await client.sendMessage(msg.from, `Enviei o bloco de remarketing ao numero: ${contato} e com delay de ${delayAleatorio}`);
        index++;        
        setTimeout(enviarProximaMensagem, delayAleatorio);        
      }
    };

    enviarProximaMensagem();
  }

});
