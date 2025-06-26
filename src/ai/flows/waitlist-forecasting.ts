// src/ai/flows/waitlist-forecasting.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for forecasting waitlist demand and optimizing enrollment strategies.
 *
 * - forecastWaitlist - A function that triggers the waitlist forecasting process.
 * - ForecastWaitlistInput - The input type for the forecastWaitlist function.
 * - ForecastWaitlistOutput - The return type for the forecastWaitlist function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ForecastWaitlistInputSchema = z.object({
  historicalData: z
    .string()
    .describe(
      'Historical waitlist data and enrollment trends, including dates, number of children on the waitlist, and enrollment numbers.'
    ),
  currentCapacity: z.number().describe('The current capacity of the daycare center.'),
  seasonalTrends: z
    .string()
    .optional()
    .describe(
      'Optional information on seasonal trends that may affect waitlist demand and enrollment.'
    ),
});
export type ForecastWaitlistInput = z.infer<typeof ForecastWaitlistInputSchema>;

const ForecastWaitlistOutputSchema = z.object({
  forecastedDemand: z
    .string()
    .describe('A forecast of future waitlist demand for the next [timeframe].'),
  enrollmentStrategies:
    z.string().describe('Recommended enrollment strategies based on the forecasted demand.'),
  resourceAllocation: z
    .string()
    .describe('Suggestions for resource allocation to meet the forecasted demand.'),
});
export type ForecastWaitlistOutput = z.infer<typeof ForecastWaitlistOutputSchema>;

export async function forecastWaitlist(input: ForecastWaitlistInput): Promise<ForecastWaitlistOutput> {
  return forecastWaitlistFlow(input);
}

const prompt = ai.definePrompt({
  name: 'forecastWaitlistPrompt',
  input: {schema: ForecastWaitlistInputSchema},
  output: {schema: ForecastWaitlistOutputSchema},
  prompt: `You are an expert consultant in childcare management. Analyze the provided historical waitlist data and enrollment trends to forecast future demand and suggest enrollment strategies and resource allocation.  Consider current capacity and any provided seasonal trends. If no seasonal trends are provided, assume enrollment to be flat. Provide forecasts, enrollment strategies and resource allocation in a structured manner.

Historical Data: {{{historicalData}}}
Current Capacity: {{{currentCapacity}}}
Seasonal Trends (if any): {{{seasonalTrends}}}

Based on this data, generate a forecast of future waitlist demand for the next quarter, recommend enrollment strategies, and suggest resource allocation strategies.
`,
});

const forecastWaitlistFlow = ai.defineFlow(
  {
    name: 'forecastWaitlistFlow',
    inputSchema: ForecastWaitlistInputSchema,
    outputSchema: ForecastWaitlistOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
