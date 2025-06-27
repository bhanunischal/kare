
"use server";

import { generateAssessmentFlow } from "@/ai/flows/generate-assessment-flow";
import { z } from "zod";
import { initialEnrolledChildren } from "../enrollment/page";

const AssessmentFormSchema = z.object({
  childId: z.string().min(1, { message: "Please select a child." }),
  reportingPeriod: z.string().min(1, { message: "Please select a reporting period." }),
  observations: z.string().min(20, { message: "Observations must be at least 20 characters long." }),
});

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
  
  const child = initialEnrolledChildren.find(c => c.id === validatedFields.data.childId);
  if (!child) {
      return { output: null, error: "Child not found." };
  }

  try {
    const result = await generateAssessmentFlow({
        childName: child.name,
        childAge: child.age,
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
}
