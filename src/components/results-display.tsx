"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BarChart, FileText, Redo, Share2, Linkedin, MessageCircle, Link as LinkIcon, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import {
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useToast } from '@/hooks/use-toast';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';


type ResultsDisplayProps = {
  totalScore: number;
  categoryScores: Record<string, number>;
  evaluationText: string;
  reviewData: { question: string; answer: string; score: number }[];
};

export function ResultsDisplay({ totalScore, categoryScores, evaluationText, reviewData }: ResultsDisplayProps) {
  const [isClient, setIsClient] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const chartData = Object.entries(categoryScores).map(([name, value]) => ({
    category: name,
    value: value,
  }));
  
  const chartConfig = {
    value: {
      label: 'Pontszám',
      color: 'hsl(var(--primary))',
    },
  } satisfies ChartConfig;

  const handleShare = (platform: 'facebook' | 'twitter' | 'linkedin' | 'copy') => {
    if (!isClient) return;
    const url = window.location.href;
    const text = `Eredményem a PályaNavigátor teszten: ${totalScore} pont! Nézd meg te is, mi motivál a munkában!`;
    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        window.open(shareUrl, '_blank');
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent('PályaNavigátor Eredményem')}&summary=${encodeURIComponent(text)}`;
        window.open(shareUrl, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url).then(() => {
          toast({ title: 'Sikeres másolás!', description: 'A link a vágólapra került.' });
        });
        break;
    }
  };


  return (
    <div className="space-y-8">
      <Card className="shadow-2xl animate-in fade-in-50 duration-1000">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-headline text-primary">Eredményeid</CardTitle>
          <CardDescription className="text-xl">Összpontszám: {totalScore} / 60</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-center p-6 bg-primary/5 rounded-lg">
              <FileText className="mx-auto h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-headline mb-2">Személyes értékelés</h3>
              <p className="text-foreground/80">{evaluationText}</p>
            </div>
            <div className="h-[350px]">
              <h3 className="text-2xl font-headline mb-2 text-center">Munkahelyi értékeid</h3>
              {isClient && (
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <PolarGrid />
                          <PolarAngleAxis dataKey="category" tick={{ fill: 'hsl(var(--foreground))', fontSize: 14 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 6]} tick={false} axisLine={false} />
                          <Radar name="Pontszám" dataKey="value" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.6} />
                      </RadarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col sm:flex-row gap-4 justify-center pt-6 border-t">
          <Link href="/kerdoiv" passHref>
            <Button size="lg" variant="outline"><Redo className="mr-2 h-4 w-4" /> Újra kitöltöm</Button>
          </Link>
          <div className="flex gap-2">
            <Button size="lg" onClick={() => handleShare('linkedin')} aria-label="Share on LinkedIn" variant="ghost" className="bg-[#0077B5] hover:bg-[#005582] text-white"><Linkedin/></Button>
            <Button size="lg" onClick={() => handleShare('twitter')} aria-label="Share on Twitter" variant="ghost" className="bg-[#1DA1F2] hover:bg-[#0c85d0] text-white"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z"/><path d="m9.09 9 3.18 4.86L16.36 9h-1.82l-2.36 3.54L9.91 9h-.82Z"/><path d="M12 15.36 8.64 10h1.82l2.05 3.1L14.54 10h.82L12 15.36Z"/></svg></Button>
            <Button size="lg" onClick={() => handleShare('copy')} aria-label="Copy link" variant="secondary"><LinkIcon className="h-5 w-5"/></Button>
          </div>
        </CardFooter>
      </Card>
      
      <Collapsible open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <div className="flex justify-center">
            <CollapsibleTrigger asChild>
                <Button variant="ghost">
                    Válaszok részletezése
                    <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${isDetailsOpen ? 'rotate-180' : ''}`} />
                </Button>
            </CollapsibleTrigger>
        </div>

        <CollapsibleContent>
            <Card className="mt-4">
                <CardHeader>
                <CardTitle>Válaszaid részletesen</CardTitle>
                <CardDescription>Itt visszanézheted, mit válaszoltál az egyes kérdésekre.</CardDescription>
                </CardHeader>
                <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {reviewData.map((item, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger>{index + 1}. {item.question}</AccordionTrigger>
                        <AccordionContent>
                        <p><strong>Válaszod:</strong> {item.answer}</p>
                        <p><strong>Pontszám:</strong> {item.score}</p>
                        </AccordionContent>
                    </AccordionItem>
                    ))}
                </Accordion>
                </CardContent>
            </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
