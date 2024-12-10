const FeedBack=require('../model/feedback')
const User=require('../model/User')

postFeedBack=async(req,res,next)=>{
    console.log(req.body)
    try{
        const data={
            serviceId:req.body.id,
            stafId:req.body.stafId,
            feedback:req.body.feedback,
            rating:req.body.rating,
            replyId:req.body.replyId

        }
        const response=await req.user.createFeedback(data)
        console.log(response)

        if(response.error)
        {
            return res.status(500).json({error:'Unable to Send Feedback Something Went Wrong'})
        }
        return res.status(200).json({message:'Feedback submitted successfully',data:{...response.dataValues,user:{username:req.user.username}}})
    }
    catch(error){ 
        console.log(error)
        res.status(500).json({error:'Something Went Wrong'})
    }
}


getFeedBacks=(req,res,next)=>{
    try{
      const chats=req.user.getFeedbacks({where:{serviceId:id}})
      
      if(chats)
      {
        return res.status(200).json({message:{...chats}})
      }
      else
         return res.status(404).json({error:'No Feedbacks Found'})
    }
    catch(error){
       console.log(error)
       return res.status(500).json({error:'Something went wrong'})
    }
}

getAllFeedBacks=async(req,res,next)=>{
    const serviceId=req.query.serviceId
    console.log(serviceId)
    try{
      const chats=await FeedBack.findAll({where:{serviceId:serviceId},
        attributes:['feedback','rating','id','replyId'],
        include:{
            model:User,
            attributes:['username']
        } 
    })
      console.log(chats)
      if(chats)
      {
        return res.status(200).json({message:[...chats]})
      }
      else
         return res.status(404).json({error:'No Feedbacks Found'})
    }
    catch(error){
       console.log(error)
       return res.status(500).json({error:'Something went wrong'})
    }
}

module.exports={postFeedBack,getFeedBacks,getAllFeedBacks}