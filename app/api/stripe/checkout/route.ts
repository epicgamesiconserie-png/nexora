import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { username: true, email: true, isPremium: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.isPremium) {
    return NextResponse.json(
      { error: "You already have premium" },
      { status: 400 }
    );
  }

  const origin =
    process.env.NEXT_PUBLIC_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://smokez.lol"
      : "http://localhost:3000");

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      managed_payments: { enabled: false },
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: 580,
            product_data: {
              name: "smokez.lol Premium",
              description: "Lifetime Premium — unlock every feature forever.",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        username: user.username,
        userId: session.userId,
        type: "premium_lifetime",
      },
      success_url: `${origin}/dashboard/premium?success=true`,
      cancel_url: `${origin}/dashboard/premium?cancelled=true`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout" },
      { status: 500 }
    );
  }
}