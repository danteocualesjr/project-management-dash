import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Vismotor<span className="text-muted-foreground font-normal ml-1">PM</span>
        </Link>
      </nav>
      <main className="flex-1 flex items-center justify-center px-6 pb-16">
        <div className="w-full max-w-[340px]">{children}</div>
      </main>
    </div>
  );
}
