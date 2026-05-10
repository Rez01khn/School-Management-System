import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from '@/types';
import { usePage, router, Head } from "@inertiajs/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Label } from "@/components/ui/label";
import { Printer, GraduationCap, User, FileText } from "lucide-react";

interface Student {
    student_id: number;
    first_name: string;
    last_name: string;
    grade: string;
}

interface Exam {
    exam_id: number;
    exam_name: string;
    year: number;
}

interface Mark {
    mark_id: number;
    marks_obtained: number;
    total_marks: number;
    course: {
        course_name: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Report Card', href: '/report-card' },
];

export default function ReportCardIndex() {
    // ১. auth ডাটা এবং রোল রিসিভ করুন
    const { props } = usePage() as any;
    const { students, exams, reportData, selectedStudent, selectedExam, auth } = props;

    const userRole = auth.user?.role;
    const isStudent = userRole === 'student';

    const getGrade = (marks: number) => {
        if (marks >= 80) return { grade: 'A+', color: 'text-green-600' };
        if (marks >= 70) return { grade: 'A', color: 'text-green-500' };
        if (marks >= 60) return { grade: 'A-', color: 'text-blue-500' };
        if (marks >= 50) return { grade: 'B', color: 'text-yellow-600' };
        if (marks >= 40) return { grade: 'C', color: 'text-orange-500' };
        if (marks >= 33) return { grade: 'D', color: 'text-orange-700' };
        return { grade: 'F', color: 'text-red-600' };
    };

    const handleFilterChange = (studentId: any, examId: any) => {
        router.get('/report-card', { student_id: studentId, exam_id: examId }, { preserveState: true });
    };

    const handlePrint = () => {
        window.print();
    };

    const totalObtained = reportData?.reduce((sum: number, m: Mark) => sum + m.marks_obtained, 0) || 0;
    const average = reportData?.length > 0 ? (totalObtained / reportData.length).toFixed(2) : 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Student Report Card" />

            <div className="p-6 max-w-5xl mx-auto">

                <Card className="p-6 mb-8 print:hidden shadow-sm">
                    {/* ২. যদি স্টুডেন্ট হয় তবে গ্রিড ১ কলামের হবে, নাহলে ২ কলামের */}
                    <div className={`grid grid-cols-1 ${!isStudent ? 'md:grid-cols-2' : ''} gap-6`}>

                        {/* ৩. স্টুডেন্ট ড্রপডাউনটি শুধু এডমিন এবং টিচার দেখবে */}
                        {!isStudent && (
                            <div>
                                <Label>Select Student</Label>
                                <select
                                    className="mt-1 w-full border rounded-md p-2 outline-none bg-background"
                                    value={selectedStudent?.student_id || ""}
                                    onChange={(e) => handleFilterChange(e.target.value, selectedExam?.exam_id)}
                                >
                                    <option value="">-- Select Student --</option>
                                    {students.map((s: Student) => (
                                        <option key={s.student_id} value={s.student_id}>
                                            {s.first_name} {s.last_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div>
                            <Label>Select Exam</Label>
                            <select
                                className="mt-1 w-full border rounded-md p-2 outline-none bg-background"
                                value={selectedExam?.exam_id || ""}
                                onChange={(e) => handleFilterChange(selectedStudent?.student_id, e.target.value)}
                            >
                                <option value="">-- Select Exam --</option>
                                {exams.map((e: Exam) => (
                                    <option key={e.exam_id} value={e.exam_id}>
                                        {e.exam_name} ({e.year})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </Card>

                {selectedStudent && selectedExam && reportData.length > 0 ? (
                    <div className="space-y-6">
                        <div className="flex justify-end print:hidden">
                            <Button onClick={handlePrint} className="flex gap-2">
                                <Printer size={18} /> Print Marksheet
                            </Button>
                        </div>

                        <Card className="p-10 border-2 border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-lg marksheet-container">
                            <div className="text-center border-b-2 pb-6 mb-8">
                                <h1 className="text-3xl font-black uppercase tracking-widest text-primary">Academic Transcript</h1>
                                <p className="text-gray-500 mt-1 font-medium">{selectedExam.exam_name} - {selectedExam.year}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-8 mb-10 text-gray-900 dark:text-gray-100">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 text-sm">
                                        <User className="text-gray-400" size={16} />
                                        <span className="text-gray-500">Student Name:</span>
                                        <span className="font-bold uppercase">{selectedStudent.first_name} {selectedStudent.last_name}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <GraduationCap className="text-gray-400" size={16} />
                                        <span className="text-gray-500">Grade/Class:</span>
                                        <span className="font-bold">{selectedStudent.grade}</span>
                                    </div>
                                </div>
                                <div className="space-y-2 text-right">
                                    <div className="text-sm">
                                        <span className="text-gray-500">Student ID:</span>
                                        <span className="ml-2 font-bold">#STU-{selectedStudent.student_id}</span>
                                    </div>
                                    <div className="text-sm">
                                        <span className="text-gray-500">Date of Issue:</span>
                                        <span className="ml-2 font-bold">{new Date().toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            <table className="w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-neutral-900 text-gray-900 dark:text-gray-100">
                                        <th className="border border-gray-300 p-3 text-left">Subject / Course</th>
                                        <th className="border border-gray-300 p-3 text-center">Full Marks</th>
                                        <th className="border border-gray-300 p-3 text-center">Obtained</th>
                                        <th className="border border-gray-300 p-3 text-center">Grade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.map((mark: Mark) => {
                                        const res = getGrade(mark.marks_obtained);
                                        return (
                                            <tr key={mark.mark_id} className="text-sm text-gray-900 dark:text-gray-100">
                                                <td className="border border-gray-300 p-3 font-medium">{mark.course.course_name}</td>
                                                <td className="border border-gray-300 p-3 text-center text-gray-400">100</td>
                                                <td className="border border-gray-300 p-3 text-center font-bold">{mark.marks_obtained}</td>
                                                <td className={`border border-gray-300 p-3 text-center font-black ${res.color}`}>{res.grade}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-gray-50 dark:bg-neutral-900 font-bold text-gray-900 dark:text-gray-100">
                                        <td className="border border-gray-300 p-3 text-right" colSpan={2}>Aggregate Marks:</td>
                                        <td className="border border-gray-300 p-3 text-center text-lg text-primary">{totalObtained}</td>
                                        <td className="border border-gray-300 p-3 text-center">Avg: {average}</td>
                                    </tr>
                                </tfoot>
                            </table>

                            <div className="mt-20 flex justify-between px-10 text-gray-900 dark:text-gray-100">
                                <div className="text-center">
                                    <div className="w-40 border-t border-black dark:border-white mb-1"></div>
                                    <p className="text-xs font-bold uppercase">Class Teacher</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-40 border-t border-black dark:border-white mb-1"></div>
                                    <p className="text-xs font-bold uppercase">Headmaster</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                ) : selectedStudent && selectedExam ? (
                    <Card className="p-20 text-center text-gray-400 font-medium">
                        <FileText className="mx-auto mb-4 text-gray-200" size={48} />
                        No marks found for this student in the selected exam.
                    </Card>
                ) : (
                    <div className="text-center p-20 border-2 border-dashed rounded-xl text-gray-400">
                        {isStudent ? 'Please select an exam to see your results.' : 'Please select a student and an exam to generate the report card.'}
                    </div>
                )}
            </div>

            <style>
                {`
                @media print {
                    body * { visibility: hidden; }
                    .marksheet-container, .marksheet-container * { visibility: visible; }
                    .marksheet-container { 
                        position: absolute; 
                        left: 0; 
                        top: 0; 
                        width: 100%; 
                        border: none !important; 
                        box-shadow: none !important; 
                    }
                }
                `}
            </style>
        </AppLayout>
    );
}