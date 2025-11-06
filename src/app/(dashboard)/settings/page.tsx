
'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useLanguage, strings } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { updatePassword } from "@/lib/sheets";
import { Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";

export default function SettingsPage() {
    const { language } = useLanguage();
    const t = strings[language];
    const { toast } = useToast();
    const [email, setEmail] = useState<string | null>(null);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const userEmail = localStorage.getItem('userEmail');
        setEmail(userEmail);
    }, []);

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast({ variant: 'destructive', title: t.error, description: "Could not identify user." });
            return;
        }
        if (newPassword !== confirmPassword) {
          toast({ variant: 'destructive', title: t.passwordResetFailed, description: t.passwordsDoNotMatch });
          return;
        }
        setLoading(true);
        try {
          await updatePassword(email, newPassword);
          toast({ title: t.passwordResetSuccess, description: t.passwordUpdatedSuccessfully });
          setNewPassword('');
          setConfirmPassword('');
        } catch (error: any) {
          toast({ variant: 'destructive', title: t.passwordResetFailed, description: error.message });
        } finally {
          setLoading(false);
        }
      };


    return (
        <Card className="max-w-2xl">
            <CardHeader>
                <CardTitle>{t.settingsTitle}</CardTitle>
                <CardDescription>{t.settingsDescription}</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handlePasswordReset} className="space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Change Password</h3>
                         <div className="grid gap-2">
                            <Label htmlFor="email">{t.emailLabel}</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email || ''}
                                disabled
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="new-password">{t.newPassword}</Label>
                            <Input
                                id="new-password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                disabled={loading}
                                placeholder="••••••••"
                            />
                        </div>
                         <div className="grid gap-2">
                            <Label htmlFor="confirm-password">{t.confirmPassword}</Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                disabled={loading}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                    <Button type="submit" disabled={loading || !newPassword || !confirmPassword}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Change Password
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
