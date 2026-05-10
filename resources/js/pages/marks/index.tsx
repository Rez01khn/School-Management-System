import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from '@/types';
import { usePage, router, Head } from "@inertiajs/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState, useEffect } from "react";
import { Edit2, Trash2 } from "lucide-react";

// ১. প্রয়োজনীয় ইন্টারফেসগুলো ডিফাইন করা হলো
interface Student {
    student_id: number;
    first_name: string;
    last_name: string;
    marks_obtained?: string | number;
}

interface Exam {
    exam_id: number;
    exam_name: string;
}

interface Course {
    course_id: number;
    course_name: string;
}

interface MarkRecord {
    mark_id: number;
    marks_obtained: string | number;
    student?: Student;
    exam?: Exam;
    course?: Course;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Marks Entry', href: '/marks' },
];

export default function MarkIndex() {
    // ২. usePage এ any এর বদলে ইন্টারফেসগুলো ব্যবহার করা হয়েছে
    const { exams, courses, students, allMarks, selectedExamId, selectedCourseId } = usePage<{
        exams: Exam[];
        courses: Course[];
        students: Student[];
        allMarks: MarkRecord[];
        selectedExamId: number;
        selectedCourseId: number;
    }>().props;

    const [marks, setMarks] = useState<Record<number, string | number>>({});
    const [editOpen, setEditOpen] = useState(false);

    // ৩. selectedMark এর টাইপ MarkRecord | null করা হয়েছে
    const [selectedMark, setSelectedMark] = useState<MarkRecord | null>(null);
    const [newMarkValue, setNewMarkValue] = useState<string | number>("");

    useEffect(() => {
        if (students?.length > 0) {
            // ৪. initialMarks এর টাইপ নির্দিষ্ট করা হয়েছে
            const initialMarks: Record<number, string | number> = {};
            students.forEach(s => {
                initialMarks[s.student_id] = s.marks_obtained || '';
            });
            setMarks(initialMarks);
        }
    }, [students]);

    // ৫. ফাংশন প্যারামিটারে any সরিয়ে টাইপ দেওয়া হয়েছে
    const handleFilterChange = (examId: string | number, courseId: string | number) => {
        router.get('/marks', { exam_id: examId, course_id: courseId }, { preserveState: true });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/marks', { exam_id: selectedExamId, course_id: selectedCourseId, marks }, {
            onSuccess: () => alert("Marks saved successfully!")
        });
    };

    const handleDelete = (id: number) => {
        if (window.confirm("Are you sure you want to delete this result?")) {
            router.delete(`/marks/${id}`);
        }
    };

    // ৬. ফাংশন প্যারামিটারে MarkRecord টাইপ দেওয়া হয়েছে
    const handleEditOpen = (mark: MarkRecord) => {
        setSelectedMark(mark);
        setNewMarkValue(mark.marks_obtained);
        setEditOpen(true);
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMark) return;
        router.put(`/marks/${selectedMark.mark_id}`, { marks_obtained: newMarkValue }, {
            onSuccess: () => setEditOpen(false)
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Marks Entry" />
            <div className="p-6">
                <h1 className="text-3xl font-bold mb-6">Marks Management</h1>
                <Card className="p-6 mb-8 border-none shadow-sm bg-gray-50/50 dark:bg-neutral-900/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label>Select Exam</Label>
                            <select
                                className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
                                value={selectedExamId || ""}
                                onChange={e => handleFilterChange(e.target.value, selectedCourseId)}
                            >
                                <option value="">-- Choose Exam --</option>
                                {/* ৭. ম্যাপে (exam) এর টাইপ অটোমেটিক ডিটেক্ট হবে */}
                                {exams.map((exam) => (
                                    <option key={exam.exam_id} value={exam.exam_id}>{exam.exam_name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <Label>Select Course</Label>
                            <select
                                className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
                                value={selectedCourseId || ""}
                                onChange={e => handleFilterChange(selectedExamId, e.target.value)}
                            >
                                <option value="">-- Choose Course --</option>
                                {courses.map((course) => (
                                    <option key={course.course_id} value={course.course_id}>{course.course_name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </Card>

                {selectedExamId > 0 && selectedCourseId > 0 && (
                    <form onSubmit={handleSubmit} className="mb-12">
                        <Card className="overflow-hidden">
                            <CardContent className="p-0">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-100 dark:bg-neutral-800 border-b">
                                        <tr>
                                            <th className="px-6 py-4 text-sm font-semibold">Student Name</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-right">Marks (out of 100)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {students.map(student => (
                                            <tr key={student.student_id} className="hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors">
                                                <td className="px-6 py-4">{student.first_name} {student.last_name}</td>
                                                <td className="px-6 py-4 flex justify-end">
                                                    <Input
                                                        type="number" className="w-32 text-right"
                                                        value={marks[student.student_id] || ""}
                                                        onChange={e => setMarks({ ...marks, [student.student_id]: e.target.value })}
                                                        placeholder="0"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </CardContent>
                        </Card>
                        <div className="mt-4 flex items-center gap-3">
                            <Button type="submit" className="px-10 h-11">
                                Save Marks
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="h-11 px-10"
                                onClick={() => router.get('/marks')}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                )}

                <div className="mt-10">
                    <h2 className="text-xl font-bold mb-4"> Results History</h2>
                    <Card className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse text-sm">
                                <thead className="bg-gray-100 dark:bg-neutral-800">
                                    <tr>
                                        <th className="px-6 py-3 text-left font-semibold">Student</th>
                                        <th className="px-6 py-3 text-left font-semibold">Exam & Course</th>
                                        <th className="px-6 py-3 text-center font-semibold">Marks</th>
                                        <th className="px-6 py-3 text-center font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {allMarks.map((m) => (
                                        <tr key={m.mark_id} className="hover:bg-gray-50 dark:hover:bg-neutral-900 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                                    {m.student?.first_name} {m.student?.last_name}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-xs text-gray-500">{m.exam?.exam_name}</div>
                                                <div className="font-medium">{m.course?.course_name}</div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full font-bold">
                                                    {m.marks_obtained} / 100
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center gap-2">
                                                    <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={() => handleEditOpen(m)}>
                                                        <Edit2 size={14} />
                                                    </Button>
                                                    <Button size="sm" variant="destructive" className="h-8 w-8 p-0" onClick={() => handleDelete(m.mark_id)}>
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {allMarks.length === 0 && (
                                        <tr><td colSpan={4} className="p-10 text-center text-gray-500">No marks recorded yet.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>

            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Update Mark</DialogTitle></DialogHeader>
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Student: {selectedMark?.student?.first_name} {selectedMark?.student?.last_name}</Label>
                            <div className="text-xs text-gray-500">Course: {selectedMark?.course?.course_name}</div>
                            <Input
                                type="number"
                                value={newMarkValue}
                                onChange={(e) => setNewMarkValue(e.target.value)}
                                placeholder="Enter marks"
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
                            <Button type="submit">Update Now</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}