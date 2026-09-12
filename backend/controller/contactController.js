const nodemailer = require("nodemailer");

const sendContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Email that YOU receive
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,

      subject: `New Contact Message: ${subject}`,

      html: `
        <h2>New Contact Message from Baggage</h2>

        <p><strong>Name:</strong> ${name}</p>

        <p><strong>Email:</strong> ${email}</p>

        <p><strong>Subject:</strong> ${subject}</p>

        <h3>Message:</h3>

        <p>${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
    });

  } catch (error) {
    console.error("Error sending email:", error);

    res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
};

module.exports = {
  sendContactMessage,
};