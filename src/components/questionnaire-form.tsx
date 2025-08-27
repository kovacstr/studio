"use client";

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { questions, options } from '@/lib/questions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { submitQuestionnaire } from '@/lib/actions';
import { Loader2 } from 'lucide-react';

export function QuestionnaireForm() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const progress = ((currentQuestion) / questions.length) * 100;

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      startTransition(async () => {
        const result = await submitQuestionnaire(newAnswers);
        if (result.success && result.answerString) {
          router.push(`/eredmeny?a=${result.answerString}`);
        } else {
          // Handle error case, e.g., show a toast notification
          console.error("Failed to submit questionnaire");
        }
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-2xl">
      <CardHeader>
        <Progress value={progress} className="w-full mb-4" />
        <CardDescription>
          {currentQuestion + 1}. Kérdés / {questions.length}
        </CardDescription>
        <CardTitle className="text-2xl font-headline">
          {questions[currentQuestion]}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              size="lg"
              className="w-full h-auto py-4 text-base whitespace-normal justify-start text-left hover:bg-primary/10 hover:border-primary"
              onClick={() => handleAnswer(option.score)}
              disabled={isPending}
            >
              {option.text}
            </Button>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        {isPending && (
          <div className="flex items-center text-muted-foreground animate-pulse">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Eredmények kiértékelése...
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
