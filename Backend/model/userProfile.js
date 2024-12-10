const Sequelize=require('sequelize')
const sequelize=require('../database/db')


const UserProfile=sequelize.define('userprofile',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    name:{
        type:Sequelize.STRING,
        allowNull:true, 
        unique:false
    } ,
    dob:{
        type:Sequelize.STRING,
        allowNull:true, 
        unique:false
        
    },
    gender:{
        type:Sequelize.STRING,
        allowNull:true,
        unique:false
    },
   
   address:{
    type:Sequelize.STRING, 
    allowNull:false,
    unique:true
   },
   photo:{
    type:Sequelize.STRING, 
    allowNull:true,
    unique:false
   }
})

module.exports=UserProfile