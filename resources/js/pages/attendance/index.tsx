import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from '@/types';
import { usePage, router, Head } from "@inertiajs/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock } from "lucide-react";

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
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Attendance', href: '/attendance' },
];

export default function AttendanceIndex() {

    const { courses, students, selectedCourseId, selectedDate } = usePage<{ 
        courses?: Course[]; 
        students?: Student[]; 
        selectedCourseId?: number;
        selectedDate?: string; 
    }>().props;

    const studentList = students ?? [];
    const courseList = courses ?? [];

    const [date, setDate] = useState(selectedDate || new Date().toISOString().split('T')[0]);
    const [attendanceData, setAttendanceData] = useState<Record<number, string>>({});

    useEffect(() => {
        if (studentList.length > 0) {
            const initialData: Record<number, string> = {};
            studentList.forEach(s => {
                initialData[s.student_id] = 'present';
            });
            setAttendanceData(initialData);
        }
    }, [students]);


    const fetchAttendanceData = (courseId: any, targetDate: string) => {
        router.get('/attendance', 
            { course_id: courseId, attendance_date: targetDate }, 
            { preserveState: true }
        );
    };

    const handleCourseChange = (courseId: string) => {
        fetchAttendanceData(courseId, date);
    };

    const handleDateChange = (newDate: string) => {
        setDate(newDate);
        if (selectedCourseId) {
            fetchAttendanceData(selectedCourseId, newDate);
        }
    };

    const handleStatusChange = (studentId: number, status: string) => {
        setAttendanceData(prev => ({ ...prev, [studentId]: status }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCourseId) return alert("Please select a course first");

        router.post('/attendance', {
            course_id: selectedCourseId,
            attendance_date: date,
            attendances: attendanceData
        }, {
            onSuccess: () => {
                alert("Attendance saved successfully!");
                router.get('/attendance');
            }
        });
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Attendance" />
            
            <div className="p-6">
                <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Attendance Management</h1>

                <Card className="p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="course_id" className="text-sm font-medium">Select Course</Label>
                            <select
                                id="course_id"
                                className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background outline-none"
                                value={selectedCourseId || ""}
                                onChange={(e) => handleCourseChange(e.target.value)}
                            >
                                <option value="" disabled>-- Choose a Course --</option>
                                {courseList.map(course => (
                                    <option key={course.course_id} value={course.course_id}>
                                        {course.course_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="date" className="text-sm font-medium">Attendance Date</Label>
                            <input
                                id="date"
                                type="date"
                                className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background outline-none"
                                value={date}
                                onChange={(e) => handleDateChange(e.target.value)}
                            />
                        </div>
                    </div>
                </Card>

                {selectedCourseId && studentList.length > 0 ? (
                    <form onSubmit={handleSubmit}>
                        <Card className="overflow-hidden">
                            <CardContent className="p-0">
                                <table className="w-full border-collapse">
                                    <thead className="bg-gray-50 dark:bg-neutral-800 border-b">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">Student Name</th>
                                            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-neutral-700 bg-white dark:bg-neutral-900">
                                        {studentList.map((student) => (
                                            <tr key={student.student_id} className="hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors">
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {student.first_name} {student.last_name}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-center gap-4">
                                                        <label className={`flex items-center gap-2 px-4 py-1.5 rounded-full cursor-pointer border text-xs font-medium transition-all ${attendanceData[student.student_id] === 'present' ? 'bg-green-100 border-green-500 text-green-700 shadow-sm' : 'bg-gray-50 dark:bg-neutral-800 dark:border-neutral-600'}`}>
                                                            <input type="radio" className="hidden" name={`status-${student.student_id}`} checked={attendanceData[student.student_id] === 'present'} onChange={() => handleStatusChange(student.student_id, 'present')} />
                                                            <CheckCircle size={14} /> Present
                                                        </label>
                                                        <label className={`flex items-center gap-2 px-4 py-1.5 rounded-full cursor-pointer border text-xs font-medium transition-all ${attendanceData[student.student_id] === 'absent' ? 'bg-red-100 border-red-500 text-red-700 shadow-sm' : 'bg-gray-50 dark:bg-neutral-800 dark:border-neutral-600'}`}>
                                                            <input type="radio" className="hidden" name={`status-${student.student_id}`} checked={attendanceData[student.student_id] === 'absent'} onChange={() => handleStatusChange(student.student_id, 'absent')} />
                                                            <XCircle size={14} /> Absent
                                                        </label>
                                                        <label className={`flex items-center gap-2 px-4 py-1.5 rounded-full cursor-pointer border text-xs font-medium transition-all ${attendanceData[student.student_id] === 'late' ? 'bg-yellow-100 border-yellow-500 text-yellow-700 shadow-sm' : 'bg-gray-50 dark:bg-neutral-800 dark:border-neutral-600'}`}>
                                                            <input type="radio" className="hidden" name={`status-${student.student_id}`} checked={attendanceData[student.student_id] === 'late'} onChange={() => handleStatusChange(student.student_id, 'late')} />
                                                            <Clock size={14} /> Late
                                                        </label>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </CardContent>
                        </Card>
                        <div className="mt-8 flex justify-end">
                            <Button type="submit" size="lg" className="w-full md:w-auto px-10 h-12 text-md font-semibold">
                                Save Attendance
                            </Button>
                        </div>
                    </form>
                ) : selectedCourseId ? (
                    <Card className="p-20 text-center text-gray-400 font-medium">
                        No students enrolled in this course for the selected date.
                    </Card>
                ) : (
                    <Card className="p-20 text-center text-gray-400 font-medium">
                        Please select a course to load the student list.
                    </Card>
                )}
            </div>
        </AppLayout>
    );
} 