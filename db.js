const {Sequelize} = require("sequelize");


module.exports = new Sequelize(
    'db',
    'root',
    'root',
    {
        host: '79.143.24.70',
        port: '6432',
        dialect: 'postgres'
    }
)