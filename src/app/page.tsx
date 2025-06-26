"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Users, Activity, MessageCircle, CreditCard, BarChart, FileText, Menu, X } from "lucide-react";
import { Logo } from "@/components/logo";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: "Child Enrollment",
      description: "Streamlined child registration process with digital document submission.",
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-primary" />,
      title: "Attendance Tracking",
      description: "Track attendance via digital check-in/check-out.",
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Staff Management",
      description: "Manage staff schedules and track certifications.",
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-primary" />,
      title: "Parent Communication",
      description: "A dedicated portal for announcements and updates.",
    },
    {
      icon: <CreditCard className="h-8 w-8 text-primary" />,
      title: "Billing & Payments",
      description: "Automated tuition billing and online payment processing.",
    },
    {
      icon: <BarChart className="h-8 w-8 text-primary" />,
      title: "Waitlist Analytics",
      description: "Forecast demand and optimize enrollment using AI.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-20 flex items-center bg-background/95 backdrop-blur-sm sticky top-0 z-50 border-b">
        <Link href="/" className="flex items-center justify-center">
          <Logo />
        </Link>
        <nav className="ml-auto hidden lg:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4">Features</Link>
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">Pricing</Link>
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">Contact</Link>
            <Link href="/login" passHref>
                <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup" passHref>
                <Button>Sign Up</Button>
            </Link>
        </nav>
        <button className="ml-auto lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Toggle menu</span>
        </button>
      </header>
        {isMenuOpen && (
            <div className="absolute top-20 left-0 w-full bg-background z-40 flex flex-col items-center gap-8 py-8 lg:hidden border-b">
                <Link href="#features" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium">Features</Link>
                <Link href="#" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium">Pricing</Link>
                <Link href="#" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium">Contact</Link>
                <div className="flex flex-col gap-4 w-full px-8">
                    <Link href="/login" passHref>
                        <Button variant="outline" className="w-full">Login</Button>
                    </Link>
                    <Link href="/signup" passHref>
                        <Button className="w-full">Sign Up</Button>
                    </Link>
                </div>
            </div>
        )}

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Modernize Your Daycare with CareConnect BC
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    The all-in-one solution for child daycare centers in British Columbia. Streamline operations, enhance parent communication, and grow your business.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/dashboard">
                    <Button size="lg">View Dashboard</Button>
                  </Link>
                   <Link href="/signup">
                    <Button size="lg" variant="secondary">Get Started</Button>
                  </Link>
                </div>
              </div>
               <Carousel className="w-full max-w-lg mx-auto relative">
                    <CarouselContent>
                    <CarouselItem>
                        <Card>
                        <CardContent className="flex aspect-[4/3] items-center justify-center p-0">
                            <Image
                                src="https://placehold.co/600x450.png"
                                alt="Children playing"
                                width={600}
                                height={450}
                                className="rounded-lg object-cover w-full h-full"
                                data-ai-hint="children playing"
                            />
                        </CardContent>
                        </Card>
                    </CarouselItem>
                    <CarouselItem>
                        <Card>
                        <CardContent className="flex aspect-[4/3] items-center justify-center p-0">
                            <Image
                                src="https://placehold.co/600x450.png"
                                alt="Daycare classroom"
                                width={600}
                                height={450}
                                className="rounded-lg object-cover w-full h-full"
                                data-ai-hint="daycare classroom"
                            />
                        </CardContent>
                        </Card>
                    </CarouselItem>
                    <CarouselItem>
                        <Card>
                        <CardContent className="flex aspect-[4/3] items-center justify-center p-0">
                            <Image
                                src="https://placehold.co/600x450.png"
                                alt="Teacher reading to kids"
                                width={600}
                                height={450}
                                className="rounded-lg object-cover w-full h-full"
                                data-ai-hint="teacher kids"
                            />
                        </CardContent>
                        </Card>
                    </CarouselItem>
                    </CarouselContent>
                    <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
                    <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
                </Carousel>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Everything Your Daycare Needs</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  CareConnect BC provides a comprehensive suite of tools designed to simplify your daily administrative tasks and improve overall efficiency.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:grid-cols-3 lg:gap-12 mt-12">
              {features.map((feature) => (
                <div key={feature.title} className="grid gap-2 text-center">
                  <div className="flex justify-center items-center">{feature.icon}</div>
                  <h3 className="text-lg font-bold font-headline">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 CareConnect BC. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
