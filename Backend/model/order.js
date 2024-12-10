const sequelize=require('../database/db')
 const Sequelize=require('sequelize')

const Order=sequelize.define('order',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    paymentId:{
        type:Sequelize.STRING,
        
    },
    OrderId:{
        type:Sequelize.STRING,
        
    },
    status: { 
        type:Sequelize.STRING,
}
})

module.exports=Order