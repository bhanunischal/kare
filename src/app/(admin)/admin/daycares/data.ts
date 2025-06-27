
export type Daycare = {
  id: string;
  name: string;
  status: 'Active' | 'Inactive' | 'Pending';
  plan: 'Basic' | 'Premium' | 'Enterprise';
  childrenCount: number;
  staffCount: number;
  location: string;
  joinDate: string;
};

export const allDaycares: Daycare[] = [
  { id: 'dc_1', name: 'Sunshine Daycare', status: 'Active', plan: 'Premium', childrenCount: 72, staffCount: 10, location: 'Vancouver, BC', joinDate: '2023-01-15' },
  { id: 'dc_2', name: 'Little Sprouts Academy', status: 'Active', plan: 'Basic', childrenCount: 35, staffCount: 5, location: 'Burnaby, BC', joinDate: '2023-03-22' },
  { id: 'dc_3', name: 'Kiddie Cove', status: 'Inactive', plan: 'Premium', childrenCount: 50, staffCount: 8, location: 'Richmond, BC', joinDate: '2022-11-01' },
  { id: 'dc_4', name: 'Happy Trails Childcare', status: 'Active', plan: 'Enterprise', childrenCount: 120, staffCount: 25, location: 'Surrey, BC', joinDate: '2023-05-10' },
  { id: 'dc_5', name: 'The Learning Tree', status: 'Pending', plan: 'Basic', childrenCount: 0, staffCount: 0, location: 'Coquitlam, BC', joinDate: '2024-07-28' },
];
