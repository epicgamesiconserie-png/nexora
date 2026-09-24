import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { username: true, createdAt: true },
  });
  if (!user) redirect("/login");

  return (
    <main className="min-h-screen p-8 bg-[#050507] text-white">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#7c5cff] to-[#a08bff] grid place-items-center font-bold">
            N
          </div>
          <span className="font-semibold tracking-tight">NEXORA</span>
        </Link>

        <h1 className="text-3xl font-bold">Welcome, @{user.username} 👋</h1>
        <p className="text-white/50 mt-2">
          Your account was created on {user.createdAt.toDateString()}.
        </p>
        <p className="text-white/50 mt-6">
          This is a placeholder dashboard. Next step: profile editing, links, appearance.
        </p>
      </div>
    </main>
  );
}