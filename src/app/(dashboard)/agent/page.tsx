
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, Loader2, Send, User } from 'lucide-react';
import { askBusinessAgent } from '@/ai/flows/business-agent';
import { mockSales, mockInventory, mockCustomers } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useLanguage, strings } from '@/context/language-context';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
}

export default function AgentPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const userAvatar = PlaceHolderImages.find(p => p.id === 'avatar-1');
    const { language } = useLanguage();
    const t = strings[language];

    useEffect(() => {
        // Scroll to the bottom when messages change
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);
    
     useEffect(() => {
        // Initial greeting from the AI
        setMessages([
            { id: 'init', text: t.agentInitialMessage, sender: 'ai' }
        ]);
    }, [t.agentInitialMessage]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage: Message = { id: `user-${Date.now()}`, text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);
        setError(null);

        try {
            const response = await askBusinessAgent({
                query: input,
                salesData: mockSales,
                inventoryData: mockInventory,
                customerData: mockCustomers,
            });
            const aiMessage: Message = { id: `ai-${Date.now()}`, text: response.response, sender: 'ai' };
            setMessages(prev => [...prev, aiMessage]);
        } catch (err: any) {
            setError(err.message || "Sorry, I couldn't process that request.");
            const errorMessage: Message = { id: `err-${Date.now()}`, text: t.agentErrorConnecting, sender: 'ai' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col">
            <Card className="flex-1 flex flex-col">
                <CardHeader>
                    <CardTitle>{t.agentTitle}</CardTitle>
                    <CardDescription>{t.agentDescription}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full" ref={scrollAreaRef}>
                        <div className="space-y-6 pr-4">
                            {messages.map((message) => (
                                <div key={message.id} className={`flex items-start gap-3 ${message.sender === 'user' ? 'justify-end' : ''}`}>
                                    {message.sender === 'ai' && (
                                        <Avatar className="h-9 w-9 border border-primary/20">
                                            <AvatarFallback className="bg-primary text-primary-foreground">
                                                <Bot className="h-5 w-5" />
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div className={`rounded-lg p-3 max-w-[80%] text-sm ${
                                        message.sender === 'user' 
                                            ? 'bg-primary text-primary-foreground' 
                                            : 'bg-muted'
                                    }`}>
                                        <p className="whitespace-pre-wrap">{message.text}</p>
                                    </div>
                                    {message.sender === 'user' && (
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={userAvatar?.imageUrl} alt="User" />
                                            <AvatarFallback>
                                                <User className="h-5 w-5" />
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            ))}
                            {loading && (
                                <div className="flex items-start gap-3">
                                    <Avatar className="h-9 w-9 border border-primary/20">
                                        <AvatarFallback className="bg-primary text-primary-foreground">
                                            <Bot className="h-5 w-5" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="rounded-lg p-3 bg-muted">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
                <CardFooter className="pt-6 border-t">
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertTitle>{t.agentRequestFailed}</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
                        <Input
                            id="message"
                            placeholder={t.agentInputPlaceholder}
                            className="flex-1"
                            autoComplete="off"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={loading}
                        />
                        <Button type="submit" size="icon" disabled={loading || !input.trim()}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            <span className="sr-only">Send</span>
                        </Button>
                    </form>
                </CardFooter>
            </Card>
        </div>
    );
}
