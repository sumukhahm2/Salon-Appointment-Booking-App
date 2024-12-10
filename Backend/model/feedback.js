const sequelize=require('../database/db')
 const Sequelize=require('sequelize')

const FeedBack=sequelize.define('feedback',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    serviceId:{
        type:Sequelize.INTEGER,
     
    },
    userId:{
        type:Sequelize.INTEGER,
       
    },
    rating:{
        type:Sequelize.INTEGER,
       
    },
    feedback:{
        type:Sequelize.TEXT,
        allowNull:false,

    },
    replyId:{
        type:Sequelize.INTEGER,
    }
   
})

module.exports=FeedBack