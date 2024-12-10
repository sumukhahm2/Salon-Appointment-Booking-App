const Sib=require('sib-api-v3-sdk')

const bcrypt=require('bcrypt')
const { where } = require('sequelize')
const dotenv = require('dotenv');
dotenv.config({ path: `.env.local`, override: true });

exports.sendConfirmationEmail=async(appointment)=>{
 try{   
const email='SalonBooking'
console.log(appointment)

const client=Sib.ApiClient.instance
const apiKey=client.authentications['api-key']

apiKey.apiKey=process.env.API_KEY

const tranEmailApi=new Sib.TransactionalEmailsApi()

const sender={
    email:'salonbooking0@gmail.com' 
}

const reciever=[{
   email:'sumukhahm2@gmail.com'
}] 

tranEmailApi.sendTransacEmail({
    sender,
    to:reciever,
    subject:'Congradulations You are Successfully Booked Appointment! ',
    textContent:'Find Your Appointment Details',
    htmlContent:`<div>
    <h1 style="color: green;">Salon Booking.com</h1>
    <h2>Your Appointment for the service  ${appointment.servicename} is booked on ${appointment.date} ${appointment.time}</h2>
    <h2>StafName:- ${appointment.stafname}</h2>
    </div>`

})
.then(result=>{
    console.log(result)
    return {message:'Confirmation Email Sent SuccessFully'}
})

 }
 catch(err){
    console.log(err)
     return {error:err}
 }
}  


