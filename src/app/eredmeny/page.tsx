import { redirect } from 'next/navigation';
import { ResultsDisplay } from '@/components/results-display';
import { questions, options } from '@/lib/questions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function ResultsPage({ searchParams }: { searchParams: { a?: string } }) {
  const answerString = searchParams.a;

  if (!answerString || answerString.length !== questions.length) {
    redirect('/');
  }

  const answers = answerString.split('').map(Number);
  if (answers.some(isNaN)) {
    redirect('/');
  }

  const totalScore = answers.reduce((sum, score) => sum + score, 0);

  // Category scores
  const categoryScores = {
    'Környezet': (answers[0] + answers[9]) / 2, // Q1, Q10
    'Elköteleződés': (answers[1] + answers[4]) / 2, // Q2, Q5
    'Önállóság': ((7 - answers[2]) + answers[6]) / 2, // Q3 (reversed), Q7
    'Fejlődés': (answers[3] + answers[8]) / 2, // Q4, Q9
    'Motiváció': (answers[5] + answers[7]) / 2, // Q6, Q8
  };

  const textualEvaluation = (score: number): string => {
    if (score >= 50) return "Kiváló! Pontosan tudod, mik a prioritásaid a munkahelyeden. Magabiztos vagy az elvárásaiddal kapcsolatban, ami hatalmas előny a karriered során. Használd ezt a tudást a számodra tökéletes pozíció megtalálásához!";
    if (score >= 35) return "Jól körvonalazódnak a preferenciáid! Már rendelkezel egy szilárd elképzeléssel arról, hogy mi fontos számodra, de még vannak területek, ahol érdemes elgondolkodnod. Ez a tudatosság segít a helyes irányba terelni a karrieredet.";
    if (score >= 20) return "Az útkeresés fázisában vagy! Még sok a kérdőjel a fejedben azzal kapcsolatban, hogy mit vársz egy munkahelytől, de ez teljesen rendben van. Kísérletezz, próbálj ki új dolgokat, és idővel minden letisztul majd.";
    return "A felfedezés elején jársz! Még nem alakult ki benned egyértelmű kép a munkahellyel kapcsolatos elvárásaidról. Ez egy izgalmas időszak, tele lehetőségekkel. Légy nyitott, és ne félj segítséget kérni a pályaorientációban!";
  };

  const reviewData = questions.map((q, i) => ({
    question: q,
    answer: options.find(o => o.score === answers[i])?.text || 'Ismeretlen válasz',
    score: answers[i]
  }));

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <ResultsDisplay
        totalScore={totalScore}
        categoryScores={categoryScores}
        evaluationText={textualEvaluation(totalScore)}
        reviewData={reviewData}
      />
    </div>
  );
}
