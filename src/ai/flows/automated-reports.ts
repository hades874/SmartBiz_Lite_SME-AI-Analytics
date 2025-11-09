'use server';
/**
 * @fileOverview Generates automated business performance reports.
 *
 * - generateReport - A function that generates a business performance report.
 * - GenerateReportInput - The input type for the generateReport function.
 * - GenerateReportOutput - The return type for the generateReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReportInputSchema = z.object({
  salesData: z.string().describe('JSON string of sales data.'),
  inventoryData: z.string().describe('JSON string of inventory data.'),
  paymentData: z.string().describe('JSON string of payment data.'),
  customerData: z.string().describe('JSON string of customer data.'),
  reportPeriod: z.enum(['weekly', 'monthly']).describe('The period for the report.'),
});
export type GenerateReportInput = z.infer<typeof GenerateReportInputSchema>;

const GenerateReportOutputSchema = z.object({
    summary: z.string().describe('A brief summary of the business performance for the period.'),
    keyMetrics: z.array(z.object({
        metric: z.string().describe('The name of the key metric (e.g., Total Revenue).'),
        value: z.string().describe('The value of the metric (e.g., "৳50,000").'),
        change: z.string().optional().describe('The change from the previous period (e.g., "+5%").')
    })).describe('An array of key performance metrics.'),
    actionItems: z.array(z.string()).describe('A list of recommended action items.'),
    recommendations: z.array(z.string()).describe('A list of strategic recommendations.'),
});
export type GenerateReportOutput = z.infer<typeof GenerateReportOutputSchema>;

export async function generateReport(input: GenerateReportInput): Promise<GenerateReportOutput> {
  return generateReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReportPrompt',
  input: {schema: GenerateReportInputSchema},
  output: {schema: GenerateReportOutputSchema},
  prompt: `You are a business analyst for SMEs in Bangladesh. Generate a business performance report based on the following data for the specified period. Your response must be in the Bangla language and tailored for a Bangladeshi audience.\n\nReport Period: {{{reportPeriod}}}\n\nSales Data: {{{salesData}}}\n\nInventory Data: {{{inventoryData}}}\n\nPayment Data: {{{paymentData}}}\n\nCustomer Data: {{{customerData}}}\n\nProvide a concise and informative report including key metrics, action items, and recommendations. The report should be well structured and easy to understand.\n\nFormat the output as a JSON object with 'summary', 'keyMetrics', 'actionItems', and 'recommendations' fields.
`,
});

const generateReportFlow = ai.defineFlow(
  {
    name: 'generateReportFlow',
    inputSchema: GenerateReportInputSchema,
    outputSchema: GenerateReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
