
import prisma from '@/lib/prisma';
import AssessmentsClient from './client';

export const dynamic = 'force-dynamic';

export default async function AssessmentsPage() {
    const daycare = await prisma.daycare.findFirst();
    
    const children = daycare 
      ? await prisma.child.findMany({
          where: { daycareId: daycare.id },
          orderBy: { name: 'asc' }
        })
      : [];
      
    return <AssessmentsClient children={children} />;
}
