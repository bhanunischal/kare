
'use client';

// This page is no longer used directly for editing, 
// but we'll keep it as a potential future direct-link target.
// For now, it redirects back to the main daycares list.
import { redirect } from 'next/navigation';

export default function AdminDaycareSettingsPage() {
    redirect('/admin/daycares');
}
