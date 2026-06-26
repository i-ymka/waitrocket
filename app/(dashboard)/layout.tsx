import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50">
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-zinc-200">
        <div className="flex items-center gap-8">
          <Link href="/dashboard/waitlists" className="text-xl font-bold tracking-tight text-violet-700">
            Waitrocket
          </Link>
          <nav className="hidden sm:flex items-center gap-1">
            <Link
              href="/dashboard/waitlists"
              className="px-4 py-2 rounded-full text-sm font-bold text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 transition-all"
            >
              Waitlists
            </Link>
          </nav>
        </div>
        <UserButton />
      </header>
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-10">
        {children}
      </main>
    </div>
  );
}
