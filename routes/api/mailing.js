const express=require('express')
const router=express.Router()
const nodemailer=require('nodemailer')

const senderEmail=require('config').get('senderEmail');
const senderPassword=require('config').get('senderPassword');


router.post("/report",(req,res)=>{
   
    const {
        pressedStateSecretUser,
        pressedStateForward,
        selectedEmails,
        filesSelected,
        complaintText,
        name,
        email,
        phone
    }=req.body

    var receiverEmails=[]

    selectedEmails.forEach(email=>{
        if(email.isSelected)
        {
            receiverEmails.push(email.id)
        }
    })

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: senderEmail,
          pass: senderPassword
        }
      });

    if(pressedStateForward)
    {
        var mailOptions = {
            from: senderEmail,
            to: receiverEmails,
            subject: 'Reporting against Cyberbullying',
            text: complaintText,
            html:`<body>${complaintText}</body>
            <br><b>Details of complainant</b><p><b>Name: </b>${name}</p><p><b>Email: </b>${email}</p><p><b>Phone no.:</b>${phone}</p>`,
            attachments:filesSelected
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
              return res.json({"error":"failed to send mail"})
            } else {
              console.log('Email sent: ' + info.response);
              return res.json({"message":"Successfully sent!!"})
            }
          });
    }

    else{
        var mailOptions = {
            from: senderEmail,
            to: "shweta3047@gmail.com",
            subject: 'Reporting against Cyberbullying',
            text: complaintText,
            attachments:filesSelected
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
              return res.json({"error":"failed to send mail"})
            } else {
              console.log('Email sent: ' + info.response);
              return res.json({"message":"Successfully sent!!"})
            }
          });
    }

})



module.exports = router;
