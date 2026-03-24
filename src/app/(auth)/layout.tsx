import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-[520px] bg-primary text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -left-8 bottom-20 w-48 h-48 bg-white/5 rounded-full blur-2xl" />

        <Link href="/" className="flex items-center gap-2.5 relative z-10">
          <span className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center text-xs font-bold">V</span>
          <span className="font-bold font-headline text-lg">Vismotor PM</span>
        </Link>
        <div className="relative z-10">
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight mb-4 font-headline">
            Ship projects,<br />not spreadsheets.
          </h2>
          <p className="text-white/60 text-sm leading-relaxed max-w-xs">
            The project management tool built for Vismotor Corporation teams. Fast, focused, and collaborative.
          </p>
        </div>
        <p className="text-xs text-white/40 relative z-10">&copy; {new Date().getFullYear()} Vismotor Corporation</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col bg-slate-50 dark:bg-[#0d1117]">
        <nav className="px-6 py-5 lg:hidden">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-xs font-bold text-white">V</span>
            <span className="font-bold font-headline text-lg">Vismotor PM</span>
          </Link>
        </nav>
        <main className="flex-1 flex items-center justify-center px-6 pb-16">
          <div className="w-full max-w-[380px] animate-slide-up">{children}</div>
        </main>
      </div>
    </div>
  );
}
