import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { Resend } from "resend";
import { headers } from "next/headers";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

/**
 * Determine the app's base URL in this priority order:
 *   1. NEXT_PUBLIC_APP_URL env var (explicit override)
 *   2. The incoming request's host header (works on smokez.lol, previews, localhost)
 *   3. Fallback to localhost:3000 (dev only)
 */
async function getAppUrl(): Promise<string> {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");

  try {
    const h = await headers();
    const host = h.get("x-forwarded-host") || h.get("host");
    const proto = h.get("x-forwarded-proto") || "https";
    if (host) return `${proto}://${host}`;
  } catch {
    // headers() may not be available in some contexts
  }

  return "http://localhost:3000";
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (typeof email !== "string" || !email.includes("@"))
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });

    const emailNorm = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: emailNorm } });

    if (!user) return NextResponse.json({ sent: true });

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

    await prisma.passwordReset.create({
      data: { userId: user.id, token, expiresAt },
    });

    const appUrl = await getAppUrl();
    const resetUrl = `${appUrl}/reset-password?token=${token}`;

    if (resend) {
      try {
        await resend.emails.send({
          from: "smokez.lol <noreply@smokez.lol>",
          to: user.email,
          subject: "Reset your smokez.lol password",
          html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Reset your smokez.lol password</title>
</head>
<body style="margin:0; padding:0; background:#000000; font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#000000; padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:520px; background:#0a0a0f; border-radius:20px; border:1px solid rgba(255,255,255,0.06); overflow:hidden;">

          <!-- Top accent line -->
          <tr>
            <td style="height:3px; background:linear-gradient(90deg,#4c1d95,#7c3aed,#a855f7);"></td>
          </tr>

          <!-- Logo -->
          <tr>
            <td align="center" style="padding:40px 40px 0;">
              <div style="display:inline-block; padding:12px 20px; background:rgba(168,85,247,0.08); border-radius:14px; border:1px solid rgba(168,85,247,0.15);">
                <span style="font-size:22px; font-weight:800; color:#ffffff; letter-spacing:-0.02em;">smokez<span style="color:#a855f7;">.lol</span></span>
              </div>
            </td>
          </tr>

          <!-- Heading -->
          <tr>
            <td style="padding:36px 40px 0;">
              <h1 style="margin:0; font-size:26px; font-weight:700; color:#ffffff; letter-spacing:-0.025em; line-height:1.25;">
                Reset your password
              </h1>
            </td>
          </tr>

          <!-- Greeting + body -->
          <tr>
            <td style="padding:16px 40px 0;">
              <p style="margin:0 0 14px; font-size:15px; line-height:1.6; color:#a1a1aa;">
                Hi <strong style="color:#ffffff; font-weight:600;">@${user.username}</strong>,
              </p>
              <p style="margin:0 0 14px; font-size:15px; line-height:1.6; color:#a1a1aa;">
                We received a request to reset the password for your <strong style="color:#ffffff;">smokez.lol</strong> account.
              </p>
              <p style="margin:0; font-size:15px; line-height:1.6; color:#a1a1aa;">
                Click the button below to choose a new password. This link is valid for the next <strong style="color:#ffffff;">30 minutes</strong>.
              </p>
            </td>
          </tr>

          <!-- Button -->
          <tr>
            <td align="center" style="padding:36px 40px 0;">
              <a href="${resetUrl}" style="display:inline-block; padding:16px 44px; background:#4c1d95; color:#ffffff; text-decoration:none; font-size:15px; font-weight:700; border-radius:12px; letter-spacing:0.01em; border:1px solid #6d28d9; box-shadow:0 8px 24px -8px rgba(76,29,149,0.8);">
                Reset password
              </a>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:36px 40px 0;">
              <div style="height:1px; background:rgba(255,255,255,0.06);"></div>
            </td>
          </tr>

          <!-- Fallback link -->
          <tr>
            <td style="padding:24px 40px 0;">
              <p style="margin:0 0 8px; font-size:12px; color:#52525b; letter-spacing:0.02em; text-transform:uppercase; font-weight:600;">
                Or copy this link
              </p>
              <p style="margin:0; font-size:12px; line-height:1.6; color:#7c5cff; word-break:break-all; font-family:'SF Mono',Menlo,monospace;">
                ${resetUrl}
              </p>
            </td>
          </tr>

          <!-- Ignore notice -->
          <tr>
            <td style="padding:32px 40px 0;">
              <p style="margin:0; font-size:13px; line-height:1.6; color:#52525b;">
                Didn't request this? You can safely ignore this email — your password won't be changed.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:40px 40px 32px; text-align:center; border-top:1px solid rgba(255,255,255,0.04);">
              <p style="margin:0; font-size:11px; color:#3f3f46; letter-spacing:0.05em;">
                © ${new Date().getFullYear()} smokez.lol
              </p>
              <p style="margin:6px 0 0; font-size:11px; color:#3f3f46;">
                Your link, your world.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
          `,
        });
      } catch (emailErr) {
        console.error("Email send failed:", emailErr);
      }
    } else {
      console.log("\n=== PASSWORD RESET LINK (no email sent) ===");
      console.log(`For: ${user.email}`);
      console.log(`Link: ${resetUrl}`);
      console.log("==========================================\n");
    }

    return NextResponse.json({
      sent: true,
      devUrl:
        !resend && process.env.NODE_ENV !== "production" ? resetUrl : undefined,
    });
  } catch (e) {
    console.error("Forgot password error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}