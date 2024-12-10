const Sequelize=require('sequelize')
const sequelize=require('../database/db')


const SalonServices=sequelize.define('salonservices',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    }, 
   
    servicename:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:false
    },
    description:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:false
    },
    duration:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:false
    },
    price:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:false
    },
   availabality:{
    type:Sequelize.STRING, 
    allowNull:true,
    unique:false
   },

})

module.exports=SalonServices