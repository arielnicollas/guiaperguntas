const Sequelize = require('sequelize')

const connection = new Sequelize('guiaperguntas','root','arini123',{
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = connection;