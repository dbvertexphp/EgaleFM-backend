import nodemailer from "nodemailer";

async function sendEmail(to, otp) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,  
      port: 465,                     
      secure: true,                 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Verify SMTP connection
    await transporter.verify();

    const info = await transporter.sendMail({
      from: ` <${process.env.SMTP_USER}>`,
      to,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It is valid for 5 minutes. Do not share it with anyone.`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>OTP Verification</h2>
          <p>Hello,</p>
          <p>Your One-Time Password (OTP) is:</p>
          <h1 style="letter-spacing: 3px;">${otp}</h1>
          <p>This OTP is valid for <b>5 minutes</b>.</p>
          <p>Please do not share this OTP with anyone.</p>
          <br />
          <p>Regards,<br /><b>Thanks</b></p>
        </div>
      `,
    });

    console.log("✅ Email sent successfully:", info.messageId);
    return info;

  } catch (error) {
    console.error("❌ Error sending email:", error.message || error);
    throw error;
  }
}

export default sendEmail;
