import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { downloadCsv, logout } from '@/lib/actions';
import { Download, LogOut, FileSpreadsheet } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold font-headline">Admin Felület</h1>
            <form action={logout}>
              <Button variant="outline"><LogOut className="mr-2 h-4 w-4"/>Kijelentkezés</Button>
            </form>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Adatok Exportálása</CardTitle>
            <CardDescription>Töltse le a kérdőív kitöltéseit CSV formátumban.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 p-6 bg-gray-50 rounded-lg">
                <FileSpreadsheet className="h-10 w-10 text-primary" />
                <div className="flex-grow">
                    <h3 className="font-semibold">Kitöltési adatok</h3>
                    <p className="text-sm text-gray-500">Minden eddigi kitöltés egyetlen fájlban.</p>
                </div>
                <form action={downloadCsv}>
                    <Button><Download className="mr-2 h-4 w-4" />Letöltés (.csv)</Button>
                </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
