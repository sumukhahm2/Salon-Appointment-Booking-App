const sequelize=require('../database/db')
const UserProfile=require('../model/userProfile')

const User=require('../model/User')

postProfileDetails=async(req,res,next)=>{
    const t=await sequelize.transaction()
    try{
        const userProfileData={
            name:req.data.name,
            dob:req.data.dob,
            gender:req.data.gender,
            address:req.data.address,
            photo:req.data.photo,
            userId:req.user.id
        }
        console.log(userProfileData)
        let profile
          profile=await UserProfile.findOne({where:{userId:req.user.id},include:{
            model:User
          }})
        let response
        if(!profile)
        {
         response=await UserProfile.create(userProfileData,{transaction:t})
         profile=response
        }
        else
        {
        response=await UserProfile.update(userProfileData,{where:{id:profile.dataValues.id}},{transaction:t})
        profile={...profile.dataValues,
            dob:req.data.dob,
            gender:req.data.gender,
            address:req.data.address,
            photo:req.data.photo}
        }
   console.log(response)
        if(response.error)
        {
            await t.rollback()
            console.log(response.error)
            return res.status(500).json({error:'Something Went Wrong'})
        }
        console.log(profile)
       await t.commit()
        return res.status(200).json({message:'Successfully updated the profile',data:{profile,...profile.user.dataValues}})

        
    }
    catch(error){
        await t.rollback()
         console.log(error)
        return  res.status(500).json({error:'Something Went Wrong'})
    }
}

getProfileDetails=async(req,res,next)=>{
    if(req.user)
    console.log(req.user)
    try{
        let profiles
        if(req.user)
            profiles=await req.user.getUserprofile()
        else
            profiles=await UserProfile.findAll({include:{model:User,where:{role:'admin'}}})

            console.log(profiles)

        if(req.user)
        {
            const profile=profiles && profiles.dataValues?{...profiles.dataValues}:{}
            return res.status(200).json({message:{profile,username:req.user.username,phone:req.user.phone,email:req.user.email}}) 
        }  
        else
        return res.status(200).json({message:[...profiles]})   

    }
    catch(error){ 
        console.log(error)
        return res.status(500).json({error:'Something Went Wrong'})
    }

}

module.exports={
    postProfileDetails,
    getProfileDetails
}