import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from '@/types';
import { usePage, router } from "@inertiajs/react";
import { Card } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface Student {
    student_id: number;
    tenant_id: number;
    first_name: string;
    last_name: string;
    grade: number;
    image?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Student',
        href: '/students',
    },
];

const emptyForm = {
    first_name: '',
    last_name: '',
    grade: '',
    image: null as File | null
};

type FormState = typeof emptyForm & { id?: number };

export default function StudentIndex() {
    const { students } = usePage<{ students?: Student[] }>().props;
    const studentList = students ?? [];

    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<FormState>(emptyForm);
    const [isEdit, setIsEdit] = useState(false);
    const [viewStudent, setViewStudent] = useState<Student | null>(null);

    const handleOpenAdd = () => {
        setForm(emptyForm);
        setIsEdit(false);
        setOpen(true);
    };

    const handleOpenEdit = (student: Student) => {
        setForm({
            id: student.student_id,
            first_name: student.first_name,
            last_name: student.last_name,
            grade: String(student.grade),
            image: null
        });
        setIsEdit(true);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setForm(emptyForm);
        setIsEdit(false);
    };

    const handleChange = (e: any) => {
        if (e.target.type === "file") {
            setForm({ ...form, image: e.target.files[0] });
        } else {
            setForm({ ...form, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit && form.id) {
            router.post(`/students/${form.id}`, {
                ...form,
                _method: 'put'
            }, {
                forceFormData: true,
                onSuccess: handleClose,
            });
        } else {
            router.post('/students', form, {
                forceFormData: true,
                onSuccess: handleClose,
            });
        }
    };

    const handleDelete = (id: number) => {
        if (window.confirm("Are you sure?")) {
            router.delete(`/students/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Card className="p-6 mt-6">

                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">Student</h1>
                    <Button onClick={handleOpenAdd}>Add Student</Button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full border text-sm rounded-lg">
                        <thead className="bg-gray-100 dark:bg-neutral-800">
                            <tr>
                                <th className="px-4 py-2 ">ID</th>
                                <th className="px-4 py-2 ">Image</th>
                                <th className="px-4 py-2 ">First Name</th>
                                <th className="px-4 py-2 ">Last Name</th>
                                <th className="px-4 py-2 ">Grade</th>
                                <th className="px-4 py-2 ">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {studentList.map((student) => (
                                <tr key={student.student_id} className="border-b hover:bg-gray-50 dark:hover:bg-neutral-700">
                                    <td className="px-4 py-2 text-center text-center">{student.student_id}</td>

                                    {/* Image */}
                                    <td className="px-4 py-2 text-center">
                                        {student.image ? (
                                            <img
                                                src={`/storage/${student.image}`}
                                                alt="Student"
                                                className="w-10 h-10 rounded-full object-cover mx-auto"
                                            />
                                        ) : (
                                            <span className="text-gray-500">No Image</span>
                                        )}
                                    </td>

                                    <td className="px-4 py-2 text-center">{student.first_name}</td>
                                    <td className="px-4 py-2 text-center">{student.last_name}</td>
                                    <td className="px-4 py-2 text-center">{student.grade}</td>

                                    {/* Actions */}
                                    <td className="px-4 py-2 flex justify-center gap-2">
                                        <Button size="sm" onClick={() => setViewStudent(student)}>
                                            View
                                        </Button>

                                        <Button size="sm" variant="outline" onClick={() => handleOpenEdit(student)}>
                                            Edit
                                        </Button>

                                        <Button size="sm" variant="destructive" onClick={() => handleDelete(student.student_id)}>
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Add/Edit Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {isEdit ? 'Update Student' : 'Add Student'}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div>
                            <Label>First Name</Label>
                            <Input name="first_name" value={form.first_name} onChange={handleChange} required />
                        </div>

                        <div>
                            <Label>Last Name</Label>
                            <Input name="last_name" value={form.last_name} onChange={handleChange} required />
                        </div>

                        <div>
                            <Label>Grade</Label>
                            <Input name="grade" value={form.grade} onChange={handleChange} required />
                        </div>

                        <div>
                            <Label>Image</Label>
                            <Input type="file" name="image" onChange={handleChange} />
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                {isEdit ? 'Update' : 'Add'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* View Dialog */}
            <Dialog open={!!viewStudent} onOpenChange={() => setViewStudent(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Student Details</DialogTitle>
                    </DialogHeader>

                    {viewStudent && (
                        <div className="space-y-2 text-center">
                            {viewStudent.image ? (
                                <img
                                    src={`/storage/${viewStudent.image}`}
                                    alt="Student"
                                    className="w-32 h-32 rounded-full object-cover mx-auto"
                                />
                            ) : (
                                <span className="text-gray-500">No Image</span>
                            )}

                            <p className="text-lg font-semibold">
                                {viewStudent.first_name} {viewStudent.last_name}
                            </p>
                            <p className="text-gray-600">Grade: {viewStudent.grade}</p>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}