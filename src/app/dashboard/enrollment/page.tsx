
import { EnrollmentClient } from './components/enrollment-client';
import { initialEnrolledChildren } from './data';
import type { Child } from '@prisma/client';

export default async function EnrollmentPage() {
  // const enrolledChildren = await prisma.child.findMany({
  //   orderBy: {
  //     createdAt: 'desc'
  //   }
  // });

  // Using static data to prevent server hanging issues during development.
  // The "Add New Child" form still saves to the live database.
  const enrolledChildren: Child[] = initialEnrolledChildren;


  return <EnrollmentClient initialEnrolledChildren={enrolledChildren} />;
}
