const nodemailer = require('nodemailer');

module.exports = async function emailSent(email, sbt, text){
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
          user: "prajapat2023harish@gmail.com",
          pass: "miecgwvnhafhpqtd",
        },
    },{
        tls : {rejectUnauthorized : false}
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: "prajapat2023harish@gmail.com", // sender address
        to: email, // list of receivers
        subject: sbt, // Subject line
        html: text, // html body
    });

    return info;
}