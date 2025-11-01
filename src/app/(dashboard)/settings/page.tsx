
'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useLanguage, strings } from "@/context/language-context";

export default function SettingsPage() {
    const { language } = useLanguage();
    const t = strings[language];

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t.settingsTitle}</CardTitle>
                <CardDescription>{t.settingsDescription}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{t.settingsNotImplemented}</p>
            </CardContent>
        </Card>
    );
}
