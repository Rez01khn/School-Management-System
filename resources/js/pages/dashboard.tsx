import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Users, Book, GraduationCap, BookOpen, ListChecks } from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Description } from '@radix-ui/react-dialog';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

const stats = [
    {
        label: 'Students',
        icon: Users,
        key: 'totalStudents',
        description: 'Total students in your school',
        color: 'text-blue-500',
    },
    {
        label: 'Courses',
        icon: Book,
        key: 'totalCourses',
        description: 'Total courses offered',
        color: 'text-green-500',
    },
    {
        label: 'Teachers',
        icon: GraduationCap,
        key: 'totalTeachers',
        description: 'Total teachers',
        color: 'text-green-500',
    },

    {
        label: 'Enrollments',
        icon: ListChecks,
        key: 'totalEnrollments',
        description: 'Total course enrollments',
        color: 'text-pink-500',
    }
    ]; 


export default function Dashboard() {
const pageProps = usePage().props as any;
return
<AppLayout breadcrumbs={breadcrumbs}>
<Head title="Dashboard" />
<div className="py-12 min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 dark:from-neutral-900 
<div className="max-w-7x1 mx-auto sm: px-6 lg:px-8">
<div className="mb-8">
<h1 className="text-4x1 font-extrabold mb-2 tracking-tight text-primary drop-shadow-lg text-left"
</div>
</div>
</div>
</AppLayout>