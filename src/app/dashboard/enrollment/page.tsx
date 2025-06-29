
import { EnrollmentClient } from './components/enrollment-client';
import { initialEnrolledChildren } from './data';

export default async function EnrollmentPage() {
  // const enrolledChildren = await prisma.child.findMany();
  const enrolledChildren = initialEnrolledChildren;

  return <EnrollmentClient initialEnrolledChildren={enrolledChildren} />;
}
