
'use server';
/**
 * @fileOverview An AI flow for generating child performance assessments.
 *
 * - generateAssessmentFlow - A function that handles the child assessment generation process.
 * - GenerateAssessmentInput - The input type for the generateAssessmentFlow function.
 * - GenerateAssessmentOutput - The return type for the generateAssessmentFlow function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAssessmentInputSchema = z.object({
  childName: z.string().describe("The full name of the child."),
  childAge: z.number().describe("The age of the child in years."),
  reportingPeriod: z.string().describe("The period this report covers (e.g., 'July 2024', 'Q3 2024')."),
  observations: z.string().describe("A summary of observations made by the teacher or caregiver about the child's behavior, skills, and interactions."),
});
export type GenerateAssessmentInput = z.infer<typeof GenerateAssessmentInputSchema>;

const GenerateAssessmentOutputSchema = z.object({
  socialEmotional: z.string().describe("An assessment of the child's social and emotional development, including interactions with peers and adults, and emotional regulation."),
  cognitiveSkills: z.string().describe("An assessment of the child's cognitive skills, including problem-solving, curiosity, and engagement with learning activities."),
  languageCommunication: z.string().describe("An assessment of the child's language and communication abilities, including vocabulary, listening skills, and expression of ideas."),
  motorSkills: z.string().describe("An assessment of the child's fine and gross motor skills, observed during play and other physical activities."),
  summaryRecommendations: z.string().describe("A concise summary of the child's overall progress and recommendations for parents to support continued development at home."),
});
export type GenerateAssessmentOutput = z.infer<typeof GenerateAssessmentOutputSchema>;

export async function generateAssessmentFlow(input: GenerateAssessmentInput): Promise<GenerateAssessmentOutput> {
  return assessmentFlow(input);
}

const assessmentPrompt = ai.definePrompt({
    name: 'generateAssessmentPrompt',
    input: {schema: GenerateAssessmentInputSchema},
    output: {schema: GenerateAssessmentOutputSchema},
    prompt: `You are a highly experienced Early Childhood Educator (ECE) tasked with writing a performance assessment report for a child. The report should be professional, constructive, and encouraging, written in a tone that is easy for parents to understand. Avoid jargon.

    Based on the following information, generate a comprehensive assessment covering all the required output fields.

    **Child Information:**
    - Name: {{{childName}}}
    - Age: {{{childAge}}}
    - Reporting Period: {{{reportingPeriod}}}

    **Teacher's Observations:**
    {{{observations}}}

    **Instructions:**
    1.  **Social-Emotional Development:** Describe how the child interacts with others, shares, takes turns, and expresses feelings.
    2.  **Cognitive Skills:** Detail the child's ability to solve problems, show curiosity, and participate in learning games.
    3.  **Language & Communication:** Comment on their vocabulary, ability to follow directions, and how they communicate their needs and ideas.
    4.  **Fine & Gross Motor Skills:** Describe their physical abilities, like running, jumping, drawing, and using small objects.
    5.  **Summary & Recommendations:** Provide a brief, positive overview of their progress and offer 1-2 simple, actionable suggestions for parents to support their development at home.

    Generate the full report now.`,
});

const assessmentFlow = ai.defineFlow(
  {
    name: 'assessmentFlow',
    inputSchema: GenerateAssessmentInputSchema,
    outputSchema: GenerateAssessmentOutputSchema,
  },
  async (input) => {
    const {output} = await assessmentPrompt(input);
    return output!;
  }
);
