"use server";

import { forecastWaitlist } from "@/ai/flows/waitlist-forecasting";
import { z } from "zod";

const WaitlistFormSchema = z.object({
  historicalData: z.string().min(10, { message: "Historical data is too short." }),
  currentCapacity: z.coerce.number().int().positive({ message: "Capacity must be a positive number." }),
  seasonalTrends: z.string().optional(),
});

export async function getWaitlistForecast(prevState: any, formData: FormData) {
  const validatedFields = WaitlistFormSchema.safeParse({
    historicalData: formData.get("historicalData"),
    currentCapacity: formData.get("currentCapacity"),
    seasonalTrends: formData.get("seasonalTrends"),
  });

  if (!validatedFields.success) {
    return {
      output: null,
      error: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  try {
    const result = await forecastWaitlist(validatedFields.data);
    return { output: result, error: null };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return {
      output: null,
      error: `AI forecast failed: ${errorMessage}`,
    };
  }
}
