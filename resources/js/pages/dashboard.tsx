import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Users, Book, GraduationCap, ListChecks, ClipboardList, FileText } from 'lucide-react'; // নতুন আইকন যোগ করা হয়েছে
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';

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
        color: 'text-orange-500',
    },
    {
        label: 'Enrollments',
        icon: ListChecks,
        key: 'totalEnrollments',
        description: 'Total course enrollments',
        color: 'text-pink-500',
    },
    // নতুন স্ট্যাটাস কার্ড
    {
        label: 'Exams',
        icon: ClipboardList,
        key: 'totalExams',
        description: 'Total examinations created',
        color: 'text-purple-500',
    },
    {
        label: 'Results',
        icon: FileText,
        key: 'totalResults',
        description: 'Total results recorded',
        color: 'text-indigo-500',
    }
];

type DashboardProps = {
    schoolName?: string;
    totalStudents?: number;
    totalCourses?: number;
    totalTeachers?: number;
    totalEnrollments?: number;
    totalExams?: number;
    totalResults?: number;
    [key: string]: string | number | undefined;
};

export default function Dashboard() {
    const pageProps = usePage().props as unknown as DashboardProps;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="py-12 min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-4xl font-extrabold mb-2 tracking-tight text-primary drop-shadow-lg text-left">
                            Welcome👋
                            <p className="text-gray-500 mt-4 text-lg">
                                Manage your school system easily.
                            </p>
                        </h1>                                             
                        {pageProps.schoolName && (
                            <div className="text-xl text-gray-700 dark:text-gray-200 font-semibold text-left mb-4">
                                <span className="inline-block px-4 py-1 rounded-full bg-primary/10 dark:bg-primary/20 text-primary font-bold shadow-sm">
                                    {pageProps.schoolName}
                                </span>
                            </div>
                        )}
                        <div className="h-1 w-24 bg-gradient-to-r from-blue-400 via-pink-400 to-yellow-400 rounded-full mb-6"></div>

                        {/* গ্রিড কলাম সংখ্যা বাড়ানো হয়েছে যাতে ৬টি কার্ড সুন্দর দেখায় */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-4 bg-white/80 dark:bg-neutral-900/80 rounded-2xl shadow-2xl border border-gray-200 dark:border-neutral-800">

                            {stats.map(({ label, icon: Icon, key, description, color }) => (

                                <Card
                                    key={label}
                                    className="transition-all hover:scale-105 hover:shadow-xl border-none shadow-md"
                                >
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-base font-bold flex items-center gap-2">
                                            <div className={`p-2 rounded-lg bg-gray-50 dark:bg-neutral-800`}>
                                                <Icon className={`w-5 h-5 ${color}`} />
                                            </div>
                                            {label}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-4xl font-black mb-1 text-center tracking-tight text-gray-900 dark:text-white">
                                            {pageProps[key] || 0}
                                        </div>
                                        <CardDescription className="text-center text-sm font-medium">
                                            {description}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}