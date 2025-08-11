const nodemailer = require("nodemailer");

module.exports.sendEmail = async (email, subject, htmlContent) => {
  try {
    // Create a transporter object using Gmail as the service
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Define the email options (who it's from, to, subject, and content)
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email failed:", error);
  }
};
