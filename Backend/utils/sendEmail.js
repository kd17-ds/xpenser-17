const nodemailer = require("nodemailer");

module.exports.sendEmail = async (email, subject, htmlContent) => {
  try {
    // Create a transporter object using Gmail as the service
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL, // Your email address (from .env file)
        pass: process.env.EMAIL_PASS, // Your email password or app-specific password
      },
    });

    // Define the email options (who it's from, to, subject, and content)
    const mailOptions = {
      from: process.env.EMAIL, // Sender address
      to: email, // Recipient address
      subject, // Email subject line
      html: htmlContent, // HTML content of the email
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    // Log any error that occurs during the process
    console.error("Email failed:", error);
  }
};
