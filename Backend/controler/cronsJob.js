const cron = require('node-cron');
const sib=require('./Sib')
const Appointment = require('../model/appointment'); 
const User = require('../model/User'); 
const {Op}=require('sequelize')
const moment=require('moment')


 
const Cronjob=()=>{
    cron.schedule('* * * * *', async () => {
        console.log('Running Cron Job for Appointment Reminders...');
    
        try {
            
            const upcomingAppointments = await Appointment.findAll({
                where: {
                    date: moment().format('YYYY-MM-DD'), // Today
                    // time: {
                    //     [Op.gte]: moment().format('HH:mm:ss'), // Later today
                    //     [Op.lt]: moment().add(1, 'days').format('HH:mm:ss'), // Within the next 24 hours
                    // },
                    status: 'Success', 
                },
                include: [
                    {
                        model: User,
                        attributes: ['email', 'username'], 
                    },
                ],
            });
         console.log(upcomingAppointments)
            // Send reminders for each upcoming appointment
            for (const appointment of upcomingAppointments) {
                const appointments={
                    email :appointment.user.email,
                    username :appointment.user.username,
                    servicename:appointment.appointmentname,
                    stafname:appointment.stafname,
                      date:appointment.date,
                      time:appointment.time,
                }
                

        const result= await sib.sendConfirmationEmail(appointments)
                
                console.log(result)
                console.log(`Reminder sent to ${email} for appointment on ${date} at ${time}`);
            }
    
        } catch (error) {
            console.error('Error running appointment reminders cron job:', error);
        }
    });
}

module.exports=Cronjob

