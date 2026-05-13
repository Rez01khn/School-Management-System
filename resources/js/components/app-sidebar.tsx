import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutGrid, 
    GraduationCap, 
    Users, 
    BookOpen, 
    UserPlus, 
    ClipboardCheck, 
    FileSignature, 
    CheckSquare, 
    Github, 
    Award,      
    Megaphone,  
    CalendarDays,
    Wallet,  
} from 'lucide-react'; 
import AppLogo from './app-logo';

// ১. টাইপস্ক্রিপ্টের জন্য ইন্টারফেস ডিফাইন করা (any এরর দূর করার জন্য)
interface AuthUser {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'teacher' | 'student';
    tenant_id: number;
}

interface PageProps {
    auth: {
        user: AuthUser | null;
    };
    [key: string]: unknown; // অন্য যেকোনো ডায়নামিক প্রোপসের জন্য
}

const mainNavItems: NavItem[] = [
    { title: 'Dashboard', url: '/dashboard', icon: LayoutGrid },
    { title: 'Teacher', url: '/teachers', icon: GraduationCap },
    { title: 'Student', url: '/students', icon: Users },
    { title: 'Courses', url: '/courses', icon: BookOpen },
    { title: 'Enrollments', url: '/enrollments', icon: UserPlus },
    { title: 'Attendance', url: '/attendance', icon: ClipboardCheck },
    { title: 'Exams', url: '/exams', icon: FileSignature },
    { title: 'Marks', url: '/marks', icon: CheckSquare },
    { title: 'Report Card', url: '/report-card', icon: Award },
    { title: 'Notices', url: '/notices', icon: Megaphone },
    { title: 'Routine', url: '/routines', icon: CalendarDays },
    { title: 'Payment', url: '/payments', icon: Wallet },
];

const footerNavItems: NavItem[] = [
    { title: 'Repository', url: 'https://github.com/Rez01khn', icon: Github },
    { title: 'Documentation', url: 'https://laravel.com/docs/starter-kits', icon: BookOpen },
];

export function AppSidebar() {
    const { auth } = usePage<PageProps>().props;
    const userRole = auth?.user?.role;
    const filteredNavItems = mainNavItems.filter((item) => {
        if (!userRole) return false;
        if (userRole === 'admin') return true;
        if (userRole === 'teacher') {
            return [
                'Dashboard', 'Courses', 'Attendance', 'Exams', 'Marks', 'Report Card', 'Notices', 'Routine', 'Payment'
            ].includes(item.title);
        }
        if (userRole === 'student') {
            return [
                'Dashboard', 'Report Card', 'Notices', 'Routine', 'Payment'
            ].includes(item.title);
        }
        return false;
    });

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={filteredNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}