const express = require("express")
const app = express();
const bodyparser = require("body-parser")
const Pergunta = require("./database/Pergunta");

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(bodyparser.urlencoded({extended: false}))
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

app.get("/", function(req,res){
    Pergunta.findAll({ raw: true, order: [
        ['id','DESC']
    ]}).then(perguntas => {
        res.render("index.ejs",{
            perguntas: perguntas
        })
    })
  
})

app.get("/perguntar", function(req,res){
    res.render("perguntar.ejs",{
    })
})

app.post("/salvarpergunta", function(req,res){
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect("/")
    })
   
})


app.get("/pergunta/:id", (req,res) => {
    var id = req.params.id
    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta => {
        if(pergunta != undefined){
            res.render("pergunta");
        }else{
            res.redirect("/")
        }
    })
})

app.listen(8080, () => {
    console.log("App rodando")
})