import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16 flex flex-col items-center text-center">
      <Card className="w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in-50 duration-1000">
        <div className="bg-primary/10 p-6 md:p-10">
          <Image src="https://picsum.photos/800/400" width={800} height={400} alt="A group of young people collaborating" data-ai-hint="youth collaboration" className="w-full h-auto rounded-lg object-cover" />
        </div>
        <CardHeader className="p-6 md:p-10">
          <CardTitle className="text-4xl md:text-5xl font-headline font-bold text-primary">
            PályaNavigátor
          </CardTitle>
          <CardDescription className="text-lg md:text-xl mt-4 text-foreground/80">
            Töltsd ki 10 kérdéses villámtesztünket, és tudd meg, mi motivál igazán a munka világában!
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-10 pt-0">
          <p className="mb-8 text-foreground/70">
            Az alábbi kérdőív segít feltérképezni a munkával kapcsolatos legfontosabb értékeidet. Nincsenek jó vagy rossz válaszok, csak a te véleményed számít! A kitöltés mindössze néhány percet vesz igénybe.
          </p>
          <Link href="/kerdoiv" passHref>
            <Button size="lg" className="group text-lg">
              Kezdjük a kitöltést! <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
