# SME-AI-Analytics: SmartBiz Lite

**SmartBiz Lite** is an AI-powered business intelligence dashboard designed specifically for Small to Medium-sized Enterprises (SMEs) in Bangladesh. Built with Next.js, Genkit, and Google Sheets, it transforms raw business data into actionable insights, helping owners make smarter, data-driven decisions. The application features a modern, bilingual interface (English and Bengali) and a conversational AI agent to democratize data analysis.

## ✨ Key Features

- **Centralized Dashboard**: Get a real-time overview of your business with key metrics like Total Revenue, Active Customers, Stock Value, and Pending Payments.
- **AI-Powered Sales Forecasting**: Leverage historical sales data to generate 30-day sales predictions for each product, complete with confidence levels and trend analysis.
- **Smart Inventory Management**: Track stock levels, manage products, and receive AI-driven recommendations for reordering to prevent stockouts and overstocking.
- **Intelligent Customer Segmentation**: Automatically segment customers into categories like 'high-value', 'regular', and 'at-risk' to tailor marketing and retention efforts.
- **Cash Flow Analysis**: Analyze income and expenses to get a clear picture of your current cash position and a 30-day projection.
- **Automated Reporting**: Generate comprehensive weekly or monthly business performance reports in Bengali with a single click.
- **Conversational AI Agent**: Chat with "SmartBiz Lite AI" in natural language (Bengali) to get instant answers and insights about your sales, inventory, and customer data.
- **Global Search**: Quickly find customers, inventory items, and sales records from anywhere in the application.
- **Bilingual Interface**: Seamlessly switch between English and Bengali to use the app in your preferred language.
- **Secure Authentication**: User management system with different access levels, backed by Google Sheets.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **AI/Generative**: [Google Genkit](https://firebase.google.com/docs/genkit) with the Gemini model family.
- **Database**: [Google Sheets](https://www.google.com/sheets/about/) (used as a lightweight database for sales, inventory, customers, and user credentials).
- **Charting**: [Recharts](https://recharts.org/)
- **Deployment**: Configured for [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/sme-ai-analytics.git
    cd sme-ai-analytics
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    ```

3.  **Set up environment variables:**

    Create a `.env.local` file in the root of your project and add the following environment variables. These are required to connect to Google Sheets and Genkit AI services.

    ```env
    # Google Sheets API Credentials
    GOOGLE_SHEET_ID="YOUR_SPREADSHEET_ID"
    GOOGLE_SERVICE_ACCOUNT_EMAIL="your-service-account-email@your-project.iam.gserviceaccount.com"
    GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"

    # Genkit (Google AI) API Key
    GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
    ```

    *   Follow the [Google Cloud documentation](https://cloud.google.com/iam/docs/keys-create-delete) to create a service account and get your JSON credentials.
    *   Share your Google Sheet with the service account email.
    *   Get your Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Running the Application

1.  **Start the development server:**
    ```bash
    npm run dev
    ```

2.  **Open your browser:**
    Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### Default Login Credentials
- **Admin**:
  - Email: `admin@gmail.com`
  - Password: `admin`
- **User**: Sign up new users via the admin flow on the login page.
