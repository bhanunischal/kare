
import type { DaycareStatus } from "@prisma/client";

export type Daycare = {
  id: string;
  name: string;
  status: DaycareStatus;
  plan: string;
  childrenCount: number;
  staffCount: number;
  location: string | null;
  joinDate: string;
};
