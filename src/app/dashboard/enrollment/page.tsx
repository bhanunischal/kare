
import { EnrollmentClient } from './components/enrollment-client';
import type { Child } from '@prisma/client';

export default async function EnrollmentPage() {
  // const enrolledChildren = await prisma.child.findMany();
  const enrolledChildren: Child[] = [];

  return <EnrollmentClient initialEnrolledChildren={enrolledChildren} />;
}
