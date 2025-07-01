
import prisma from '@/lib/prisma';
import StaffClientPage from './client';

export const dynamic = 'force-dynamic';

export default async function StaffPage() {
    // TODO: Scope this to the logged-in user's daycareId once session management is implemented.
    const daycare = await prisma.daycare.findFirst();
    
    const staffMembers = daycare 
      ? await prisma.staff.findMany({
          where: { daycareId: daycare.id },
          orderBy: { createdAt: 'desc' }
        })
      : [];
      
    return <StaffClientPage initialStaffMembers={staffMembers} />;
}
