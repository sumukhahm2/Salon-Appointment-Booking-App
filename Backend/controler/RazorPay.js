const Razorpay=require('razorpay')
const Order=require('../model/order')
const Appointment=require('../model/appointment')
const dotenv=require('dotenv')
const sequelize=require('../database/db')
const SalonServices=require('../model/salonServices')

exports.payAmount=async(req,res,next)=>{
  const t=await sequelize.transaction()
  console.log(req.query.amount)
  console.log(Object.keys(req.user.__proto__));
    try{                    
       const rzp=new Razorpay({
        key_id:process.env.RAZOR_PAY_KEY_ID, 
        key_secret:process.env.RAZOR_PAY_KEY_SECRET
       })
       const amount=req.query.amount*100
      console.log(amount)
       rzp.orders.create({amount,currency:'INR'},async(err,order)=>{
        if(err){
           console.log(err)
        }    
        else{
          console.log(order)
            const ordr=await req.user.createOrder({OrderId:order.id,status:'PENDING'},{transaction:t})
           if(ordr)
          {
            await t.commit()
            console.log(ordr) 
            return res.status(201).json({order,key_id:rzp.key_id})
          }
          else
          {
            await t.rollback()
          throw new Error(err)
          }
        }
       })
    }
    catch(error){
      await t.rollback()
        console.log(error)
    }
}

exports.updateTransaction=async (req,res,next)=>{
  const t=await sequelize.transaction()
    try{  
      console.log(req.body)
       const {payment_id,order_id}=req.body
       const order=await Order.findOne({where:{OrderId:order_id}},{transaction:t})
       if(order)
       {
       
        const result=await order.update({paymentId:payment_id,status:'SUCCESSFUL'},{transaction:t})
         if(result)
         {
          await t.commit() 

          const adminId=await SalonServices.findOne({where:{id:req.body.appointmentData.id},attributes:['userId']})
          console.log(adminId.dataValues.userId)
            const apoointmentData={
                appointmentname:req.body.appointmentData.servicename,
                stafId:req.body.appointmentData.stafId,
                stafname:'',
                salonserviceId:req.body.appointmentData.id,
                status:'Pending',
                adminId:adminId.dataValues.userId,
                date:req.body.appointmentData.date,
                time:req.body.appointmentData.time,
                price:req.body.appointmentData.price
            }
            const appointment=await req.user.createAppointment(apoointmentData)
            
            if(appointment)
            {
              
              return res.status(201).json({message:'Transaction Successful'})
            }
            else{
               
               console.log('Something went wrong')
            }
           
         }
       }
       else{
           await t.rollback()
       }             
}
catch(err){
  
    console.log(err)
}


}

