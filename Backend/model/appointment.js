const sequelize=require('../database/db')
 const Sequelize=require('sequelize')

const Appointment=sequelize.define('appointment',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    appointmentname:{
        type:Sequelize.STRING,
        allowNull:false,

    },
    stafname:{
        type:Sequelize.STRING,
        allowNull:false,

    },
    time:{
        type:Sequelize.STRING,
        allowNull:true,
    },
    date:{
        type:Sequelize.STRING,
        allowNull:true,
    },
    status:{
        type:Sequelize.STRING,
        allowNull:false,

    },
    adminId:{
        type:Sequelize.INTEGER,
        allowNull:false,
    },
    price:{
        type:Sequelize.INTEGER,
        allowNull:false,
    }
})

module.exports=Appointment