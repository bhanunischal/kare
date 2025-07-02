
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
  socialEmotionalNotes: z.string().describe("Teacher's raw notes on the child's social and emotional development."),
  cognitiveSkillsNotes: z.string().describe("Teacher's raw notes on the child's cognitive skills development."),
  languageCommunicationNotes: z.string().describe("Teacher's raw notes on the child's language and communication development."),
  motorSkillsNotes: z.string().describe("Teacher's raw notes on the child's fine and gross motor skills development."),
});
export type GenerateAssessmentInput = z.infer<typeof GenerateAssessmentInputSchema>;

const GenerateAssessmentOutputSchema = z.object({
  socialEmotional: z.string().describe("A professional assessment of the child's social and emotional development, including interactions with peers and adults, and emotional regulation."),
  cognitiveSkills: z.string().describe("A professional assessment of the child's cognitive skills, including problem-solving, curiosity, and engagement with learning activities."),
  languageCommunication: z.string().describe("A professional assessment of the child's language and communication abilities, including vocabulary, listening skills, and expression of ideas."),
  motorSkills: z.string().describe("A professional assessment of the child's fine and gross motor skills, observed during play and other physical activities."),
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
    prompt: `You are a highly experienced Early Childhood Educator (ECE) tasked with writing a performance assessment report for a child. Your role is to take the teacher's raw notes for each section and transform them into a professional, constructive, and encouraging report paragraph. The tone should be easy for parents to understand. Avoid jargon.

    **Child Information:**
    - Name: {{{childName}}}
    - Age: {{{childAge}}}
    - Reporting Period: {{{reportingPeriod}}}

    **Instructions:**
    For each section below, use the provided teacher's notes to generate a polished paragraph for the report.

    1.  **Social-Emotional Development:**
        *Teacher's Notes:* {{{socialEmotionalNotes}}}

    2.  **Cognitive Skills:**
        *Teacher's Notes:* {{{cognitiveSkillsNotes}}}

    3.  **Language & Communication:**
        *Teacher's Notes:* {{{languageCommunicationNotes}}}

    4.  **Fine & Gross Motor Skills:**
        *Teacher's Notes:* {{{motorSkillsNotes}}}

    5.  **Summary & Recommendations:**
        After reviewing all the notes, provide a brief, positive overview of the child's progress. Then, offer 1-2 simple, actionable suggestions for parents to support their development at home.

    Generate the full, polished report now based on the notes.`,
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
