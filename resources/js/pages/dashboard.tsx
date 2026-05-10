import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Users, Book, GraduationCap, ListChecks } from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
// import { Description } from '@radix-ui/react-dialog';

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

type DashboardProps = {
    schoolName?: string;
    totalStudents?: number;
    totalCourses?: number;
    totalTeachers?: number;
    totalEnrollments?: number;
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
                            <p className="text-gray-500 mt-4">
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

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 p-4 bg-white/80 dark:bg-neutral-900/80 rounded-2xl shadow-2xl border border-gray-200 dark:border-neutral-800">

                            {stats.map(({ label, icon: Icon, key, description, color }) => (

                                <Card
                                    key={label}
                                    className="transition-all hover:scale-105 hover:shadow-xl"
                                >

                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">

                                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                                            <Icon className={`w-6 h-6 ${color}`} />
                                            {label}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-4xl font-extrabold mb-1 text-center tracking-tight text-gray-900 dark:text-white drop-shadow">
                                            {pageProps[key]}
                                        </div>

                                        <CardDescription className="text-center text-base">
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