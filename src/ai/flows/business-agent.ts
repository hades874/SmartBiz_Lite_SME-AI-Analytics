'use server';
/**
 * @fileOverview A conversational AI business agent that can answer questions and provide insights.
 *
 * - askBusinessAgent - A function that handles the conversational interaction.
 * - BusinessAgentInput - The input type for the askBusinessAgent function.
 * - BusinessAgentOutput - The return type for the askBusinessAgent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { salesDataSchema, inventoryDataSchema, customerDataSchema, BusinessAgentInputSchema, BusinessAgentOutputSchema } from '@/lib/schemas';


export type BusinessAgentInput = z.infer<typeof BusinessAgentInputSchema>;
export type BusinessAgentOutput = z.infer<typeof BusinessAgentOutputSchema>;

export async function askBusinessAgent(input: BusinessAgentInput): Promise<BusinessAgentOutput> {
  return businessAgentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'businessAgentPrompt',
  input: {schema: BusinessAgentInputSchema},
  output: {schema: BusinessAgentOutputSchema},
  prompt: `You are "SmartBiz Lite AI", an expert business analyst and advisor for a small-to-medium enterprise in Bangladesh. Your goal is to provide helpful, actionable insights based on the user's questions and the business data provided.

  ALWAYS answer in a friendly, conversational, and helpful tone. Your response must be in the Bangla language. Keep responses concise and to the point unless asked for details.

  Current Business Data:
  - Sales: {{{json salesData}}}
  - Inventory: {{{json inventoryData}}}
  - Customers: {{{json customerData}}}

  User's Question:
  "{{{query}}}"

  Based on the data and the user's question, provide a relevant and helpful response. If the user asks a general question, provide a summary or a key insight. If they ask a specific question, answer it directly using the data.
  `,
});

const businessAgentFlow = ai.defineFlow(
  {
    name: 'businessAgentFlow',
    inputSchema: BusinessAgentInputSchema,
    outputSchema: BusinessAgentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
