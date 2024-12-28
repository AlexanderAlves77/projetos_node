// Invocamos o leitor de qr code
const qrcode = require('qrcode-terminal');
const { Client, Buttons, List, MessageMedia, LocalAuth } = require('whatsapp-web.js');

//const client = new Client();

const sessao = 'legacy';

// Final das variáveis do seu modelo
const wwebVersion = '2.2407.3';
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

//Vamos montar a estrutura do banco de dados que ficará na memória (Projetado pelo Johnny Love)

const database = new Map();

function addObject(numeroId, flowState, id, interact, nome) {
  database.set(numeroId, { flowState, id, interact, nome});
}

function deleteObject(numeroId) {
  database.delete(numeroId);
}

function existsDB(numberId) {
  return database.has(numberId);
}

function updateNome(numeroId, nome) {
  const object = database.get(numeroId);
  object.nome = nome;
  database.set(numeroId, object);
}

function readNome(numeroId) {
  const object = database.get(numeroId);
  return object.nome;
}

function updateFlow(numeroId, flowState) {
    const object = database.get(numeroId);
    object.flowState = flowState;
    database.set(numeroId, object);
}
  
function readFlow(numeroId) {
    const object = database.get(numeroId);
    return object.flowState;
}

function updateId(numeroId, id) {
    const object = database.get(numeroId);
    object.id = id;
    database.set(numeroId, object);
}
  
function readId(numeroId) {
    const object = database.get(numeroId);
    return object.id;
}

function updateInteract(numeroId, interact) {
    const object = database.get(numeroId);
    object.interact = interact;
    database.set(numeroId, object);
}
  
function readInteract(numeroId) {
    const object = database.get(numeroId);
    return object.interact;
}

client.on('message', async msg => {

if (!existsDB(msg.from) && (msg.body === 'ATIVAR FUNIL BASICO' || msg.body === 'ativar funil basico' || msg.body === 'Ativar funil basico') && msg.from.endsWith('@c.us') && !msg.hasMedia) {
      const chat = await msg.getChat();
      await chat.sendStateTyping(); // Simulando Digitação
      await delay(3000); //Delay de 3000 milisegundos mais conhecido como 3 segundos
      await msg.reply('Olá! Seja muito bem vindo. Você entrou no Funil Basico do treinamento Chatbot projetado pelo Johnny'); //Primeira mensagem de texto
      await delay(3000); //delay de 1 segundo
      await client.sendMessage(msg.from, 'Você vai ter contato com as funcionalidades básicas do nosso projeto e poderá ver o quanto é fácil criar seus próprios funis personalizados ao seu negócio.');
      await delay(3000); //delay de 3 segundos        
      await client.sendMessage(msg.from, '*Olha que bacana*\n\nDigite:\n⏩ 1. Se acha Bacana Demais\n⏩ 2. Se concorda muito mesmo\n\nDigite abaixo 👇');
      addObject(msg.from, 'step00', msg.id, 'done', null);
}
  
if (existsDB(msg.from) && readFlow(msg.from) === 'step00' && readId(msg.from) !== msg.id && readInteract(msg.from) === 'done' && msg.body === '1' && msg.from.endsWith('@c.us')) {
      updateInteract(msg.from, 'typing');
      updateId(msg.from, msg.id);
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
}

if (existsDB(msg.from) && readFlow(msg.from) === 'step00' && readId(msg.from) !== msg.id && readInteract(msg.from) === 'done' && msg.body === '2' && msg.from.endsWith('@c.us')) {
      updateInteract(msg.from, 'typing');
      updateId(msg.from, msg.id);
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
}

if (existsDB(msg.from) && readFlow(msg.from) === 'stepConcordo' && readId(msg.from) !== msg.id && readInteract(msg.from) === 'done' && msg.body === '1' && msg.from.endsWith('@c.us')) {
      updateInteract(msg.from, 'typing');
      updateId(msg.from, msg.id);
      const chat = await msg.getChat();
      await msg.react('👍');
      await chat.sendStateTyping(); //Simulando digitação
      await delay(3000); //Delay de 3 segundos
      await client.sendMessage(msg.from, 'Eeeeita nois!! Vamos pra cima. Você apertou 2 e depois apertou 1. \n\nIsso é possível porque agora usamos banco de dados para acompanhar o fluxo.\n\nAh, e antes que eu me esqueça. *Me diga o seu nome*');
      updateFlow(msg.from,'stepEndConcordo');
      updateInteract(msg.from, 'done');
}

if (existsDB(msg.from) && readFlow(msg.from) === 'stepEndConcordo' && readId(msg.from) !== msg.id && readInteract(msg.from) === 'done' && msg.body !== null && msg.from.endsWith('@c.us')) {
    updateInteract(msg.from, 'typing');
    updateId(msg.from, msg.id);
    updateNome(msg.from, msg.body);
    const chat = await msg.getChat();
    await chat.sendStateTyping(); //Simulando digitação
    await delay(3000); //Delay de 3 segundos
    await client.sendMessage(msg.from, `Olha que loucura, você falou o seu nome e eu consegui guarda-lo em meu *banco de dados*.\n\nSeu nome é ${readNome(msg.from)}`);
    updateFlow(msg.from,'stepNome');
    updateInteract(msg.from, 'done');
}
  
});