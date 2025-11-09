
'use server';
/**
 * @fileOverview A customer segmentation and analysis AI agent.
 *
 * - customerSegmentation - A function that handles the customer segmentation and analysis process.
 * - CustomerSegmentationInput - The input type for the customerSegmentation function.
 * - CustomerSegmentationOutput - The return type for the customerSegmentation function.
 */


import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CustomerInputSchema = z.object({
      id: z.string(),
      name: z.string(),
      phone: z.string().optional(),
      email: z.string().optional(),
      firstPurchase: z.string().nullable(),
      lastPurchase: z.string().nullable(),
      totalPurchases: z.number(),
      totalSpent: z.number(),
      averageOrderValue: z.number(),
      segment: z.enum(['high-value', 'regular', 'at-risk', 'lost']).optional(),
    });

const CustomerSegmentationInputSchema = z.object({
  customerData: z.array(CustomerInputSchema).describe('An array of customer data objects.'),
});
export type CustomerSegmentationInput = z.infer<typeof CustomerSegmentationInputSchema>;

const CustomerSegmentationOutputSchema = z.object({
    segments: z.array(
        z.object({
            id: z.string(),
            segment: z.enum(['high-value', 'regular', 'at-risk', 'lost']).describe('The assigned customer segment.'),
        })
    ).describe("The segmentation result for each customer."),
    summary: z.string().describe("A high-level summary of the customer base composition."),
    observations: z.array(z.string()).describe("Key observations and insights derived from the customer data and segments."),
    recommendations: z.array(z.string()).describe("Actionable recommendations for marketing, retention, and engagement strategies."),
});
export type CustomerSegmentationOutput = z.infer<typeof CustomerSegmentationOutputSchema>;

export async function customerSegmentation(input: CustomerSegmentationInput): Promise<CustomerSegmentationOutput> {
  return customerSegmentationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'customerSegmentationPrompt',
  input: {schema: CustomerSegmentationInputSchema},
  output: {schema: CustomerSegmentationOutputSchema},
  prompt: `You are an expert business analyst specializing in customer segmentation for businesses in Bangladesh. Your response must be in the Bangla language.

Analyze the provided customer data. For each customer, assign them to one of the following segments:
- high-value: Customers with high total spending and recent purchase activity. These are your best customers.
- regular: Customers with moderate spending and consistent, recent purchase activity. They form the backbone of the business.
- at-risk: Customers who used to purchase more frequently or recently, but whose activity has declined. They might be close to churning.
- lost: Customers who have not made a purchase in a long time (e.g., over 6 months) and are likely churned.

Based on the overall segmentation and data, provide a holistic analysis that includes:
1.  **segments**: A JSON array where each object contains the customer's ID and their assigned segment.
2.  **summary**: A brief, one-paragraph summary of the customer base (e.g., "The customer base is mostly composed of regular buyers, with a small but highly valuable group of loyal customers...").
3.  **observations**: 3-4 bullet-point insights about the customer base (e.g., "There is a significant group of 'at-risk' customers who haven't purchased in the last 3 months," or "High-value customers have a significantly higher average order value.").
4.  **recommendations**: 3-4 actionable recommendations based on your observations (e.g., "Launch a targeted re-engagement campaign for 'at-risk' customers with a special offer," or "Create a loyalty program for 'high-value' customers to increase retention.").

Customer Data:
{{json customerData}}

Provide the full response in the specified JSON format.`,
});

const customerSegmentationFlow = ai.defineFlow(
  {
    name: 'customerSegmentationFlow',
    inputSchema: CustomerSegmentationInputSchema,
    outputSchema: CustomerSegmentationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
