
import { EnrollmentClient } from './components/enrollment-client';
import prisma from '@/lib/prisma';

export default async function EnrollmentPage() {
  const enrolledChildren = await prisma.child.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });

  return <EnrollmentClient initialEnrolledChildren={enrolledChildren} />;
}
