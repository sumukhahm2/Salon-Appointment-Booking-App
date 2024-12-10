const express=require('express')
const dotenv=require('dotenv')
const http=require('http')
const path=require('path')
const sequelize=require('./database/db')
const bodyparser=require('body-parser')
const SocketEvents=require('./Socket/Socket.js')
const Cronjob=require('./controler/cronsJob')
const User=require('./model/User')
const UserProfile=require('./model/userProfile')
const SalonServices=require('./model/salonServices')
const Staf=require('./model/staf') 
const Order=require('./model/order')
const Appointment=require('./model/appointment')
const Invoice=require('./model/invoice')
const FeedBack=require('./model/feedback')

dotenv.config()
const helmet=require('helmet')
const morgan=require('morgan')

const userRoute=require('./routes/user')
const userProfileRoute=require('./routes/userProfile')
const adminRoute=require('./routes/admin')
const stafRoute=require('./routes/staf')
const salonServicesRoute=require('./routes/salonServices')
const feedBackRoute=require('./routes/feedback')

const cors=require('cors')
const app=express()
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server,{
    cors: {
      origin: "http://13.61.4.12:3000",
      methods: ["GET", "POST"],
      "ExposeHeaders": ["Content-Disposition"],
    }
  });

  SocketEvents(io)
  app.use(cors())
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json())
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet()) 
app.use(morgan('tiny'))


User.hasOne(UserProfile)
UserProfile.belongsTo(User)

User.hasMany(SalonServices)
SalonServices.belongsTo(User)

User.hasMany(Staf)
Staf.belongsTo(User)
 
User.hasMany(Order)
Order.belongsTo(User)

User.hasMany(Appointment)
Appointment.belongsTo(User)

User.hasMany(Appointment)
Appointment.belongsTo(User)

Staf.hasMany(SalonServices)
SalonServices.belongsTo(Staf)

SalonServices.hasMany(Appointment);
Appointment.belongsTo(SalonServices);

// Staff has many Appointments
Staf.hasMany(Appointment);
Appointment.belongsTo(Staf);

User.hasMany(FeedBack)
FeedBack.belongsTo(User)

SalonServices.hasMany(FeedBack)
FeedBack.belongsTo(SalonServices)

app.use(userRoute)    
app.use(userProfileRoute)
app.use(stafRoute)
app.use(adminRoute)
app.use(salonServicesRoute)
app.use(feedBackRoute)

// Cronjob()

 const _dirname=path.dirname("")
const buildPath=path.join(_dirname,"../salon-booking-app/build")

app.use(express.static(buildPath))

app.use((req,res)=>{
    res.sendFile(    
        path.join(__dirname,"../salon-booking-app/build/index.html")
    )
})
sequelize.sync()         
.then(result=>{
        
    const port=process.env.PORT||4000

    
    server.listen(port, () => {
        console.log(`Sample app listening at http://13.61.4.12:${port}`)
     })
})
.catch(error=>{
    console.log(error) 
}) 