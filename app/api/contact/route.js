import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
});

// Now includes subject
const generateEmailTemplate = (name, email, subject, message) => `
  <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px;">
      <h2 style="color: #007BFF;">New Message Received</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <blockquote style="border-left: 4px solid #007BFF; padding-left: 10px; margin-left: 0;">
        ${message}
      </blockquote>
    </div>
  </div>
`;

export async function POST(req) {
    try {
        const { name, email, subject, message } = await req.json();

        if (!name || !email || !message || !subject) {
            return NextResponse.json(
                { success: false, message: 'All fields are required.' },
                { status: 400 }
            );
        }

        await transporter.sendMail({
            from: `"Portfolio Contact" <${process.env.EMAIL}>`,
            to: process.env.EMAIL,
            subject: subject || `New message from ${name}`,
            html: generateEmailTemplate(name, email, subject, message), // pass subject
            replyTo: email,
        });

        return NextResponse.json(
            { success: true, message: 'Message sent successfully!' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Email sending error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to send message.' },
            { status: 500 }
        );
    }
}