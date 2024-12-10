const sequelize=require('../database/db')
const SalonServices=require('../model/salonServices')


postsalonServices=async(req,res,next)=>{
     const t=await sequelize.transaction()
     console.log(req.body)
    try{
       const services={
           servicename:req.body.info.servicename,
           description:req.body.info.description,
           duration:req.body.info.duration,
           price:req.body.info.price,
           availabality:req.body.info.availabality,
           userId:req.user.id
           
       } 
       
       const response=await SalonServices.create(services,{transaction:t})
      
       if(response.error)
       {
          await t.rollback()
          console.log(response.error)
        return res.status(500).json({error:'Something went wrong'})
       }
      await t.commit()

      return res.status(201).json({message:'Successfully Added Services',services:response.dataValues})
        
      }
      catch(error)
      {
         await t.rollback()
         console.log(error)
        return res.status(500).json({error:'Something went wrong'})
      }
}

  
  getsalonServices=async(req,res,next)=>{
     const id=req.query.id
   try{
    let services
    
     if(id)
     {
      services=await SalonServices.findAll({where:{userId:id}})
     }
     else
     {
      services=await SalonServices.findAll()
     }
   
     console.log(services)
     if(services)
     {
       return res.status(201).json({message:[...services]})
     }
     return res.status(404).json({error:'No services Found'})
   }
   catch(error)
   {
      console.log(error)
      return res.status(500).json({error:'Something Went Wrong'})
   }
  }   

  getAdminSalonServices=async(req,res,next)=>{
    try{
      const services=await req.user.getSalonservices()
      console.log(services)
      if(services)
        {
          let service=[]
          for(let i=0;i<services.length;i++)
          {
            service.push(services[i].dataValues)
          }
          return res.status(201).json({message:[...service]})
        }
        return res.status(404).json({error:'No services Found'})
    }
    catch(error){ 
      console.log(error)
      return res.status(500).json({error:'Something Went Wrong'})
    }
  }

  module.exports={postsalonServices,getsalonServices,getAdminSalonServices}