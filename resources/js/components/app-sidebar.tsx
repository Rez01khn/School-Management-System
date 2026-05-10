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
    FileBadge, 
    Github, 
    LifeBuoy 
} from 'lucide-react'; 
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Teacher',
        url: '/teachers',
        icon: GraduationCap,
    },
    {
        title: 'Student',
        url: '/students',
        icon: Users,
    },
    {
        title: 'Courses',
        url: '/courses',
        icon: BookOpen, 
    },
    {
        title: 'Enrollments',
        url: '/enrollments',
        icon: UserPlus, 
    },
    {
        title: 'Attendance',
        url: '/attendance',
        icon: ClipboardCheck,
    },
    {
        title: 'Exams',
        url: '/exams',
        icon: FileSignature,
    },
    {
        title: 'Marks',
        url: '/marks',
        icon: CheckSquare,
    },
    {
        title: 'Report Card',
        url: '/report-card',
        icon: FileBadge,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        url: 'https://github.com/Rez01khn',
        icon: Github,
    },
    {
        title: 'Documentation',
        url: 'https://laravel.com/docs/starter-kits',
        icon: LifeBuoy,
    },
];

export function AppSidebar() {
    // সরাসরি auth অবজেক্টটি props থেকে নিন
    const { auth } = usePage().props as any;
    
    // ডিবাগ করার জন্য এটি কনসোলে দেখুন
    console.log("Auth Data:", auth);

    const userRole = auth?.user?.role;

    const filteredNavItems = mainNavItems.filter((item) => {
        // যদি ইউজার লগইন না থাকে, তবে কিছুই দেখাবে না
        if (!userRole) return false;

        // এডমিন হলে সব দেখাবে
        if (userRole === 'admin') return true;

        // টিচার যা যা দেখবে
        if (userRole === 'teacher') {
            return [
                'Dashboard', 'Courses', 'Attendance', 'Exams', 'Marks', 'Report Card'
            ].includes(item.title);
        }

        // স্টুডেন্ট যা যা দেখবে
        if (userRole === 'student') {
            return ['Dashboard', 'Report Card'].includes(item.title);
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
    );}