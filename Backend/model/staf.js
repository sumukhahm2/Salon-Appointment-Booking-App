const Sequelize=require('sequelize')
const sequelize=require('../database/db')


const Staf=sequelize.define('staf',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
        
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    phone: { 
        type:Sequelize.STRING,
        allowNull:false,
        
},
specialization:{
    type:Sequelize.STRING, 
    allowNull:false,
    
},
availabality:{
    type:Sequelize.STRING, 
    allowNull:false,
    
}
})

module.exports=Staf