
"use server";

// import { generateAssessmentFlow } from "@/ai/flows/generate-assessment-flow";
import { z } from "zod";
import type { GenerateAssessmentOutput } from "@/ai/flows/generate-assessment-flow";
import prisma from "@/lib/prisma";

const AssessmentFormSchema = z.object({
  childId: z.string().min(1, { message: "Please select a child." }),
  reportingPeriod: z.string().min(1, { message: "Please select a reporting period." }),
  observations: z.string().min(20, { message: "Observations must be at least 20 characters long." }),
});

function calculateAge(dob: Date): number {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    return age > 0 ? age : 0;
}

export async function generateAssessment(prevState: any, formData: FormData) {
  const validatedFields = AssessmentFormSchema.safeParse({
    childId: formData.get("childId"),
    reportingPeriod: formData.get("reportingPeriod"),
    observations: formData.get("observations"),
  });

  if (!validatedFields.success) {
    const error = validatedFields.error.flatten().fieldErrors;
    const errorMessage = Object.values(error).flat()[0] || "Invalid data provided.";
    return {
      output: null,
      error: errorMessage,
    };
  }
  
  const child = await prisma.child.findUnique({ where: { id: validatedFields.data.childId } });
  if (!child) {
      return { output: null, error: "Child not found." };
  }

  // MOCK IMPLEMENTATION to prevent compilation hangs
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate AI processing time

  const mockOutput: GenerateAssessmentOutput = {
    socialEmotional: `${child.name} is showing wonderful progress in sharing with friends. They are beginning to take turns during group play. (Mock Data)`,
    cognitiveSkills: `They show great curiosity and are particularly engaged during story time, often asking thoughtful questions about the characters. (Mock Data)`,
    languageCommunication: `${child.name}'s vocabulary is expanding. They are now using 3-4 word sentences to express their needs and ideas. (Mock Data)`,
    motorSkills: `Fine motor skills are developing well, as seen in their ability to hold a crayon correctly. Gross motor skills are strong; they love to run and climb outside. (Mock Data)`,
    summaryRecommendations: `Overall, ${child.name} is thriving. To support their growth, continue to encourage sharing at home and read books together daily. (Mock Data)`
  };

  return { output: mockOutput, error: null };

  /*
  try {
    const result = await generateAssessmentFlow({
        childName: child.name,
        childAge: calculateAge(child.dateOfBirth),
        reportingPeriod: validatedFields.data.reportingPeriod,
        observations: validatedFields.data.observations,
    });
    return { output: result, error: null };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return {
      output: null,
      error: `AI assessment generation failed: ${errorMessage}`,
    };
  }
  */
}
