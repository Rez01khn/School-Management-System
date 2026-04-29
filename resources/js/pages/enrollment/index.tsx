import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { usePage, router } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import React, { useState } from 'react';

interface Enrollment {
    enrollment_id: number;
    tenant_id: number;
    student_id: number;
    course_id: number;
    enrollment_date: string;
}

interface Student {
    student_id: number;
    first_name: string;
    last_name: string;
}
interface Course {
    course_id: number;
    course_name: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Enrollments',
        href: '/enrollments',
    },
];

const emptyForm = { student_id: '', course_id: '', enrollment_date: '' };
type FormState = typeof emptyForm & { id?: number };

export default function EnrollmentIndex() {
    const { enrollments, students, courses } = usePage<{
        enrollments?: Enrollment[];
        students?: Student[];
        courses?: Course[];
    }>().props;

    const enrollmentList = enrollments ?? [];
    const studentList = students ?? [];
    const courseList = courses ?? [];

    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<FormState>(emptyForm);
    const [isEdit, setIsEdit] = useState(false);

    const handleOpenAdd = () => {
        setForm(emptyForm);
        setIsEdit(false);
        setOpen(true);
    };

    const handleOpenEdit = (enrollment: Enrollment) => {
        setForm({
            id: enrollment.enrollment_id,
            student_id: String(enrollment.student_id),
            course_id: String(enrollment.course_id),
            enrollment_date: enrollment.enrollment_date,
        });
        setIsEdit(true);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setForm(emptyForm);
        setIsEdit(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            ...form,
            student_id: Number(form.student_id),
            course_id: Number(form.course_id),
        };

        if (isEdit && form.id) {
            router.put(`/enrollments/${form.id}`, payload, {
                onSuccess: handleClose,
            });
        } else {
            router.post(`/enrollments/`, payload, {
                onSuccess: handleClose,
            });
        }
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this enrollment?')) {
            router.delete(`/enrollments/${id}`);
        }
    };

    const getStudentName = (student_id: number) => {
        const student = studentList.find(s => s.student_id === student_id);
        return student ? `${student.first_name} ${student.last_name}` : student_id;
    };

    const getCourseName = (course_id: number) => {
        const course = courseList.find(c => c.course_id === course_id);
        return course ? course.course_name : course_id;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Card className="p-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">Enrollments</h1>
                    <Button onClick={handleOpenAdd}>Add Enrollments</Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full border text-sm rounded-lg">
                        <thead className="bg-gray-100 dark:bg-neutral-800">
                            <tr>
                                <th className="px-4 py-2 text-left font-semibold">ID</th>
                                <th className="px-4 py-2 text-left font-semibold">Student</th>
                                <th className="px-4 py-2 text-left font-semibold">Course</th>
                                <th className="px-4 py-2 text-left font-semibold">Enrollment Date</th>
                                <th className="px-4 py-2 text-left font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {enrollmentList.map((enrollment) => (
                                <tr
                                    key={enrollment.enrollment_id}
                                    className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-neutral-700"
                                >
                                    <td className="px-4 py-2">{enrollment.enrollment_id}</td>
                                    <td className="px-4 py-2">{getStudentName(enrollment.student_id)}</td>
                                    <td className="px-4 py-2">{getCourseName(enrollment.course_id)}</td>
                                    <td className="px-4 py-2">{enrollment.enrollment_date}</td>
                                    <td className="px-4 py-2 flex gap-2">
                                        <Button size="sm" variant="outline" onClick={() => handleOpenEdit(enrollment)}>
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDelete(enrollment.enrollment_id)}
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
                    <DialogHeader>
                        <DialogTitle>{isEdit ? 'Update Enrollment' : 'Add Enrollment'}</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="student_id">Student</Label>
                            <select
                                id="student_id"
                                name="student_id"
                                value={form.student_id}
                                onChange={handleChange}
                                required
                                className="border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none md:text-sm"
                            >
                                <option value="" disabled>
                                    Select a Student
                                </option>
                                {studentList.map((student) => (
                                    <option key={student.student_id} value={student.student_id}>
                                        {student.first_name} {student.last_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <Label htmlFor="course_id">Course</Label>
                            <select
                                id="course_id"
                                name="course_id"
                                value={form.course_id}
                                onChange={handleChange}
                                required
                                className="border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none md:text-sm"
                            >
                                <option value="" disabled>
                                    Select a Course
                                </option>
                                {courseList.map((course) => (
                                    <option key={course.course_id} value={course.course_id}>
                                        {course.course_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <Label htmlFor="enrollment_date">Enrollment Date</Label>
                            <input
                                id="enrollment_date"
                                name="enrollment_date"
                                type="date"
                                value={form.enrollment_date}
                                onChange={handleChange}
                                required
                                className="border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none md:text-sm"
                            />
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button type="submit">{isEdit ? 'Update' : 'Add'}</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}