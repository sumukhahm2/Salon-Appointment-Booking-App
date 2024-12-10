const User=require('../model/User')
const Sequelize=require('sequelize')
const sequelize=require('../database/db')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const dotenv=require('dotenv')

postUserAuthentication=async(req,res,next)=>{
    const t=await sequelize.transaction()
    console.log(req.body)
    try{
       const emailCheck=await checkCredentials({email:req.body.email})
       const phoneCheck=await checkCredentials({phone:req.body.phone})
        console.log(emailCheck)
       if(emailCheck && phoneCheck)
       {
        let signupData
       
         signupData={
            username:req.body.username,
            email:req.body.email,
            password:req.body.password,
            phone:req.body.phone,
            role:req.body.role
        }

        bcrypt.hash(signupData.password,10,async(err,hash)=>{
            if(err)
                console.log(err)
             let response
             response=await User.create({...signupData,password:hash},{transaction:t})
            console.log(Object.keys(response.__proto__));
            console.log(response)
            if(response.error)
            {
                await t.rollback()
               return res.status(500).json({error:'Something went wrong!'})
            }
            else
             { 
                await t.commit()
                return res.status(201).json({message:'User Created Successfully'})
             }
        })
          
       }
       else{
        await t.rollback()
        if(!emailCheck)
          return res.status(409).json({error:'Email  Already Exists'})
        else if(!phoneCheck)
           return  res.status(409).json({error:'Mobile Number  Already Exists'})
       }
        
    }
    catch(error){
        t.rollback()
       return res.status(500).json({error:error.message})

    }
}

postSignInAuthentication=async(req,res,next)=>{
    const t=await sequelize.transaction()
     
    try{
       const checkEmail=await checkCredentials({email:req.body.email,role:req.body.role})
       console.log(checkEmail)
       if(checkEmail!==false)
         return res.send({error:'User Not Found'})
        else{
            let user  
             user=await User.findOne({where:{email:req.body.email},transaction:t})
            console.log()
            bcrypt.compare(req.body.password,user.dataValues.password,(err,response)=>{
                if(err)
                {
                    console.log(err)
                    t.rollback()
                    return res.status(500).json({error:'Something went wrong'})
                } 
                 else if(response)
                    {
                         t.commit()
                        res.status(201).json({message:'User Login Successfully',email:req.body.email,token:generateAccessToken(user.dataValues.id),role:req.body.role})
                    }
                     
                    else
                    {
                        t.rollback()
                        console.log('hello')
                        res.status(401).json({error:'Authentication Failed!'})
                    }
            })
        }
    }
    catch(error){
        console.log(error)
        t.rollback()
        return res.status(500).json({error:error.message})
    }
}


const checkCredentials=(data)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            let user
            if(data.email )
            {   
                user=await User.findOne({where:{email:data.email}})
            }   
              
           else
             user=await User.findOne({where:{phone:data.phone}})

             if(!user)
             {
                resolve(true)
             }
             resolve(false)
        }
        catch(error){
            reject(error)
        }
    })
}

const generateAccessToken=(id)=>{
   return jwt.sign({userId:id},process.env.JWT_TOKEN)
}


module.exports={
    postUserAuthentication,
    postSignInAuthentication
}