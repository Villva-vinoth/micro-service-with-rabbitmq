const {transporter} = require("../config/emailConfig");
const pushEmail =async (data)=>{
    try {
        const opt = {
            from: process.env.EMAIL,
            to: data.to,
            subject: data.subject,
            html: data.html
        }
        const email = await transporter.sendMail(opt);
        return email.messageId;
    } catch (error) {
        throw error;
    }
}

const sendOTPMail = async (data)=>{
    const html =`
     <h1>OTP</h1> <p>{{OTP}}</p>
    `

    const {otp,subject,email} = data;

    try {
        const template = html.replace("{{OTP}}",otp);
        console.log(template);
        const opt ={
            to:email,
            subject:subject,
            html:template
        }
        // console.log(opt);

        const sends = await pushEmail(opt);
        return sends;

    } catch (error) {
        throw error;
    }

}


module.exports = {pushEmail, sendOTPMail};