const express = require("express")
const app = express();
const bodyparser = require("body-parser")
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json());

const connection = require("./database/database")

connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com o banco de dados")
    })
    .catch(() => {
        console.log("Não conectou")
    })

app.get("/", (req, res) => {
    Pergunta.findAll({
        raw: true, order: [
            ['id', 'DESC']
        ]
    }).then(perguntas => {
        res.render("index.ejs", {
            perguntas: perguntas
        })
    })

})

app.get("/perguntar", (req, res) => {
    res.render("perguntar.ejs", {
    })
})

app.post("/salvarpergunta", (req, res) => {
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect("/")
    })

})


app.get("/pergunta/:id", (req, res) => {
    var id = req.params.id
    Pergunta.findOne({
        where: { id: id }
    }).then(pergunta => {
        if (pergunta != undefined) {

            Resposta.findAll({
                where: { perguntaId: pergunta.id },
                order: [
                    ['id', 'DESC']
                ]
            }).then(respostas => {
                res.render("pergunta", {
                    pergunta: pergunta,
                    respostas: respostas
                });
            });

        } else {
            res.redirect("/")
        }
    })
})

app.post("/responder", (req, res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;
    console.log(perguntaId)
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect("/pergunta/" + perguntaId);
    })
})

app.listen(8080, () => {
    console.log("App rodando")
})