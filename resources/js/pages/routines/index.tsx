import AppLayout from "@/layouts/app-layout";
import { usePage, router, Head } from "@inertiajs/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Clock, MapPin, User, Plus, Trash2, Edit3, Calendar } from "lucide-react";


interface Course {
    course_id: number;
    course_name: string;
}

interface Teacher {
    teacher_id: number;
    first_name: string;
    last_name: string;
}

interface Routine {
    routine_id: number;
    course_id: number;
    teacher_id: number;
    day: string;
    start_time: string;
    end_time: string;
    room_number: string;
    course: Course;
    teacher: Teacher;
}

interface RoutinePageProps {
    auth: {
        user: {
            role: string;
        };
    };
    routines: Routine[];
    courses: Course[];
    teachers: Teacher[];
    [key: string]: unknown;
}

const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function RoutineIndex() {

    const { routines, courses, teachers, auth } = usePage<RoutinePageProps>().props;
    const routineList = routines ?? [];
    const isAdmin = auth.user.role === 'admin';

    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [form, setForm] = useState({
        id: 0, course_id: '', teacher_id: '', day: 'Saturday',
        start_time: '', end_time: '', room_number: ''
    });

    const handleOpenAdd = () => {
        setForm({ id: 0, course_id: '', teacher_id: '', day: 'Saturday', start_time: '', end_time: '', room_number: '' });
        setIsEdit(false);
        setOpen(true);
    };

    const handleEdit = (routine: Routine) => {
        setForm({
            id: routine.routine_id,
            course_id: String(routine.course_id),
            teacher_id: String(routine.teacher_id),
            day: routine.day,
            start_time: routine.start_time,
            end_time: routine.end_time,
            room_number: routine.room_number || ''
        });
        setIsEdit(true);
        setOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            router.put(`/routines/${form.id}`, form, { onSuccess: () => setOpen(false) });
        } else {
            router.post('/routines', form, { onSuccess: () => setOpen(false) });
        }
    };

    const handleDelete = (id: number) => {
        if (window.confirm("Delete this class from routine?")) router.delete(`/routines/${id}`);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Class Routine', href: '/routines' }]}>
            <Head title="Class Routine" />

            <div className="p-6 bg-slate-50/50 dark:bg-neutral-950 min-h-screen">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                            <Calendar className="text-primary" size={32} /> Weekly Class Routine
                        </h1>
                        <p className="text-slate-500 mt-1">Manage and view the academic time-table efficiently.</p>
                    </div>
                    {isAdmin && (
                        <Button onClick={handleOpenAdd} className="shadow-lg hover:scale-105 transition-transform">
                            <Plus size={18} className="mr-2" /> Add New Class
                        </Button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
                    {days.map((day) => {

                        const dayClasses = routineList.filter((r: Routine) => r.day === day)
                            .sort((a: Routine, b: Routine) => a.start_time.localeCompare(b.start_time));

                        return (
                            <div key={day} className="space-y-4">
                                <div className="bg-white dark:bg-neutral-900 p-3 rounded-xl shadow-sm border border-slate-200 dark:border-neutral-800 text-center">
                                    <span className="font-black text-xs uppercase tracking-widest text-primary">{day}</span>
                                </div>

                                <div className="space-y-3">
                                    {dayClasses.length > 0 ? dayClasses.map((item: Routine) => (
                                        <Card key={item.routine_id} className="border-none shadow-sm hover:shadow-md transition-all group overflow-hidden bg-white dark:bg-neutral-900">
                                            <div className="h-1.5 bg-primary/20 group-hover:bg-primary transition-colors"></div>
                                            <CardContent className="p-4 space-y-3">
                                                <div>
                                                    <h3 className="font-bold text-sm leading-tight text-slate-900 dark:text-white line-clamp-1">{item.course.course_name}</h3>
                                                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
                                                        <User size={12} /> {item.teacher.first_name} {item.teacher.last_name}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-1.5 border-t border-slate-100 dark:border-neutral-800 pt-3">
                                                    <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                                                        <Clock size={12} /> {item.start_time.substring(0, 5)} - {item.end_time.substring(0, 5)}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                                                        <MapPin size={12} /> Room: {item.room_number || 'N/A'}
                                                    </div>
                                                </div>

                                                {isAdmin && (
                                                    <div className="flex gap-2 pt-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                                                        <button onClick={() => handleEdit(item)} className="p-1.5 text-slate-400 hover:text-blue-500 transition-colors"><Edit3 size={14} /></button>
                                                        <button onClick={() => handleDelete(item.routine_id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    )) : (
                                        <div className="py-10 border-2 border-dashed rounded-2xl flex items-center justify-center text-[10px] text-slate-300 font-bold uppercase tracking-tighter">
                                            No Classes
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-md rounded-3xl">
                    <DialogHeader><DialogTitle className="text-xl font-black">{isEdit ? 'Update Class' : 'Schedule New Class'}</DialogTitle></DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <Label>Course/Subject</Label>
                                <select className="w-full mt-1 border rounded-xl p-2.5 text-sm bg-slate-50 dark:bg-neutral-800 border-none outline-none ring-1 ring-slate-200 dark:ring-neutral-700 font-bold"
                                    value={form.course_id} onChange={e => setForm({ ...form, course_id: e.target.value })} required>
                                    <option value="">Select Course</option>
                                    {courses.map((c: Course) => <option key={c.course_id} value={c.course_id}>{c.course_name}</option>)}
                                </select>
                            </div>
                            <div className="col-span-2">
                                <Label>Assigned Teacher</Label>
                                <select className="w-full mt-1 border rounded-xl p-2.5 text-sm bg-slate-50 dark:bg-neutral-800 border-none outline-none ring-1 ring-slate-200 dark:ring-neutral-700 font-bold"
                                    value={form.teacher_id} onChange={e => setForm({ ...form, teacher_id: e.target.value })} required>
                                    <option value="">Select Teacher</option>
                                    {teachers.map((t: Teacher) => <option key={t.teacher_id} value={t.teacher_id}>{t.first_name} {t.last_name}</option>)}
                                </select>
                            </div>

                            <div>
                                <Label>Week Day</Label>
                                <select className="w-full mt-1 border rounded-xl p-2.5 text-sm bg-slate-50 dark:bg-neutral-800 border-none outline-none ring-1 ring-slate-200 dark:ring-neutral-700 font-bold"
                                    value={form.day} onChange={e => setForm({ ...form, day: e.target.value })} required>
                                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div>
                                <Label>Room Number</Label>
                                <Input className="rounded-xl mt-1 border-none ring-1 ring-slate-200 dark:ring-neutral-700 font-bold px-3" value={form.room_number} onChange={e => setForm({ ...form, room_number: e.target.value })} placeholder="e.g. 101" />
                            </div>
                            <div>
                                <Label>Start Time</Label>
                                <Input type="time" className="rounded-xl mt-1 border-none ring-1 ring-slate-200 dark:ring-neutral-700 font-bold px-3" value={form.start_time} onChange={e => setForm({ ...form, start_time: e.target.value })} required />
                            </div>
                            <div>
                                <Label>End Time</Label>
                                <Input type="time" className="rounded-xl mt-1 border-none ring-1 ring-slate-200 dark:ring-neutral-700 font-bold px-3" value={form.end_time} onChange={e => setForm({ ...form, end_time: e.target.value })} required />
                            </div>
                        </div>
                        <Button type="submit" className="w-full h-12 rounded-2xl font-bold mt-4 shadow-lg">{isEdit ? 'Save Changes' : 'Create Schedule'}</Button>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}