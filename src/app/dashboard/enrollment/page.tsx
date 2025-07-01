
import { EnrollmentClient } from './components/enrollment-client';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function EnrollmentPage() {
  // TODO: Scope this to the logged-in user's daycareId once session management is implemented.
  const daycare = await prisma.daycare.findFirst();
  
  const enrolledChildren = daycare 
    ? await prisma.child.findMany({
        where: { daycareId: daycare.id },
        orderBy: { createdAt: 'desc' }
      })
    : [];

  return <EnrollmentClient initialEnrolledChildren={enrolledChildren} />;
}
