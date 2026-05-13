import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { 
    Users, GraduationCap, Calendar, BookOpen, 
    FileCheck, ClipboardList, UserPlus, Star, 
    Bell, ArrowUpRight, Search, LayoutDashboard
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const statsConfig = [
    { label: 'Students', key: 'totalStudents', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Teachers', key: 'totalTeachers', icon: GraduationCap, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Courses', key: 'totalCourses', icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Exams', key: 'totalExams', icon: ClipboardList, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Enrollments', key: 'totalEnrollments', icon: UserPlus, color: 'text-pink-600', bg: 'bg-pink-100' },
    { label: 'Results', key: 'totalResults', icon: FileCheck, color: 'text-indigo-600', bg: 'bg-indigo-100' },
];

interface AttendanceItem {
    date: string;
    Present: number;
    Total?: number;
}

interface GradeItem {
    name: string;
    value: number;
}

interface DashboardProps {
    schoolName: string | null;
    attendanceChart: AttendanceItem[];
    gradeChart: GradeItem[];
    totalStudents: number;
    totalTeachers: number;
    totalCourses: number;
    totalEnrollments: number;
    totalExams: number;
    totalResults: number;
    auth: {
        user: {
            name: string;
            role: string;
        };
    };
    [key: string]: unknown;
}
export default function Dashboard() {
    const { schoolName, attendanceChart, ...data } = usePage<DashboardProps>().props;
    return (
        <AppLayout breadcrumbs={[{ title: 'Overview', href: '/dashboard' }]}>
            <Head title="Admin Dashboard" />
            <div className="min-h-screen bg-[#F8FAFC] dark:bg-neutral-950 p-6 lg:p-10 space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-8 border-slate-200 dark:border-neutral-800">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="bg-primary p-1.5 rounded-lg">
                                <LayoutDashboard className="text-white h-5 w-5" />
                            </div>
                            <span className="text-sm font-bold text-primary uppercase tracking-widest">Control Panel</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white">
                            {schoolName || 'School Management System'}
                        </h1>
                        <p className="text-slate-500 font-medium">Hello Admin, here is what's happening today.</p>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                            <input type="text" placeholder="Global Search..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border-none bg-white dark:bg-neutral-900 shadow-sm ring-1 ring-slate-200 dark:ring-neutral-800 focus:ring-2 ring-primary outline-none" />
                        </div>
                        <button className="p-2.5 bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-slate-200 dark:border-neutral-800 hover:bg-slate-50 transition-all relative">
                            <Bell className="h-5 w-5 text-slate-600" />
                            <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                    {statsConfig.map((stat) => (
                        <Card key={stat.label} className="border-none shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden bg-white dark:bg-neutral-900">
                            <CardContent className="p-6">
                                <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{stat.label}</p>
                                    <div className="flex items-baseline gap-2">
                                            <h3 className="text-3xl font-black text-slate-900 dark:text-white">{Number(data[stat.key]) || 0}</h3>
                                        <span className="text-[10px] text-emerald-500 font-bold flex items-center"><ArrowUpRight size={12}/> 12%</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-8">
                        <Card className="border-none shadow-xl bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden">
                            <div className="p-8 border-b border-slate-50 dark:border-neutral-800 flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white">Attendance Analytics</h3>
                                    <p className="text-sm text-slate-400">Student presence flow over the last 7 days</p>
                                </div>
                                <select className="bg-slate-50 dark:bg-neutral-800 border-none rounded-lg px-4 py-2 text-xs font-bold outline-none">
                                    <option>This Week</option>
                                    <option>Last Month</option>
                                </select>
                            </div>
                            <div className="p-6 h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={attendanceChart}>
                                        <defs>
                                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} dy={15} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} dx={-10} />
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                                        />
                                        <Area type="monotone" dataKey="Present" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#chartGradient)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card className="border-none shadow-lg p-6 bg-white dark:bg-neutral-900 rounded-3xl">
                                <h4 className="font-black text-lg mb-4 flex items-center gap-2"><Calendar className="text-primary" /> Upcoming Events</h4>
                                <div className="space-y-4">
                                    {[1, 2].map((i) => (
                                        <div key={i} className="flex gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-neutral-800 border-l-4 border-primary">
                                            <div className="text-center min-w-[45px]">
                                                <p className="text-xs font-bold uppercase text-primary">May</p>
                                                <p className="text-xl font-black">2{i}</p>
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm">Annual Prize Giving Day</p>
                                                <p className="text-xs text-slate-500">10:00 AM - School Auditorium</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>                  
                            <Card className="border-none shadow-lg p-6 bg-white dark:bg-neutral-900 rounded-3xl">
                                <h4 className="font-black text-lg mb-4 flex items-center gap-2"><Star className="text-yellow-500" /> Top Grading</h4>
                                <div className="space-y-4">
                                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex justify-between items-center">
                                        <span className="font-bold">Average GPA</span>
                                        <span className="text-2xl font-black text-indigo-600">4.85</span>
                                    </div>
                                    <p className="text-xs text-slate-400 px-2 text-center italic">"Great improvement since last month!"</p>
                                </div>
                            </Card>
                        </div>
                    </div>
                    <div className="lg:col-span-4 space-y-8">
                        <Card className="border-none shadow-xl bg-primary text-white rounded-3xl overflow-hidden p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="font-black text-xl">Calendar</h4>
                                <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full uppercase">May 2026</span>
                            </div>
                            <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-black opacity-60 mb-4">
                                <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                            </div>
                            <div className="grid grid-cols-7 gap-2 text-center font-bold text-sm">
                                {Array.from({length: 31}).map((_, i) => (
                                    <div key={i} className={`p-2 rounded-lg transition-all ${i+1 === 12 ? 'bg-white text-primary shadow-lg scale-110' : 'hover:bg-white/10 cursor-pointer'}`}>
                                        {i+1}
                                    </div>
                                ))}
                            </div>
                        </Card>
                        <Card className="border-none shadow-lg bg-white dark:bg-neutral-900 rounded-3xl p-6">
                            <h4 className="font-black text-lg mb-6">Live Activity</h4>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                                        <FileCheck className="h-5 w-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">New Exam Created</p>
                                        <p className="text-xs text-slate-400">by Rezwan Khan • 2 mins ago</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                                        <Users className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">Student Enrolled</p>
                                        <p className="text-xs text-slate-400">Masud joined Grade 10 • 1 hour ago</p>
                                    </div>
                                </div>
                            </div>
                            <button className="w-full mt-8 py-3 rounded-2xl bg-slate-50 dark:bg-neutral-800 text-xs font-black text-slate-500 uppercase tracking-widest hover:bg-slate-100 transition-colors">View All Activity</button>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}