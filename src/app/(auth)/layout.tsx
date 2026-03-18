import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-[480px] bg-primary text-white flex-col justify-between p-10">
        <Link href="/" className="flex items-center gap-2">
          <span className="h-7 w-7 rounded-lg bg-white/20 flex items-center justify-center text-[11px] font-bold">V</span>
          <span className="font-semibold">Vismotor PM</span>
        </Link>
        <div>
          <h2 className="text-3xl font-bold leading-tight tracking-tight mb-3">
            Ship projects,<br />not spreadsheets.
          </h2>
          <p className="text-white/60 text-sm leading-relaxed max-w-xs">
            The project management tool built for Vismotor Corporation teams. Fast, focused, and collaborative.
          </p>
        </div>
        <p className="text-xs text-white/40">© {new Date().getFullYear()} Vismotor Corporation</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col">
        <nav className="px-6 py-4 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <span className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center text-[11px] font-bold text-white">V</span>
            <span className="font-semibold">Vismotor PM</span>
          </Link>
        </nav>
        <main className="flex-1 flex items-center justify-center px-6 pb-16">
          <div className="w-full max-w-[360px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
