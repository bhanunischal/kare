
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UploadCloud, MoreVertical } from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const galleryItems = [
  { id: '1', src: 'https://placehold.co/600x400.png', alt: 'Children painting', hint: 'kids painting art', date: 'July 25, 2024' },
  { id: '2', src: 'https://placehold.co/600x400.png', alt: 'Story time circle', hint: 'kids storytime', date: 'July 24, 2024' },
  { id: '3', src: 'https://placehold.co/600x400.png', alt: 'Outdoor play structure', hint: 'kids playground', date: 'July 23, 2024' },
  { id: '4', src: 'https://placehold.co/600x400.png', alt: 'Building with blocks', hint: 'kids blocks', date: 'July 22, 2024' },
  { id: '5', src: 'https://placehold.co/600x400.png', alt: 'Snack time', hint: 'kids eating', date: 'July 21, 2024' },
  { id: '6', src: 'https://placehold.co/600x400.png', alt: 'Art and craft projects', hint: 'kids craft', date: 'July 20, 2024' },
  { id: '7', src: 'https://placehold.co/600x400.png', alt: 'Children napping', hint: 'kids naptime', date: 'July 19, 2024' },
  { id: '8', src: 'https://placehold.co/600x400.png', alt: 'Group activity', hint: 'kids learning', date: 'July 18, 2024' },
];

export default function GalleryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Gallery</h1>
          <p className="text-muted-foreground">Share photos of activities and special moments with parents.</p>
        </div>
        <Button>
          <UploadCloud className="mr-2 h-4 w-4" />
          Upload Photo
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {galleryItems.map((item) => (
          <Card key={item.id} className="overflow-hidden group">
            <CardContent className="p-0">
              <div className="relative aspect-w-4 aspect-h-3">
                 <Image
                  src={item.src}
                  alt={item.alt}
                  width={600}
                  height={450}
                  className="object-cover w-full h-full"
                  data-ai-hint={item.hint}
                />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>View</DropdownMenuItem>
                            <DropdownMenuItem>Download</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive-foreground focus:bg-destructive/90">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
