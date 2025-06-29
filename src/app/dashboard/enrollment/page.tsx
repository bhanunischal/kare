
import { EnrollmentClient } from './components/enrollment-client';
import { initialEnrolledChildren } from './data';
import type { Child } from '@prisma/client';

export default async function EnrollmentPage() {
  // Using static data to prevent server hanging issues during development.
  const enrolledChildren: Child[] = initialEnrolledChildren;


  return <EnrollmentClient initialEnrolledChildren={enrolledChildren} />;
}
