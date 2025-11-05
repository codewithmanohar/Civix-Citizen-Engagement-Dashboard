import { transporter } from "./email.config.js";
import { Verification_Email_Template } from "../libs/email.tamplate.js";


export const sendVerficationCode = async(email , verificationCode) => {
    try {
       const info = await transporter.sendMail({
        from: '"Petition Management (Civic)" <mksahni25551@gmail.com>',
        to: email,
        subject: "Your Verification Code",
        text: "Your Verification Code", // plain‑text body
        html: Verification_Email_Template.replace("{verificationCode}", verificationCode), // HTML body
      });
      console.log("Message sent:", info.messageId);
    } catch (error) {
        console.log(error.message);
    }
}