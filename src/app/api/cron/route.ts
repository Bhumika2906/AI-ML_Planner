import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  
  // Verify cron secret from Vercel to ensure only Vercel can trigger this
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const userEmail = process.env.USER_EMAIL;
  
  if (!userEmail) {
    return NextResponse.json({ success: false, error: "USER_EMAIL environment variable is not set." }, { status: 500 });
  }

  const resendApiKey = process.env.RESEND_API_KEY || "re_Wr5nwxjs_FBXQhPZxvZjcJp7hecQRaxUe";

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'ML Planner <onboarding@resend.dev>',
        to: userEmail,
        subject: 'Daily Reminder: ML Accelerator Roadmap',
        html: `
          <h2>Time to build! 🚀</h2>
          <p>This is your daily reminder to open your ML Accelerator planner and mark your progress for the day.</p>
          <p>Consistency is key. Keep pushing forward!</p>
          <br/>
          <p><em>You are receiving this because of your daily cron job setup on Vercel.</em></p>
        `,
      }),
    });

    if (res.ok) {
      return NextResponse.json({ success: true, message: "Email sent successfully" });
    } else {
      const errorData = await res.text();
      return NextResponse.json({ success: false, error: errorData }, { status: res.status });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
