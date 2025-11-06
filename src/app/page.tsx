
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useLanguage, strings } from '@/context/language-context';
import { getCredentials, addUser, updatePassword } from '@/lib/sheets';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { UserCredentials } from '@/types';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

type AuthMode = 'login' | 'signup-admin' | 'signup-user' | 'forgot-password-email' | 'forgot-password-reset';

export default function LoginPage() {
  const loginBg = PlaceHolderImages.find(image => image.id === 'login-bg-1');
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();
  const t = strings[language];

  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    localStorage.removeItem('userEmail');
  }, []);
  
  useEffect(() => {
    // Clear errors when switching modes
    setError(null);
  }, [authMode, isDialogOpen])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const loginAndRedirect = (userEmail: string, message: string) => {
        localStorage.setItem('userEmail', userEmail);
        toast({ title: t.loginSuccess, description: message });
        router.push('/dashboard');
    }

    if (email === 'admin@gmail.com' && password === 'admin') {
      loginAndRedirect(email, t.welcomeAdmin);
      return;
    }

    try {
      const credentials = await getCredentials();
      const user = credentials.find(u => u.email === email && u.password === password);
      if (user) {
        loginAndRedirect(user.email, t.welcomeBack);
      } else {
        setError(t.invalidCredentials);
        setLoading(false);
      }
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (email === 'admin@gmail.com' && password === 'admin') {
      setAuthMode('signup-user');
      setEmail('');
      setPassword('');
    } else {
      setError(t.invalidAdminCredentials);
    }
  };

  const handleUserSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError(t.passwordsDoNotMatch);
      return;
    }
    setLoading(true);
    try {
      await addUser({ email, password });
      toast({ title: t.signupSuccess, description: t.userCreatedSuccessfully });
      resetAndCloseDialog();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const credentials = await getCredentials();
      if (credentials.some(u => u.email === email)) {
        setAuthMode('forgot-password-reset');
      } else {
        setError(t.emailNotRegistered);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (newPassword !== confirmPassword) {
      setError(t.passwordsDoNotMatch);
      return;
    }
    setLoading(true);
    try {
      await updatePassword(email, newPassword);
      toast({ title: t.passwordResetSuccess, description: t.passwordUpdatedSuccessfully });
      resetAndCloseDialog();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const resetAndCloseDialog = () => {
    setIsDialogOpen(false);
    setAuthMode('login');
    setEmail('');
    setPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError(null);
  };

  const openDialog = (mode: AuthMode) => {
    setAuthMode(mode);
    setIsDialogOpen(true);
    setEmail('');
    setPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError(null);
  }

  const renderDialogContent = () => {
    switch (authMode) {
      case 'signup-admin':
        return (
          <>
            <DialogHeader>
              <DialogTitle>{t.adminAuthentication}</DialogTitle>
              <DialogDescription>{t.enterAdminCredentials}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAdminAuth}>
                {error && <Alert variant="destructive" className="mb-4"><AlertDescription>{error}</AlertDescription></Alert>}
              <div className="grid gap-4 py-4">
                <Input id="admin-email" type="email" placeholder={t.emailLabel} value={email} onChange={e => setEmail(e.target.value)} required />
                <Input id="admin-password" type="password" placeholder={t.passwordLabel} value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading}>{loading ? <Loader2 className="animate-spin" /> : t.authenticate}</Button>
              </DialogFooter>
            </form>
          </>
        );
      case 'signup-user':
        return (
          <>
            <DialogHeader>
              <DialogTitle>{t.createNewUser}</DialogTitle>
              <DialogDescription>{t.enterNewUserDetails}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUserSignup}>
                {error && <Alert variant="destructive" className="mb-4"><AlertDescription>{error}</AlertDescription></Alert>}
              <div className="grid gap-4 py-4">
                <Input id="new-user-email" type="email" placeholder={t.emailLabel} value={email} onChange={e => setEmail(e.target.value)} required />
                <Input id="new-user-password" type="password" placeholder={t.passwordLabel} value={password} onChange={e => setPassword(e.target.value)} required />
                <Input id="confirm-password" type="password" placeholder={t.confirmPassword} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading}>{loading ? <Loader2 className="animate-spin" /> : t.createUser}</Button>
              </DialogFooter>
            </form>
          </>
        );
        case 'forgot-password-email':
            return (
              <>
                <DialogHeader>
                  <DialogTitle>{t.forgotPasswordLink}</DialogTitle>
                  <DialogDescription>{t.enterEmailToReset}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleForgotPasswordEmail}>
                    {error && <Alert variant="destructive" className="mb-4"><AlertDescription>{error}</AlertDescription></Alert>}
                  <div className="grid gap-4 py-4">
                    <Input id="reset-email" type="email" placeholder={t.emailLabel} value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={loading}>{loading ? <Loader2 className="animate-spin" /> : t.findAccount}</Button>
                  </DialogFooter>
                </form>
              </>
            );
        case 'forgot-password-reset':
            return (
                <>
                <DialogHeader>
                    <DialogTitle>{t.resetPassword}</DialogTitle>
                    <DialogDescription>{t.enterNewPasswordFor(email)}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handlePasswordReset}>
                    {error && <Alert variant="destructive" className="mb-4"><AlertDescription>{error}</AlertDescription></Alert>}
                    <div className="grid gap-4 py-4">
                    <Input id="new-password" type="password" placeholder={t.newPassword} value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                    <Input id="confirm-new-password" type="password" placeholder={t.confirmPassword} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                    </div>
                    <DialogFooter>
                    <Button type="submit" disabled={loading}>{loading ? <Loader2 className="animate-spin" /> : t.resetPassword}</Button>
                    </DialogFooter>
                </form>
                </>
            );
      default:
        return null;
    }
  }


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
            {t.appSlogan}
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
              {error && authMode === 'login' && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
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
                      <Button variant="link" type="button" onClick={() => openDialog('forgot-password-email')} className="ml-auto inline-block text-sm underline p-0 h-auto">
                        {t.forgotPasswordLink}
                      </Button>
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
                <Button variant="link" type="button" onClick={() => openDialog('signup-admin')} className="underline p-0 h-auto">
                  {t.signupLink}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
       <Dialog open={isDialogOpen} onOpenChange={(open) => !open && resetAndCloseDialog()}>
            <DialogContent>
                {renderDialogContent()}
            </DialogContent>
        </Dialog>
    </div>
  )
}

    