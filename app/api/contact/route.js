import axios from 'axios';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// ── escapeHtml helper ──
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ── In-memory rate limiter ──
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX = 5;

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry) {
    rateLimitMap.set(ip, { count: 1, start: now });
    return false;
  }
  if (now - entry.start > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, start: now });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

// ── Email regex (matches utils/check-email.js) ──
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Create and configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.GMAIL_PASSKEY, 
  },
});

// Helper function to send a message via Telegram
async function sendTelegramMessage(token, chat_id, message) {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  try {
    const res = await axios.post(url, {
      text: message,
      chat_id,
    });
    return res.data.ok;
  } catch (error) {
    console.error('Error sending Telegram message:', error.response?.data || error.message);
    return false;
  }
};

// HTML email template (uses escapeHtml for user-supplied values)
const generateEmailTemplate = (name, email, userMessage) => `
  <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #007BFF;">New Message Received</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Message:</strong></p>
      <blockquote style="border-left: 4px solid #007BFF; padding-left: 10px; margin-left: 0;">
        ${escapeHtml(userMessage)}
      </blockquote>
      <p style="font-size: 12px; color: #888;">Click reply to respond to the sender.</p>
    </div>
  </div>
`;

// Helper function to send an email via Nodemailer
async function sendEmail(payload, message) {
  const { name, email, message: userMessage } = payload;
  
  const mailOptions = {
    from: `Portfolio <${process.env.EMAIL_ADDRESS}>`, 
    to: process.env.EMAIL_ADDRESS, 
    subject: `New Message From ${name}`, 
    text: message, 
    html: generateEmailTemplate(name, email, userMessage), 
    replyTo: email, 
  };
  
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error while sending email:', error.message);
    return false;
  }
};

export async function POST(request) {
  try {
    // ── Rate limiting by IP ──
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json({
        success: false,
        message: 'Too many requests. Please try again later.',
      }, { status: 429 });
    }

    const payload = await request.json();

    // ── Honeypot check ──
    if (payload.website) {
      return NextResponse.json({ success: true });
    }

    const { name, email, message: userMessage } = payload;

    // ── Server-side validation ──
    if (typeof name !== 'string' || typeof email !== 'string' || typeof userMessage !== 'string') {
      return NextResponse.json({
        success: false,
        message: 'Invalid field types.',
      }, { status: 400 });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = userMessage.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      return NextResponse.json({
        success: false,
        message: 'All fields are required.',
      }, { status: 400 });
    }

    if (trimmedName.length > 100) {
      return NextResponse.json({
        success: false,
        message: 'Name must be 100 characters or fewer.',
      }, { status: 400 });
    }

    if (trimmedEmail.length > 100) {
      return NextResponse.json({
        success: false,
        message: 'Email must be 100 characters or fewer.',
      }, { status: 400 });
    }

    if (trimmedMessage.length > 500) {
      return NextResponse.json({
        success: false,
        message: 'Message must be 500 characters or fewer.',
      }, { status: 400 });
    }

    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json({
        success: false,
        message: 'Please provide a valid email address.',
      }, { status: 400 });
    }

    const sanitizedPayload = { name: trimmedName, email: trimmedEmail, message: trimmedMessage };
    const message = `New message from ${trimmedName}\n\nEmail: ${trimmedEmail}\n\nMessage:\n\n${trimmedMessage}\n\n`;

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chat_id = process.env.TELEGRAM_CHAT_ID;

    // Build delivery jobs
    const jobs = [];

    // Email is always attempted
    jobs.push(sendEmail(sanitizedPayload, message));

    // Telegram is optional — only attempt if both env vars are set
    if (token && chat_id) {
      jobs.push(sendTelegramMessage(token, chat_id, message));
    }

    const results = await Promise.all(jobs);
    const atLeastOneSucceeded = results.some(Boolean);

    if (atLeastOneSucceeded) {
      return NextResponse.json({
        success: true,
        message: 'Message sent successfully!',
      }, { status: 200 });
    }

    return NextResponse.json({
      success: false,
      message: 'Failed to send message.',
    }, { status: 500 });
  } catch (error) {
    console.error('API Error:', error.message);
    return NextResponse.json({
      success: false,
      message: 'Server error occurred.',
    }, { status: 500 });
  }
};
