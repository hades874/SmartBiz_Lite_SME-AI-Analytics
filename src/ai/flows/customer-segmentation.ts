
'use server';
// A customer segmentation AI agent.
//
// - customerSegmentation - A function that handles the customer segmentation process.
// - CustomerSegmentationInput - The input type for the customerSegmentation function.
// - CustomerSegmentationOutput - The return type for the customerSegmentation function.


import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CustomerInputSchema = z.object({
      id: z.string(),
      name: z.string(),
      phone: z.string().optional(),
      email: z.string().optional(),
      firstPurchase: z.string(),
      lastPurchase: z.string(),
      totalPurchases: z.number(),
      totalSpent: z.number(),
      averageOrderValue: z.number(),
      // We don't need to send the existing segment to the AI
      // segment: z.enum(['high-value', 'regular', 'at-risk', 'lost']).optional(),
    });

const CustomerSegmentationInputSchema = z.object({
  customerData: z.array(CustomerInputSchema).describe('An array of customer data objects.'),
});
export type CustomerSegmentationInput = z.infer<typeof CustomerSegmentationInputSchema>;

const CustomerSegmentationOutputSchema = z.array(
  z.object({
    id: z.string(),
    segment: z.enum(['high-value', 'regular', 'at-risk', 'lost']).describe('The customer segment.'),
  })
);
export type CustomerSegmentationOutput = z.infer<typeof CustomerSegmentationOutputSchema>;

export async function customerSegmentation(input: CustomerSegmentationInput): Promise<CustomerSegmentationOutput> {
  return customerSegmentationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'customerSegmentationPrompt',
  input: {schema: CustomerSegmentationInputSchema},
  output: {schema: CustomerSegmentationOutputSchema},
  prompt: `You are an expert business analyst specializing in customer segmentation. Your response must be in the Bangla language.

Analyze the provided customer data and segment each customer into one of the following categories:
- high-value: Customers with high total spending and recent purchase activity.
- regular: Customers with moderate spending and consistent purchase activity.
- at-risk: Customers who used to make frequent purchases but haven't purchased recently.
- lost: Customers who haven't made a purchase in a long time.

Provide a JSON array of objects, where each object contains the customer's ID and their assigned segment.

Customer Data:
{{#each customerData}}
  - ID: {{id}}, Name: {{name}}, Total Spent: {{totalSpent}}, Last Purchase: {{lastPurchase}}
{{/each}}`,
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
