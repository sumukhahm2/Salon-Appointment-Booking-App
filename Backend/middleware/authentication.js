
const jwt=require('jsonwebtoken')
const User=require('../model/User')


authentication=async(req,res,next)=>{
    try{
         const role=req.header('Admin')
         console.log(role)
         if(req.header('Authorization'))
         {
            const token=req.header('Authorization')
            console.log(req.header('Authorization'))
            let user
           const data=jwt.verify(token,'wuCCWAcqs7yGQm82QhuXTJep6hRqMUdZQfqSFaVSZHwY3I5kHLpRqWRtFdRKDqJ')
           console.log(data)
            user=await User.findOne({where:{id:data.userId,role:role}})
            if(!user)
            {
                
               return res.status(404).json({message:'User Not Found'})
             }
            req.user=user 
            console.log(user)
            return next()

         }
         else 
           return res.status(401).json({error:'Authorization Token Missing'})

    }
    catch(error){
        console.log(error)
       return res.status(500).json({error:'Something went wrong'})
    }
}

module.exports={authentication}