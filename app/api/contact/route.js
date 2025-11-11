import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.GMAIL_PASSKEY,
  },
});

// HTML email template
const generateEmailTemplate = (name, email, message) => `
  <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px;">
      <h2 style="color: #007BFF;">New Message Received</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <blockquote style="border-left: 4px solid #007BFF; padding-left: 10px; margin-left: 0;">
        ${message}
      </blockquote>
    </div>
  </div>
`;

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: 'All fields are required.' },
        { status: 400 }
      );
    }

    // Send email
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_ADDRESS}>`,
      to: process.env.EMAIL_ADDRESS,   // send to yourself
      subject: `New message from ${name}`,
      html: generateEmailTemplate(name, email, message),
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
