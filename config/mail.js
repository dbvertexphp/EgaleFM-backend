import sendEmail from "./sendMail.js";

export const sendFormEmail = async (email, otp) => {
  try {
    await sendEmail(
      email, 
      otp   
    );

    console.log("✅ Email sent successfully!");
  } catch (error) {
    console.error("❌ Failed to send email:", error.message || error);
    throw error;
  }
};
