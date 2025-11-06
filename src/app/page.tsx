
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useLanguage, strings } from '@/context/language-context';

export default function LoginPage() {
  const loginBg = PlaceHolderImages.find(image => image.id === 'login-bg-1');
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();
  const t = strings[language];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Hard-coded authentication
    if (email === 'admin@gmail.com' && password === 'admin') {
      toast({
        title: 'Login Successful',
        description: 'Welcome back!',
      });
      router.push('/dashboard');
    } else {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Invalid email or password. Please try again.',
      });
      setLoading(false);
    }
  };


  return (
    <div className="w-full h-screen lg:grid lg:grid-cols-2">
      <div className="relative flex items-center justify-center h-full">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-accent/80 z-10"></div>
        {loginBg && (
            <Image
                src={loginBg.imageUrl}
                alt="Background"
                fill
                quality={100}
                className="object-cover"
                data-ai-hint={loginBg.imageHint}
            />
        )}
        <div className="relative z-20 p-8 text-primary-foreground max-w-md">
            <h1 className="text-5xl font-bold font-headline">SmartBiz Lite</h1>
            <p className="mt-4 text-lg">
            Transforming your business data into actionable insights. AI-powered analytics for Bangladeshi SMEs.
            </p>
        </div>
      </div>
      <div className="flex items-center justify-center py-12 bg-background">
        <div className="mx-auto grid w-[350px] gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{t.loginTitle}</CardTitle>
              <CardDescription>
                {t.loginDescription}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">{t.emailLabel}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">{t.passwordLabel}</Label>
                      <Link
                        href="#"
                        className="ml-auto inline-block text-sm underline"
                      >
                        {t.forgotPasswordLink}
                      </Link>
                    </div>
                    <Input 
                      id="password" 
                      type="password" 
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      {t.loginButton}
                    </Button>
                </div>
              </form>
              <div className="mt-4 text-center text-sm">
                {t.signupPrompt}{' '}
                <Link href="#" className="underline">
                  {t.signupLink}
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
