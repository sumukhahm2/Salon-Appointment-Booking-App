
const Appointment =require('../model/appointment') 
const User=require('../model/User')
const Invoice=require('../model/invoice')
const {createInvoice}=require('./createInvoice')
const sequelize=require('../database/db')
const Sib=require('./Sib')
getNotification=async(req,res,next)=>{

    console.log(req.user)
    //console.log(Object.keys(req.user.__proto__));
    try{
      let notifications
      
       
      if(req.user)
      {
        const query=req.user.role==='admin'?{adminId:req.user.id}:{userId:req.user.id}
        notifications=await Appointment.findAll({where:query,include:[
         {
           model: User, 
           attributes: ['username'],
         }]})
        }
        else
        {
          if(req.query.userId)
            notifications=await Appointment.findAll({where:{adminId:req.query.userId}})
          else  
          notifications=await Appointment.findAll()
        }
       
       console.log(notifications)
       if(notifications)
       {
         return res.status(201).json({message:[...notifications]})
       }
       else{
        return res.status(404).json({message:'No Notifaications'})
       }
    }
    catch(error)
    {
        console.log(error)
       return res.status(500).json({error:'Something Went wrong'})
    }
}

updateAppointment=async (req,res,next)=>{
   console.log(req.body.stafname)
   const t=await sequelize.transaction()
    try{
           
           const service=await Appointment.findOne({where:{id:req.body.id},attributes:['appointmentname','userId','stafname','date','time','price']})
           console.log(service)
           if(!service)
           {
              await t.rollback()
             return  res.status(404).json({error:'Appointment not found'})
           }
           console.log(service.dataValues.appointmentname)
           const userData=await User.findOne({where:{id:service.dataValues.userId},attributes:['email','username']})
           if(!userData)
           {
            await t.rollback()
            return  res.status(404).json({error:'user not found'})

           }
         const response=await Appointment.update({status:req.body.status,stafId:req.body.stafId,stafname:req.body.stafname,time:req.body.time},{where:{id:req.body.id},transaction:t})
         console.log(response)
         if(response)
         {
           appointments={
               servicename:service.dataValues.appointmentname,
               email:userData.dataValues.email,
               time:service.dataValues.time,
               date:service.dataValues.date,
               staf:req.body.stafname,
               price:service.dataValues.price
            }
            const appointment={
              id:req.body.id,
              servicename:service.dataValues.appointmentname,
              stafName:req.body.stafname,
              date:service.dataValues.date,
              time:service.dataValues.time,
              price:service.dataValues.price

            }
            const user={
              username:userData.dataValues.username
            }
            const invoiceUrl=await createInvoice(appointment,user)
            console.log(invoiceUrl)
            if(invoiceUrl)
            {
              const createdInvoice=await Invoice.create({
                appointmentId:req.body.id,
                userId:service.dataValues.userId,
                invoiceURL:invoiceUrl
              },{transaction:t})
            
              if(createdInvoice.error)
              {
                t.rollback()
                console.log(createdInvoice.error)
               return res.status(500).json({error:'Something Went Wrong!'})
              }
              else{
                t.commit()
               const sendMessage=await Sib.sendConfirmationEmail(appointments)
               console.log(sendMessage)
              }
            }
            else{
              t.rollback()
              console.log('error in invoice generation')
              return res.status(500).json({error:'Failed to generate invoice'})
            }
           
         }
         else{
            console.log('error')
            t.rollback()
           return res.status(500).json({error:'Something Went Wrong'})
         }
    }
    catch(error){
      console.log(error)
       return  res.status(500).json({error:'Something Went Wrong'})
    }
}

rescheduleAppointment=async (req,res,next)=>{
  console.log(req.body)
     try{
      
       const response=await Appointment.update({status:req.body.status,stafname:'',date:req.body.date,time:req.body.time},{where:{id:req.body.id}})
       if(response.error)
       {
       return res.status(500).json({error:'Something Went Wrong'})
       }
       else
        return  res.status(200).json({message:`Successfully ${req.body.status==='Pending'?'Rescheduled':'Canceled'}`,data:response})
     }
     catch(error){
      console.log(error)
      return res.status(500).json({error:'Something Went Wrong'})
     }
}

module.exports={getNotification,updateAppointment,rescheduleAppointment}