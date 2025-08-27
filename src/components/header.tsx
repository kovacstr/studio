import Link from 'next/link';
import { Rocket } from 'lucide-react';

export default function AppHeader() {
  return (
    <header className="bg-primary/5 border-b border-primary/10">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary font-bold font-headline">
          <Rocket className="w-5 h-5" />
          <span>PályaNavigátor</span>
        </Link>
        <div className="text-sm text-foreground/60">
          Ifjúsági Garancia 2025 (OFA)
        </div>
      </div>
    </header>
  );
}
