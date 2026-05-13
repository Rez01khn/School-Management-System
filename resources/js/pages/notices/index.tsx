import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from '@/types';
import { usePage, router, Head } from "@inertiajs/react";
import { Card } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Bell, Megaphone, Trash2, Edit3, Clock } from "lucide-react";

interface Notice {
    notice_id: number;
    title: string;
    message: string;
    target_audience: 'everyone' | 'teacher' | 'student';
    expiry_date: string | null;
    created_at: string;
}

interface NoticePageProps {
    auth: {
        user: {
            role: string;
        };
    };
    notices: Notice[];
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Notice Board', href: '/notices' },
];

export default function NoticeIndex() {
    const { notices, auth } = usePage<NoticePageProps>().props;
    const noticeList = notices ?? [];
    const isAdmin = auth.user?.role === 'admin';

    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [form, setForm] = useState({
        id: 0, title: '', message: '', target_audience: 'everyone' as Notice['target_audience'], expiry_date: ''
    });

    const handleOpenAdd = () => {
        setForm({ id: 0, title: '', message: '', target_audience: 'everyone', expiry_date: '' });
        setIsEdit(false);
        setOpen(true);
    };

    const handleEdit = (notice: Notice) => {
        setForm({
            id: notice.notice_id,
            title: notice.title,
            message: notice.message,
            target_audience: notice.target_audience,
            expiry_date: notice.expiry_date || ''
        });
        setIsEdit(true);
        setOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            router.put(`/notices/${form.id}`, form, { onSuccess: () => setOpen(false) });
        } else {
            router.post('/notices', form, { onSuccess: () => setOpen(false) });
        }
    };

    const handleDelete = (id: number) => {
        if (window.confirm("Are you sure you want to delete this notice?")) {
            router.delete(`/notices/${id}`);
        }
    };

    const getAudienceBadge = (audience: Notice['target_audience']) => {
        const styles: Record<Notice['target_audience'], string> = {
            everyone: "bg-blue-100 text-blue-700 dark:bg-blue-900/30",
            teacher: "bg-purple-100 text-purple-700 dark:bg-purple-900/30",
            student: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30"
        };
        return (
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[audience]}`}>
                {audience}
            </span>
        );
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notice Board" />

            <div className="p-6 lg:p-10 bg-[#F8FAFC] dark:bg-neutral-950 min-h-screen">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-primary rounded-2xl shadow-xl shadow-primary/20">
                            <Megaphone className="text-white" size={30} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase">Notice Board</h1>
                            <p className="text-slate-500 font-medium text-sm">Stay updated with latest school announcements</p>
                        </div>
                    </div>
                    {isAdmin && (
                        <Button onClick={handleOpenAdd} className="h-12 px-8 rounded-2xl font-bold shadow-lg hover:scale-105 transition-all">
                            <Bell className="mr-2 h-5 w-5" /> Create Notice
                        </Button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {noticeList.length > 0 ? noticeList.map((notice: Notice) => (
                        <Card key={notice.notice_id} className="border-none shadow-sm hover:shadow-2xl transition-all duration-500 group bg-white dark:bg-neutral-900 rounded-[2.5rem] overflow-hidden flex flex-col">
                            <div className="p-8 space-y-6 flex-1">
                                <div className="flex justify-between items-center">
                                    {getAudienceBadge(notice.target_audience)}
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                                        <Clock size={14} />
                                        {new Date(notice.created_at).toLocaleDateString('en-GB')}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight mb-3">
                                        {notice.title}
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-5">
                                        {notice.message}
                                    </p>
                                </div>
                            </div>

                            <div className="px-8 py-5 bg-slate-50 dark:bg-neutral-800/50 flex justify-between items-center border-t border-slate-100 dark:border-neutral-800">
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                    Official Announcement
                                </span>
                                {isAdmin && (
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(notice)} className="p-2.5 bg-white dark:bg-neutral-900 text-slate-400 hover:text-blue-500 rounded-xl shadow-sm transition-all border border-slate-200 dark:border-neutral-700">
                                            <Edit3 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(notice.notice_id)} className="p-2.5 bg-white dark:bg-neutral-900 text-slate-400 hover:text-red-500 rounded-xl shadow-sm transition-all border border-slate-200 dark:border-neutral-700">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </Card>
                    )) : (
                        <div className="col-span-full py-32 text-center">
                            <div className="inline-block p-8 bg-white dark:bg-neutral-900 rounded-[3rem] shadow-sm mb-4">
                                <Bell className="text-slate-200 h-16 w-16" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-300 uppercase">No active notices</h2>
                        </div>
                    )}
                </div>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-xl rounded-[3rem] p-0 overflow-hidden border-none">
                    <div className="bg-primary p-8 text-white">
                        <DialogHeader>
                            <DialogTitle className="text-3xl font-black uppercase tracking-tight">
                                {isEdit ? 'Update Notice' : 'Post New Notice'}
                            </DialogTitle>
                        </DialogHeader>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div className="space-y-2">
                            <Label className="font-black text-xs uppercase tracking-widest text-slate-400 ml-1">Title</Label>
                            <Input
                                className="h-14 rounded-2xl border-none bg-slate-100 dark:bg-neutral-800 text-lg font-bold"
                                value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                                placeholder="Enter notice title..."
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="font-black text-xs uppercase tracking-widest text-slate-400 ml-1">Audience</Label>
                                <select
                                    className="w-full h-14 px-4 rounded-2xl bg-slate-100 dark:bg-neutral-800 border-none outline-none text-sm font-bold"
                                    value={form.target_audience}
                                    onChange={e => setForm({ ...form, target_audience: e.target.value as Notice['target_audience'] })}
                                >
                                    <option value="everyone">Everyone</option>
                                    <option value="teacher">Teachers</option>
                                    <option value="student">Students</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label className="font-black text-xs uppercase tracking-widest text-slate-400 ml-1">Expiry Date</Label>
                                <Input
                                    type="date"
                                    className="h-14 rounded-2xl border-none bg-slate-100 dark:bg-neutral-800 font-bold"
                                    value={form.expiry_date}
                                    onChange={e => setForm({ ...form, expiry_date: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="font-black text-xs uppercase tracking-widest text-slate-400 ml-1">Description</Label>
                            <textarea
                                className="w-full min-h-[160px] rounded-3xl border-none bg-slate-100 dark:bg-neutral-800 p-5 text-sm leading-relaxed focus:ring-2 ring-primary outline-none"
                                value={form.message}
                                onChange={e => setForm({ ...form, message: e.target.value })}
                                placeholder="Write announcement details..."
                                required
                            />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="h-14 flex-1 rounded-2xl font-bold uppercase tracking-widest">Cancel</Button>
                            <Button type="submit" className="h-14 flex-[2] rounded-2xl font-black text-lg uppercase tracking-widest shadow-xl shadow-primary/20">
                                {isEdit ? 'Update Now' : 'Publish Notice'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}