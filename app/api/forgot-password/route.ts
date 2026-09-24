import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { Resend } from "resend";

const keyPresent = !!process.env.RESEND_API_KEY;
const keyPrefix = process.env.RESEND_API_KEY?.slice(0, 8) ?? "MISSING";
const resend = keyPresent ? new Resend(process.env.RESEND_API_KEY!) : null;

export async function POST(req: Request) {
  try {
    console.log("=== FORGOT PASSWORD DEBUG ===");
    console.log("RESEND_API_KEY present:", keyPresent);
    console.log("RESEND_API_KEY prefix:", keyPrefix);
    console.log("NEXT_PUBLIC_APP_URL:", process.env.NEXT_PUBLIC_APP_URL);

    const { email } = await req.json();

    if (typeof email !== "string" || !email.includes("@"))
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });

    const emailNorm = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: emailNorm } });

    if (!user) {
      console.log("No user found for:", emailNorm);
      return NextResponse.json({ sent: true });
    }

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

    await prisma.passwordReset.create({
      data: { userId: user.id, token, expiresAt },
    });

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || "https://smokez.lol";
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;

    console.log("Generated reset URL:", resetUrl);
    console.log("About to send email to:", user.email);

    if (resend) {
      console.log("Calling resend.emails.send...");
      try {
        const result = await resend.emails.send({
          from: "NEXORA <noreply@smokez.lol>",
          to: user.email,
          subject: "Reset your NEXORA password",
          html: `
            <div style="font-family: sans-serif; max-width: 500px; margin: auto; background:#0a0a12; color:#fff; padding:32px; border-radius:16px;">
              <h2 style="margin:0 0 16px;">Reset your password</h2>
              <p style="color:#aaa; line-height:1.6;">
                Someone requested a password reset for your NEXORA account. If this was you, click the button below. This link expires in 30 minutes.
              </p>
              <a href="${resetUrl}" style="display:inline-block; background:#7c5cff; color:#fff; padding:14px 24px; border-radius:12px; text-decoration:none; font-weight:600; margin:16px 0;">
                Reset password
              </a>
              <p style="color:#666; font-size:12px; margin-top:24px;">
                Or copy this link into your browser:<br/>
                <span style="color:#7c5cff;">${resetUrl}</span>
              </p>
              <p style="color:#666; font-size:12px;">
                If you didn't request this, you can safely ignore this email.
              </p>
            </div>
          `,
        });
        console.log("Resend result:", JSON.stringify(result));
      } catch (emailErr: any) {
        console.error("Email send failed:", emailErr);
        console.error("Error message:", emailErr?.message);
        console.error("Error response:", JSON.stringify(emailErr?.response?.data));
      }
    } else {
      console.log("RESEND NOT CONFIGURED — falling back to log only");
      console.log("=== PASSWORD RESET LINK (no email sent) ===");
      console.log(`For: ${user.email}`);
      console.log(`Link: ${resetUrl}`);
      console.log("==========================================\n");
    }

    return NextResponse.json({
      sent: true,
      devUrl:
        !resend && process.env.NODE_ENV !== "production" ? resetUrl : undefined,
    });
  } catch (e: any) {
    console.error("Forgot password error:", e);
    console.error("Error message:", e?.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}