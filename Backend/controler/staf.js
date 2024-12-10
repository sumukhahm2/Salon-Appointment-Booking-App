

const sequelize=require('../database/db')
const Staf=require('../model/staf')

postAddStaf=async(req,res,next)=>{

    const t= await sequelize.transaction()
    console.log(req.body)
    try{
        const stafData={
            name:req.body.name,
            email:req.body.email,
            phone:req.body.phone,
            specialization:req.body.specialization,
            availabality:req.body.availabality,
            userId:req.user.id
        }

        const response=await Staf.create(stafData,{transaction:t})
        if(response.error)
        {
           await t.rollback()
           console.log(response.error)
           return res.status(500).json({error:'Something Went Wrong'})
        }
        await t.commit()
        return res.status(201).json({message:'Profile added Successfully',staf:response.dataValues})
  
    }
    catch(error){
        await t.rollback()
        console.log(error)
        return res.status(500).json({error:'Something Went Wrong'})
    }
}

getStafs=async(req,res,next)=>{
    try{
       const staf= await Staf.findAll()
       console.log(staf)
       if(staf)
       {
        return res.status(201).json({message:[...staf]})
       }
       return res.status(404).json({error:'No Stafs Found'})
    }
    catch(error){
        console.log(error)
        return res.status(500).json({error:'Something Went Wrong'})
    }
}

getAdminStafs=async(req,res,next)=>{
  try{
    console.log(Object.keys(req.user.__proto__))
      const result=await req.user.getStafs()
      console.log(result)
      if(result)
        {
         return res.status(201).json({message:[...result]})
        }
        return res.status(404).json({error:'No Stafs Found'})
  }
  catch(error)
  {
    console.log(error)
    return res.status(500).json({message:'Something went wrong'})
  }
}

module.exports={postAddStaf,getStafs,getAdminStafs}