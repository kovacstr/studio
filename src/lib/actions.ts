"use server";

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { submissions } from './db';
import { encrypt, decrypt } from './auth';
import { questions } from './questions';

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export async function submitQuestionnaire(answers: number[]) {
  try {
    const submission = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      answers,
    };
    submissions.push(submission);
    
    const answerString = answers.join('');
    return { success: true, answerString };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'A beküldés sikertelen.' };
  }
}

export async function login(prevState: any, formData: FormData) {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    return { error: 'Érvénytelen adatok.' };
  }
  
  const { username, password } = parsed.data;

  // These should be set in your environment variables for production
  const adminUser = process.env.ADMIN_USER || 'admin';
  const adminPass = process.env.ADMIN_PASS || 'admin';


  if (username === adminUser && password === adminPass) {
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const session = await encrypt({ user: username, expires });

    cookies().set('session', session, { expires, httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    redirect('/admin/dashboard');
  }

  return { error: 'Hibás felhasználónév vagy jelszó.' };
}

export async function logout() {
  cookies().set('session', '', { expires: new Date(0) });
  redirect('/admin');
}

export async function getSession() {
  const session = cookies().get('session')?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function downloadCsv() {
  const session = await getSession();
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  if (submissions.length === 0) {
    // Return an empty CSV file with headers if there is no data
    const header = ['ID', 'Timestamp', ...questions].join(',');
    const csvContent = header + '\n';
    const headers = new Headers();
    headers.set('Content-Type', 'text/csv');
    headers.set('Content-Disposition', `attachment; filename="palyanavigator_valaszok.csv"`);
    return new Response(csvContent, { headers });
  }

  const header = ['ID', 'Timestamp', ...questions].join(',');
  const rows = submissions.map(s => [s.id, s.timestamp.toISOString(), ...s.answers].join(','));
  const csvContent = [header, ...rows].join('\n');
  
  const headers = new Headers();
  headers.set('Content-Type', 'text/csv');
  headers.set('Content-Disposition', `attachment; filename="palyanavigator_valaszok.csv"`);

  return new Response(csvContent, { headers });
}
