
import prisma from '@/lib/prisma';
import BillingClient from './client';

export const dynamic = 'force-dynamic';

export default async function BillingPage() {
    const daycare = await prisma.daycare.findFirst();
    
    const children = daycare 
      ? await prisma.child.findMany({
          where: { daycareId: daycare.id },
          orderBy: { name: 'asc' }
        })
      : [];
      
    return <BillingClient initialEnrolledChildren={children} />;
}
