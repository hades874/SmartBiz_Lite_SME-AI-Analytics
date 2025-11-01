
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'bn';

type Translations = {
    [key in Language]: {
        [key: string]: any;
    };
};

export const strings: Translations = {
    en: {
        dashboard: 'Dashboard',
        salesForecasting: 'Sales Forecasting',
        inventory: 'Inventory',
        cashFlow: 'Cash Flow',
        customers: 'Customers',
        reports: 'Reports',
        aiAgent: 'AI Agent',
        settings: 'Settings',
        loginTitle: 'Login',
        loginDescription: 'Enter your email below to login to your account',
        emailLabel: 'Email',
        passwordLabel: 'Password',
        forgotPasswordLink: 'Forgot your password?',
        loginButton: 'Login',
        loginWithGoogleButton: 'Login with Google',
        signupPrompt: "Don't have an account?",
        signupLink: 'Sign up',
        totalRevenue: 'Total Revenue',
        totalRevenueDescription: '+20.1% from last month',
        activeCustomers: 'Active Customers',
        activeCustomersDescription: '+180.1% from last month',
        stockValue: 'Stock Value',
        stockValueDescription: 'Total value of current inventory',
        pendingPayments: 'Pending Payments',
        pendingPaymentsDescription: 'From 12 invoices',
        salesOverview: 'Sales Overview',
        salesOverviewDescription: 'An overview of your sales for the last year.',
        recentSales: 'Recent Sales',
        recentSalesDescription: (count: number) => `You made ${count} sales this month.`,
        inventoryAlerts: 'Inventory Alerts',
        inventoryAlertsDescription: 'Items that need your attention.',
        inventoryAlertsEmpty: 'All inventory levels are looking good!',
        lowStock: 'Low Stock',
        overstock: 'Overstock',
        agentTitle: "AI Business Agent",
        agentDescription: "Chat with your AI assistant to get business insights and suggestions.",
        agentInitialMessage: "Hello! I'm SmartBiz Lite AI. How can I help you analyze your business today? You can ask me about sales, inventory, customers, or for general advice.",
        agentInputPlaceholder: "Ask about sales, inventory, or customers...",
        agentRequestFailed: "Request Failed",
        agentErrorConnecting: "Sorry, I'm having trouble connecting. Please try again later.",
        cashflowTitle: "Cash Flow Analytics",
        cashflowDescription: "Track your income, expenses, and cash flow projections.",
        analyzeCashFlow: "Analyze Cash Flow",
        currentCashPosition: "Current Cash Position",
        thirtyDayProjection: "30-Day Projection",
        upcomingShortfalls: "Upcoming Shortfalls",
        paymentCycleAnalysis: "Payment Cycle Analysis",
        expensePatternIdentification: "Expense Pattern Identification",
        customersTitle: "Customer Insights",
        customersDescription: "Segment your customers and get retention insights.",
        analyzeCustomers: "Analyze Customers",
        customerList: "Customer List",
        customerListDescriptionWithSegments: "Customer segments have been updated.",
        customerListDescription: "Showing all customers.",
        customerName: "Name",
        totalSpent: "Total Spent",
        lastPurchase: "Last Purchase",
        segment: "Segment",
        forecastTitle: "Sales Forecasting",
        forecastDescription: "Use AI to predict future sales and identify trends based on your historical data.",
        generate30DayForecast: "Generate 30-Day Forecast",
        productForecast: "Product Forecast",
        productForecastDescription: "Predicted sales for the next 30 days.",
        product: "Product",
        predictedSales: "Predicted Sales",
        confidence: "Confidence",
        trend: "Trend",
        aiInsights: "AI Insights",
        aiRecommendations: "AI Recommendations",
        inventoryTitle: "Inventory Management",
        inventoryDescription: "Manage your stock and get AI-powered reorder recommendations.",
        addNewItem: "Add New Item",
        getAIRecommendations: "Get AI Recommendations",
        currentInventory: "Current Inventory",
        currentInventoryDescription: "An overview of all items in your inventory.",
        reportsTitle: "Automated Reports",
        reportsDescription: "Generate and download weekly or monthly business performance reports.",
        generateReport: "Generate Report",
        weeklyReport: "Weekly Report",
        monthlyReport: "Monthly Report",
        generatedReportTitle: (period: string) => `Generated ${period.charAt(0).toUpperCase() + period.slice(1)} Report`,
        settingsTitle: "Settings",
        settingsDescription: "Manage your account and application preferences.",
        settingsNotImplemented: "Settings page will be implemented here.",
        logout: "Logout",
    },
    bn: {
        dashboard: 'ড্যাশবোর্ড',
        salesForecasting: 'বিক্রয় পূর্বাভাস',
        inventory: 'ইনভেন্টরি',
        cashFlow: 'নগদ প্রবাহ',
        customers: 'গ্রাহক',
        reports: 'রিপোর্ট',
        aiAgent: 'এআই এজেন্ট',
        settings: 'সেটিংস',
        loginTitle: 'লগইন',
        loginDescription: 'আপনার অ্যাকাউন্টে লগইন করতে আপনার ইমেল লিখুন',
        emailLabel: 'ইমেল',
        passwordLabel: 'পাসওয়ার্ড',
        forgotPasswordLink: 'পাসওয়ার্ড ভুলে গেছেন?',
        loginButton: 'লগইন',
        loginWithGoogleButton: 'Google দিয়ে লগইন করুন',
        signupPrompt: 'অ্যাকাউন্ট নেই?',
        signupLink: 'সাইন আপ করুন',
        totalRevenue: 'মোট রাজস্ব',
        totalRevenueDescription: 'গত মাস থেকে +২০.১%',
        activeCustomers: 'সক্রিয় গ্রাহক',
        activeCustomersDescription: 'গত মাস থেকে +১৮০.১%',
        stockValue: 'স্টকের মূল্য',
        stockValueDescription: 'বর্তমান ইনভেন্টরির মোট মূল্য',
        pendingPayments: 'মুলতবি পেমেন্ট',
        pendingPaymentsDescription: '১২টি চালান থেকে',
        salesOverview: 'বিক্রয় ওভারভিউ',
        salesOverviewDescription: 'গত বছরের আপনার বিক্রয়ের একটি ওভারভিউ।',
        recentSales: 'সাম্প্রতিক বিক্রয়',
        recentSalesDescription: (count: number) => `আপনি এই মাসে ${count}টি বিক্রয় করেছেন।`,
        inventoryAlerts: 'ইনভেন্টরি সতর্কতা',
        inventoryAlertsDescription: 'যে আইটেমগুলিতে আপনার মনোযোগ প্রয়োজন।',
        inventoryAlertsEmpty: 'সমস্ত ইনভেন্টরি লেভেল ভাল দেখাচ্ছে!',
        lowStock: 'কম স্টক',
        overstock: 'অতিরিক্ত স্টক',
        agentTitle: "এআই বিজনেস এজেন্ট",
        agentDescription: "ব্যবসার অন্তর্দৃষ্টি এবং পরামর্শ পেতে আপনার এআই সহকারীর সাথে চ্যাট করুন।",
        agentInitialMessage: "হ্যালো! আমি SmartBiz Lite AI। আমি আজ আপনাকে আপনার ব্যবসা বিশ্লেষণ করতে কিভাবে সাহায্য করতে পারি? আপনি আমাকে বিক্রয়, ইনভেন্টরি, গ্রাহক বা সাধারণ পরামর্শ সম্পর্কে জিজ্ঞাসা করতে পারেন।",
        agentInputPlaceholder: "বিক্রয়, ইনভেন্টরি বা গ্রাহকদের সম্পর্কে জিজ্ঞাসা করুন...",
        agentRequestFailed: "অনুরোধ ব্যর্থ হয়েছে",
        agentErrorConnecting: "দুঃখিত, সংযোগ করতে সমস্যা হচ্ছে। অনুগ্রহ করে পরে আবার চেষ্টা করুন।",
        cashflowTitle: "নগদ প্রবাহ বিশ্লেষণ",
        cashflowDescription: "আপনার আয়, ব্যয় এবং নগদ প্রবাহের পূর্বাভাস ট্র্যাক করুন।",
        analyzeCashFlow: "নগদ প্রবাহ বিশ্লেষণ করুন",
        currentCashPosition: "বর্তমান নগদ অবস্থান",
        thirtyDayProjection: "৩০-দিনের পূর্বাভাস",
        upcomingShortfalls: "আসন্ন ঘাটতি",
        paymentCycleAnalysis: "পেমেন্ট চক্র বিশ্লেষণ",
        expensePatternIdentification: "ব্যয়ের પેટર્ন সনাক্তকরণ",
        customersTitle: "গ্রাহক অন্তর্দৃষ্টি",
        customersDescription: "আপনার গ্রাহকদের ভাগ করুন এবং धारणा অন্তর্দৃষ্টি পান।",
        analyzeCustomers: "গ্রাহকদের বিশ্লেষণ করুন",
        customerList: "গ্রাহক তালিকা",
        customerListDescriptionWithSegments: "গ্রাহক বিভাগ আপডেট করা হয়েছে।",
        customerListDescription: "সমস্ত গ্রাহকদের দেখানো হচ্ছে।",
        customerName: "নাম",
        totalSpent: "মোট খরচ",
        lastPurchase: "শেষ ক্রয়",
        segment: "വിഭാഗം",
        forecastTitle: "বিক্রয় পূর্বাভাস",
        forecastDescription: "আপনার ঐতিহাসিক তথ্যের উপর ভিত্তি করে ভবিষ্যতের বিক্রয় পূর্বাভাস এবং প্রবণতা সনাক্ত করতে AI ব্যবহার করুন।",
        generate30DayForecast: "৩০-দিনের পূর্বাভাস তৈরি করুন",
        productForecast: "পণ্য পূর্বাভাস",
        productForecastDescription: "আগামী ৩০ দিনের জন্য পূর্বাভাসিত বিক্রয়।",
        product: "পণ্য",
        predictedSales: "পূর্বাভাসিত বিক্রয়",
        confidence: "आत्मविश्वास",
        trend: "প্রবণতা",
        aiInsights: "এআই অন্তর্দৃষ্টি",
        aiRecommendations: "এআই সুপারিশ",
        inventoryTitle: "ইনভেন্টরি ম্যানেজমেন্ট",
        inventoryDescription: "আপনার স্টক পরিচালনা করুন এবং এআই-চালিত পুনঃক্রম সুপারিশ পান।",
        addNewItem: "নতুন আইটেম যোগ করুন",
        getAIRecommendations: "এআই সুপারিশ পান",
        currentInventory: "বর্তমান ইনভেন্টরি",
        currentInventoryDescription: "আপনার ইনвенটরিতে সমস্ত আইটেমের একটি ওভারভিউ।",
        reportsTitle: "স্বয়ংক্রিয় প্রতিবেদন",
        reportsDescription: "সাপ্তাহিক বা মাসিক ব্যবসায়িক কর্মক্ষমতা প্রতিবেদন তৈরি এবং ডাউনলোড করুন।",
        generateReport: "প্রতিবেদন তৈরি করুন",
        weeklyReport: "साप्ताहिक প্রতিবেদন",
        monthlyReport: "মাসিক প্রতিবেদন",
        generatedReportTitle: (period: string) => `${period === 'weekly' ? 'সাপ্তাহিক' : 'মাসিক'} প্রতিবেদন তৈরি হয়েছে`,
        settingsTitle: "সেটিংস",
        settingsDescription: "আপনার অ্যাকাউন্ট এবং অ্যাপ্লিকেশন পছন্দগুলি পরিচালনা করুন।",
        settingsNotImplemented: "সেটিংস পৃষ্ঠাটি এখানে প্রয়োগ করা হবে।",
        logout: "লগআউট",
    },
};

interface LanguageContextProps {
    language: Language;
    setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState<Language>('en');

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
