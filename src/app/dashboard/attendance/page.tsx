
import prisma from '@/lib/prisma';
import AttendanceClient from './client';

export const dynamic = 'force-dynamic';

export default async function AttendancePage() {
    // TODO: Scope this to the logged-in user's daycareId once session management is implemented.
    const daycare = await prisma.daycare.findFirst();
    
    const children = daycare 
      ? await prisma.child.findMany({
          where: { daycareId: daycare.id },
          orderBy: { name: 'asc' }
        })
      : [];
      
    return <AttendanceClient initialChildren={children} />;
}
