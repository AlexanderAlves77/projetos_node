const express = require("express")
const app = express()
const bodyParser = require('body-parser')
const bancoDeDados = require('./bancoDeDados')
const PORT = 3003

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get("/produtos", (req, res, next) => {
    res.send(bancoDeDados.getAllProducts())
})

app.get("/produto/:id", (req, res, next) => {
    const id = req.params.id
    res.send(bancoDeDados.getProduct(id))
})

app.post("/produtos", (req, res, next) => {
    const product = bancoDeDados.saveProduct({
        nome: req.body.nome,
        preco: req.body.preco
    })
    res.send(product)
})

app.put("/produtos/:id", (req, res, next) => {
    const product = bancoDeDados.saveProduct({
        id: req.params.id,
        nome: req.body.nome,
        preco: req.body.preco
    })
    res.send(product)
})

app.delete("/produtos/:id", (req, res, next) => {
    const product = bancoDeDados.deleteProduct(req.params.id)
    res.send(product)
})

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}.`))