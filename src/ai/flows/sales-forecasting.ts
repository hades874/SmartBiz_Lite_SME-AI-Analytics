'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating sales forecasts.
 *
 * The flow takes sales data as input and returns a sales forecast for the next month.
 * It uses the Gemini API for time-series forecasting.
 *
 * @exports salesForecasting - A function that initiates the sales forecasting flow.
 * @exports SalesForecastingInput - The input type for the salesForecasting function.
 * @exports SalesForecastingOutput - The return type for the salesForecasting function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SalesRecordSchema = z.object({
  id: z.string(),
  date: z.string(), // ISO 8601
  productName: z.string(),
  productId: z.string().optional(),
  quantity: z.number(),
  unitPrice: z.number(),
  totalAmount: z.number(),
  customerName: z.string().optional(),
  customerId: z.string().optional(),
  paymentStatus: z.enum(['paid', 'pending', 'partial']),
  category: z.string().optional(),
});

const SalesForecastingInputSchema = z.object({
  salesData: z.array(SalesRecordSchema).describe('An array of sales records.'),
});
export type SalesForecastingInput = z.infer<typeof SalesForecastingInputSchema>;

const SalesForecastItemSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  predictedSales: z.number().describe('The predicted sales for the next month.'),
  confidence: z.enum(['high', 'medium', 'low']).describe('The confidence level of the prediction.'),
  trend: z.enum(['increasing', 'stable', 'decreasing']).describe('The trend of the sales.'),
});

const SalesForecastingOutputSchema = z.object({
  forecast: z.array(SalesForecastItemSchema).describe('An array of sales forecasts for each product.'),
  insights: z.array(z.string()).describe('An array of insights about the sales data.'),
  recommendations: z.array(z.string()).describe('An array of recommendations based on the sales data.'),
});
export type SalesForecastingOutput = z.infer<typeof SalesForecastingOutputSchema>;

export async function salesForecasting(input: SalesForecastingInput): Promise<SalesForecastingOutput> {
  return salesForecastingFlow(input);
}

const salesForecastingPrompt = ai.definePrompt({
  name: 'salesForecastingPrompt',
  input: {schema: SalesForecastingInputSchema},
  output: {schema: SalesForecastingOutputSchema},
  prompt: `You are a business analyst for SMEs. Analyze the provided sales data and provide a 30-day sales forecast for each product. Your response must be in the Bangla language.

Sales Data (last 90 days):
{{json salesData}}

Provide a JSON response with:
{
  "forecast": [
    {
      "productName": string,
      "predictedSales": number,
      "confidence": "high" | "medium" | "low",
      "trend": "increasing" | "stable" | "decreasing"
    }
  ],
  "insights": string[],
  "recommendations": string[]
}
`,
});

const salesForecastingFlow = ai.defineFlow(
  {
    name: 'salesForecastingFlow',
    inputSchema: SalesForecastingInputSchema,
    outputSchema: SalesForecastingOutputSchema,
  },
  async input => {
    const {output} = await salesForecastingPrompt(input);
    return output!;
  }
);
