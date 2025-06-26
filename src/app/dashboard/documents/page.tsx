
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, FileText, Download, Trash2, UploadCloud } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

type Document = {
  id: string;
  name: string;
  type: 'PDF' | 'Word' | 'Image';
  size: string;
  dateAdded: string;
};

const initialDocuments: Document[] = [
  { id: '1', name: 'Parent Handbook 2024.pdf', type: 'PDF', size: '1.2 MB', dateAdded: '2024-07-15' },
  { id: '2', name: 'Enrollment Form - Blank.docx', type: 'Word', size: '45 KB', dateAdded: '2024-07-10' },
  { id: '3', name: 'Field Trip Permission Slip.pdf', type: 'PDF', size: '300 KB', dateAdded: '2024-07-05' },
  { id: '4', name: 'Center-Layout.png', type: 'Image', size: '2.5 MB', dateAdded: '2024-06-20' },
];

const getFileTypeIcon = (type: Document['type']) => {
  // Using simple icons for demonstration
  return <FileText className="h-5 w-5 text-muted-foreground" />;
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Documents</h1>
        <p className="text-muted-foreground">Manage and share important documents with staff and parents.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>All Documents</CardTitle>
            <CardDescription>
              A central repository for all your center's files.
            </CardDescription>
          </div>
          <Button>
            <UploadCloud className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">Type</TableHead>
                <TableHead className="hidden md:table-cell">Date Added</TableHead>
                <TableHead className="hidden sm:table-cell">Size</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      {getFileTypeIcon(doc.type)}
                      <span className="truncate">{doc.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant="outline">{doc.type}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {format(new Date(doc.dateAdded.replace(/-/g, '/')), "MMMM d, yyyy")}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{doc.size}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive-foreground focus:bg-destructive/90">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
