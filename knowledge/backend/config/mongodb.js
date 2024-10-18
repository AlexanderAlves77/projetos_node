const { urlMongo } = require("../.env")

const mongoose = require("mongoose")
mongoose.connect(urlMongo, { 
    useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('\x1b[32m%s\x1b[0m', 'Conexão bem sucedida com o MongoDB' ,'\x1b[0m'))
    .catch(err => {
        const msg = "ERRO! Não foi possível conectar com o MongoDB"
        console.log('\x1b[41m%s\x1b[37m', msg, '\x1b[0m')
    })