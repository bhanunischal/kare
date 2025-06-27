
export type Program = 'Infant (0-12months)' | 'Toddler (1 to 3 years)' | 'Preschool (3 to 5 years)' | 'Gradeschooler (5 to 12 years)';
export const programOptions: Program[] = ['Infant (0-12months)', 'Toddler (1 to 3 years)', 'Preschool (3 to 5 years)', 'Gradeschooler (5 to 12 years)'];

export type ProgramType = 'Full time' | 'Part time' | 'Ad-hoc daily basis';
export const programTypeOptions: ProgramType[] = ['Full time', 'Part time', 'Ad-hoc daily basis'];

export type ChildStatus = 'Active' | 'Waitlisted' | 'Inactive';

export type Child = {
  id: string;
  name: string;
  photoUrl?: string;
  photoHint?: string;
  age: number;
  program: Program;
  programType: ProgramType;
  status: ChildStatus;
  dob: string;
  startDate: string;
  motherName: string;
  fatherName: string;
  mobilePhone: string;
  address: string;
  emergencyName: string;
  emergencyPhone: string;
  allergies?: string;
  notes?: string;
  vaccination?: string;
};

export const initialEnrolledChildren: Child[] = [
    { id: '1', name: 'Olivia Martin', photoUrl: 'https://placehold.co/100x100.png', photoHint: 'smiling girl', age: 4, program: 'Preschool (3 to 5 years)', programType: 'Full time', startDate: '2023-09-01', status: 'Active', dob: '2020-05-10', motherName: 'Sarah Martin', fatherName: 'David Martin', mobilePhone: '(555) 111-1111', address: '123 Maple St, Anytown, USA', emergencyName: 'Carol White', emergencyPhone: '(555) 222-2222', allergies: 'Peanuts', vaccination: 'Up to date.' },
    { id: '2', name: 'Liam Garcia', photoUrl: 'https://placehold.co/100x100.png', photoHint: 'laughing boy', age: 3, program: 'Toddler (1 to 3 years)', programType: 'Full time', startDate: '2023-09-01', status: 'Active', dob: '2021-08-22', motherName: 'Maria Garcia', fatherName: 'Jose Garcia', mobilePhone: '(555) 333-3333', address: '456 Oak Ave, Anytown, USA', emergencyName: 'Luis Hernandez', emergencyPhone: '(555) 444-4444', notes: 'Loves building blocks.', vaccination: 'Up to date.' },
    { id: '3', name: 'Emma Rodriguez', photoUrl: 'https://placehold.co/100x100.png', photoHint: 'girl pigtails', age: 5, program: 'Preschool (3 to 5 years)', programType: 'Part time', startDate: '2023-09-01', status: 'Active', dob: '2019-02-15', motherName: 'Ana Rodriguez', fatherName: 'Carlos Rodriguez', mobilePhone: '(555) 555-5555', address: '789 Pine Ln, Anytown, USA', emergencyName: 'Sofia Rodriguez', emergencyPhone: '(555) 666-6666', vaccination: 'Up to date.' },
    { id: '4', name: 'Noah Hernandez', photoUrl: 'https://placehold.co/100x100.png', photoHint: 'toddler boy', age: 2, program: 'Toddler (1 to 3 years)', programType: 'Full time', startDate: '2024-02-01', status: 'Waitlisted', dob: '2022-01-30', motherName: 'Isabella Hernandez', fatherName: 'Mateo Hernandez', mobilePhone: '(555) 777-7777', address: '101 Birch Rd, Anytown, USA', emergencyName: 'Elena Cruz', emergencyPhone: '(555) 888-8888', allergies: 'Dairy, Gluten', vaccination: 'Missing one shot.' },
    { id: '5', name: 'Ava Lopez', photoUrl: 'https://placehold.co/100x100.png', photoHint: 'preschool girl', age: 4, program: 'Preschool (3 to 5 years)', programType: 'Full time', startDate: '2023-12-01', status: 'Active', dob: '2020-11-05', motherName: 'Mia Lopez', fatherName: 'James Lopez', mobilePhone: '(555) 999-9999', address: '212 Elm Ct, Anytown, USA', emergencyName: 'Sophia King', emergencyPhone: '(555) 000-0000', vaccination: 'Up to date.' },
    { id: '6', name: 'James Wilson', photoUrl: 'https://placehold.co/100x100.png', photoHint: 'schoolboy portrait', age: 6, program: 'Gradeschooler (5 to 12 years)', programType: 'Part time', startDate: '2022-09-01', status: 'Inactive', dob: '2018-03-12', motherName: 'Jessica Wilson', fatherName: 'Brian Wilson', mobilePhone: '(555) 123-7890', address: '333 Cedar Dr, Anytown, USA', emergencyName: 'Robert Johnson', emergencyPhone: '(555) 987-6543' },
];
