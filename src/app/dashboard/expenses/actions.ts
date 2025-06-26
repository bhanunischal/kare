
'use server';

import {z} from 'zod';

const ExpenseFormSchema = z.object({
  date: z.string().min(1, {message: 'Date is required.'}),
  category: z.string().min(1, {message: 'Category is required.'}),
  amount: z.coerce.number().positive({message: 'Amount must be a positive number.'}),
  vendor: z.string().optional(),
  description: z.string().min(1, {message: 'Description is required.'}),
});

export type ExpenseFormData = z.infer<typeof ExpenseFormSchema>;

export async function addExpense(prevState: any, formData: FormData) {
  const validatedFields = ExpenseFormSchema.safeParse({
    date: formData.get('date'),
    category: formData.get('category'),
    amount: formData.get('amount'),
    vendor: formData.get('vendor'),
    description: formData.get('description'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Please review the form and correct any errors.',
      errors: validatedFields.error.flatten().fieldErrors,
      data: null,
    };
  }

  // In a real application, you would save validatedFields.data to your database.
  console.log('New expense added:', validatedFields.data);

  return {
    message: 'Expense added successfully!',
    errors: null,
    data: validatedFields.data,
  };
}
