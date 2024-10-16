const express = require("express")
const app = express()
const bodyParser = require('body-parser')
//const bancoDeDados = require('./bancoDeDados')
const PORT = 3003

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get("/produtos", (req, res, next) => {
    res.send({
        nome: 'Notebook',
        preco: 123.46
    })
})

app.post("/produtos", (req, res, next) => {
    res.send({
        nome: 'Notebook',
        preco: 123.46
    })
})

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}.`))