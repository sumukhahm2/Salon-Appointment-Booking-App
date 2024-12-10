const pdfDocument=require('pdfkit')

const Invoice=require('../model/invoice')

const fs=require('fs')

const path=require('path')

const s3BucketControler=require('./S3Bucket')


 const createInvoice=async(appointment,user)=>{
     console.log(appointment)
     console.log(user)
     try{
     const invoicesDir = path.join(__dirname, 'invoices');
    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir, { recursive: true }); // Create directory if it doesn't exist
    }
    const invoicePath=path.join(__dirname,`invoices/invoice-${appointment.id}.pdf`)

    const pdfDoc=new pdfDocument()
    const writeStream=fs.createWriteStream(invoicePath)
    writeStream.on('open', () => console.log('Write stream opened.'));
writeStream.on('finish', () => console.log('Write stream finished writing.'));
writeStream.on('error', (err) => console.error('Write stream error:', err));
    pdfDoc.pipe(writeStream);

    pdfDoc
          .fontSize("40")
          .text("Salon Booking Invoice",{align:'center'})
          .moveDown()

    pdfDoc
           .fontSize("20")
           .text("")    
           .text(`Invoice ID: ${appointment.id}`)
           .text(`Date: ${new Date().toLocaleDateString()}`)
            .text(`User Name: ${user.username}`)
            .text(`Service Name: ${appointment.servicename}`)
            .text(`Staff Name: ${appointment.stafName}`)
            .text(`Appointment Date: ${appointment.date}`)
            .text(`Appointment Time: ${appointment.time}`)
            .text(`Total Amount: Rs${appointment.price}`, { align: 'right' })
            .moveDown();

     console.log('hello')
      await new Promise((resolve,reject)=>{
          writeStream.on('finish', resolve); // Wait for the file stream to finish writing
    writeStream.on('error', reject);
          pdfDoc.end();
          
      }) 
      console.log(`PDF saved locally at: ${invoicePath}`);
      const data=fs.readFileSync(invoicePath)

        console.log('Buffer size before upload:', data.length); 

          // if (!data || data.length === 0) {
          // throw new Error('Empty file buffer. PDF generation failed.');
          // }

      const fileName=`invoices/invoice-${appointment.id}.pdf`
      const contentType='application/pdf'

     const fileUrl=await  s3BucketControler.upLoadToS3(data,fileName,contentType)
 
     fs.unlinkSync(invoicePath);
      console.log(fileUrl)
    return fileUrl.location
    
    
     }
catch (error) {
          console.error('Error in createInvoice:', error);
          throw new Error('Failed to create invoice');
        }
     
}

const getInvoice=async(req,res,next)=>{
       const apptId=req.query.appointmentId
     try{
        const invoice=await Invoice.findOne({where:{userId:req.user.id,appointmentId:apptId}},{attributes:['invoiceURL']})

        console.log(invoice)
        return res.status(200).json({message:invoice})
     }
     catch(error)
     {
          console.log(error)
          return res.status(500).json({error:'Something went wrong'})
     }
}

module.exports={createInvoice,getInvoice}