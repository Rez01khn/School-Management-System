import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from '@/types';
import { usePage, router, Head } from "@inertiajs/react";
import { Card } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface Exam {
    exam_id: number;
    exam_name: string;
    year: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Exams', href: '/exams' },
];

export default function ExamIndex() {
    const { exams } = usePage<{ exams?: Exam[] }>().props;
    const examList = exams ?? [];
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [form, setForm] = useState({ id: 0, exam_name: '', year: new Date().getFullYear() });

    const handleOpenAdd = () => {
        setForm({ id: 0, exam_name: '', year: new Date().getFullYear() });
        setIsEdit(false);
        setOpen(true);
    };

    const handleOpenEdit = (exam: Exam) => {
        setForm({ id: exam.exam_id, exam_name: exam.exam_name, year: exam.year });
        setIsEdit(true);
        setOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            router.put(`/exams/${form.id}`, form, { onSuccess: () => setOpen(false) });
        } else {
            router.post('/exams', form, { onSuccess: () => setOpen(false) });
        }
    };

    const handleDelete = (id: number) => {
        if (window.confirm("Are you sure?")) router.delete(`/exams/${id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Exams" />
            <Card className="p-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">Exam Management</h1>
                    <Button onClick={handleOpenAdd}>Add New Exam</Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full border text-sm rounded-lg">
                        <thead className="bg-gray-100 dark:bg-neutral-800">
                            <tr>
                                <th className="px-4 py-2 text-left font-semibold">ID</th>
                                <th className="px-4 py-2 text-left font-semibold">Exam Name</th>
                                <th className="px-4 py-2 text-left font-semibold">Year</th>
                                <th className="px-4 py-2 text-left font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {examList.map((exam) => (
                                <tr
                                    key={exam.exam_id}
                                    className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-neutral-700"
                                >
                                    <td className="px-4 py-2">{exam.exam_id}</td>
                                    <td className="px-4 py-2 font-medium">{exam.exam_name}</td>
                                    <td className="px-4 py-2">{exam.year}</td>
                                    <td className="px-4 py-2 flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleOpenEdit(exam)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDelete(exam.exam_id)}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{isEdit ? 'Update' : 'Add'} Exam</DialogTitle></DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label>Exam Name</Label>
                            <Input value={form.exam_name} onChange={e => setForm({ ...form, exam_name: e.target.value })} required />
                        </div>
                        <div>
                            <Label>Year</Label>
                            <Input type="number" value={form.year} onChange={e => setForm({ ...form, year: parseInt(e.target.value) })} required />
                        </div>
                        <Button type="submit" className="w-full">{isEdit ? 'Update' : 'Create'}</Button>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}