import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function LoginPage() {
  const loginBg = PlaceHolderImages.find(image => image.id === 'login-bg-1');
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
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="#"
                      className="ml-auto inline-block text-sm underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <Input id="password" type="password" required />
                </div>
                <Link href="/dashboard" className="w-full">
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                </Link>
                <Button variant="outline" className="w-full">
                  Login with Google
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{' '}
                <Link href="#" className="underline">
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
