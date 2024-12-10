const sequelize=require('../database/db')
 const Sequelize=require('sequelize')

const Invoice=sequelize.define('invoice',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    appointmentId:{
        type:Sequelize.STRING,
        allowNull:false,

    },
    userId:{
        type:Sequelize.STRING,
        allowNull:false,

    },
    invoiceURL:{
        type:Sequelize.STRING,
        allowNull:true,
    },
   
})

module.exports=Invoice