'use server';

/**
 * @fileOverview This file defines the cash flow tracking flow for SmartBiz Lite.
 *
 * - trackCashFlow - An asynchronous function that takes CashFlowInput as input and returns CashFlowOutput.
 * - CashFlowInput - The input type for the trackCashFlow function, defining the structure of the payment data.
 * - CashFlowOutput - The output type for the trackCashFlow function, providing a cash flow projection and analysis.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PaymentSchema = z.object({
  id: z.string(),
  date: z.string(),
  type: z.enum(['income', 'expense']),
  amount: z.number(),
  category: z.string(),
  description: z.string().optional(),
  status: z.enum(['completed', 'pending', 'scheduled']),
  dueDate: z.string().optional(),
  customerId: z.string().optional(),
});

const CashFlowInputSchema = z.object({
  payments: z.array(PaymentSchema).describe('An array of payment objects, each representing an income or expense.'),
});

export type CashFlowInput = z.infer<typeof CashFlowInputSchema>;

const CashFlowOutputSchema = z.object({
  currentCashPosition: z.number().describe('The current cash position.'),
  thirtyDayProjection: z
    .number()
    .describe('The projected cash flow position in 30 days.'),
  paymentCycleAnalysis: z.string().describe('An analysis of payment cycles.'),
  expensePatternIdentification: z
    .string()
    .describe('Identified patterns in expenses.'),
  upcomingShortfalls: z.string().describe('Any upcoming cash flow shortfalls.'),
});

export type CashFlowOutput = z.infer<typeof CashFlowOutputSchema>;

export async function trackCashFlow(input: CashFlowInput): Promise<CashFlowOutput> {
  return cashFlowTrackingFlow(input);
}

const cashFlowTrackingPrompt = ai.definePrompt({
  name: 'cashFlowTrackingPrompt',
  input: {schema: CashFlowInputSchema},
  output: {schema: CashFlowOutputSchema},
  prompt: `You are a business analyst specializing in cash flow management for SMEs. Your response must be in the Bangla language.

  Analyze the following payment data to provide insights into the business's financial health.

  Payments:
  {{#each payments}}
  - Date: {{date}}, Type: {{type}}, Amount: {{amount}}, Category: {{category}}, Status: {{status}}
  {{/each}}

  Based on this data, provide the following in JSON format:
  {
    "currentCashPosition": The current cash position, calculated as the sum of all completed income minus all completed expenses.,
    "thirtyDayProjection": The projected cash flow position in 30 days, taking into account scheduled income and expenses.,
    "paymentCycleAnalysis": An analysis of payment cycles, identifying any trends or patterns in income and expense payments.,
    "expensePatternIdentification": Identified patterns in expenses, such as recurring costs or seasonal variations.,
    "upcomingShortfalls": Any upcoming cash flow shortfalls, based on scheduled payments and projected income.
  }
  `,
});

const cashFlowTrackingFlow = ai.defineFlow(
  {
    name: 'cashFlowTrackingFlow',
    inputSchema: CashFlowInputSchema,
    outputSchema: CashFlowOutputSchema,
  },
  async input => {
    const {output} = await cashFlowTrackingPrompt(input);
    return output!;
  }
);
