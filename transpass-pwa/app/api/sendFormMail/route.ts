import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, lastName, email, companyName } = body;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // Make sure this is true when using port 465
      auth: {
        user: process.env.MAIL_SMTP_USER,
        pass: process.env.MAIL_SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Contact Form" <${process.env.MAIL_SMTP_USER}>`,
      to: "viktorija@sols.mk",
      subject: `New Demo Request from ${name} ${lastName}`,
      text: `
        Name: ${name} ${lastName}
        Email: ${email}
        Company Name: ${companyName}
      `,
    });

    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ message: "Failed to send email" }, { status: 500 });
  }
}
