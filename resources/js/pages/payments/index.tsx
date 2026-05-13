import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from '@/types';
import { usePage, router, Head } from "@inertiajs/react";
import { Card } from "@/components/ui/card"; // CardContent সরিয়ে ফেলা হয়েছে কারণ এটি ব্যবহৃত হয়নি
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Receipt, Trash2, CalendarClock, User, Wallet, Printer, PlusCircle } from "lucide-react"; // unused Banknote সরানো হয়েছে

// ১. ডাটা টাইপগুলো সুনির্দিষ্ট করা
interface Student {
    student_id: number;
    first_name: string;
    last_name: string;
}

interface Payment {
    payment_id: number;
    title: string;
    amount: number;
    paid_amount: number;
    due_date: string;
    status: 'paid' | 'unpaid' | 'partial';
    student: Student;
}

interface PaymentPageProps {
    [key: string]: unknown;
    auth: {
        user: {
            role: string;
        };
    };
    payments: Payment[];
    students: Student[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Fees & Payments', href: '/payments' },
];

export default function PaymentIndex() {
    // ২. 'any' সরিয়ে PaymentPageProps ব্যবহার করা
    const { payments, students, auth } = usePage<PaymentPageProps>().props;
    const paymentList = payments ?? [];
    const studentList = students ?? [];
    const isAdmin = auth.user?.role === 'admin';

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isPayOpen, setIsPayOpen] = useState(false);
    
    // ৩. selectedPayment এর জন্য সঠিক টাইপ সেট করা
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    
    const [createForm, setCreateForm] = useState({ student_id: '', title: '', amount: '', due_date: '' });
    const [payAmount, setPayAmount] = useState("");

    const handleCreateInvoice = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/payments', createForm, { onSuccess: () => setIsCreateOpen(false) });
    };

    const handleUpdatePayment = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedPayment) {
            router.put(`/payments/${selectedPayment.payment_id}`, { paid_amount: payAmount }, {
                onSuccess: () => setIsPayOpen(false)
            });
        }
    };

    const handleDelete = (id: number) => {
        if (window.confirm("Are you sure you want to delete this invoice? This action cannot be undone.")) {
            router.delete(`/payments/${id}`);
        }
    };

    const getStatusBadge = (status: Payment['status']) => {
        const styles: Record<Payment['status'], string> = {
            paid: "bg-emerald-100 text-emerald-700 border-emerald-200",
            unpaid: "bg-rose-100 text-rose-700 border-rose-200",
            partial: "bg-amber-100 text-amber-700 border-amber-200"
        };
        return (
            <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-tighter border ${styles[status]}`}>
                {status}
            </span>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Fees Management" />
            
            <div className="p-6 lg:p-10 bg-[#F8FAFC] dark:bg-neutral-950 min-h-screen">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-indigo-600 rounded-[1.5rem] shadow-xl text-white">
                            <Wallet size={32} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Billing Hub</h1>
                            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1 opacity-70">School Financial Management</p>
                        </div>
                    </div>
                    {isAdmin && (
                        <Button onClick={() => setIsCreateOpen(true)} className="h-14 px-8 rounded-2xl font-black text-md shadow-2xl hover:scale-105 transition-all gap-2">
                            <PlusCircle size={20} /> Create New Invoice
                        </Button>
                    )}
                </div>

                <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white dark:bg-neutral-900">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-neutral-800/50 border-b border-slate-100 dark:border-neutral-800">
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Student Profile</th>
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Billing Details</th>
                                    <th className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Amount</th>
                                    <th className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-neutral-800">
                                {paymentList.map((payment: Payment) => (
                                    <tr key={payment.payment_id} className="hover:bg-slate-50/50 dark:hover:bg-neutral-800/30 transition-all group">
                                        <td className="px-8 py-7">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 font-black text-lg shadow-inner">
                                                    <User size={18} />
                                                </div>
                                                <span className="font-black text-slate-800 dark:text-slate-100 text-md">
                                                    {payment.student?.first_name} {payment.student?.last_name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-7">
                                            <div className="font-bold text-slate-700 dark:text-slate-300">{payment.title}</div>
                                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1.5 font-black uppercase tracking-widest bg-slate-100 dark:bg-neutral-800 w-fit px-2 py-0.5 rounded-md">
                                                <CalendarClock size={12} /> Due: {payment.due_date}
                                            </div>
                                        </td>
                                        <td className="px-8 py-7 text-center">
                                            <div className="text-xl font-black text-slate-900 dark:text-white">${payment.amount}</div>
                                            <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-tighter mt-1">Paid: ${payment.paid_amount}</div>
                                        </td>
                                        <td className="px-8 py-7 text-center">
                                            {getStatusBadge(payment.status)}
                                        </td>
                                        <td className="px-8 py-7 text-right">
                                            <div className="flex justify-end gap-3">
                                                {isAdmin && payment.status !== 'paid' && (
                                                    <Button size="sm" onClick={() => { setSelectedPayment(payment); setPayAmount(""); setIsPayOpen(true); }} className="h-10 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold shadow-lg">
                                                        Collect
                                                    </Button>
                                                )}
                                                {isAdmin && (
                                                    <Button size="sm" variant="destructive" onClick={() => handleDelete(payment.payment_id)} className="h-10 w-10 p-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Trash2 size={16} />
                                                    </Button>
                                                )}
                                                <Button size="sm" variant="outline" className="h-10 w-10 p-0 rounded-xl" onClick={() => window.print()}>
                                                    <Printer size={16} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="max-w-xl rounded-[3rem] p-10 border-none shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
                            <Receipt size={32} className="text-primary" /> New Billing Entry
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateInvoice} className="space-y-6 mt-8">
                        <div className="space-y-2">
                            <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400 ml-1">Select Student</Label>
                            <select 
                                className="w-full h-14 px-5 rounded-2xl bg-slate-100 dark:bg-neutral-800 border-none outline-none font-bold text-sm focus:ring-2 ring-primary"
                                value={createForm.student_id} 
                                onChange={e => setCreateForm({...createForm, student_id: e.target.value})} 
                                required
                            >
                                <option value="">Choose a Student</option>
                                {studentList.map((s: Student) => <option key={s.student_id} value={s.student_id}>{s.first_name} {s.last_name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400 ml-1">Fee Description</Label>
                            <Input className="h-14 rounded-2xl border-none bg-slate-100 dark:bg-neutral-800 font-bold text-md px-5" placeholder="e.g. Admission Fee" value={createForm.title} onChange={e => setCreateForm({...createForm, title: e.target.value})} required />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400 ml-1">Total Bill ($)</Label>
                                <Input type="number" className="h-14 rounded-2xl border-none bg-slate-100 dark:bg-neutral-800 font-bold px-5" value={createForm.amount} onChange={e => setCreateForm({...createForm, amount: e.target.value})} required />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400 ml-1">Payment Deadline</Label>
                                <Input type="date" className="h-14 rounded-2xl border-none bg-slate-100 dark:bg-neutral-800 font-bold px-5" value={createForm.due_date} onChange={e => setCreateForm({...createForm, due_date: e.target.value})} required />
                            </div>
                        </div>
                        <Button type="submit" className="w-full h-16 rounded-[1.5rem] font-black text-xl mt-6 uppercase tracking-widest">Generate Invoice</Button>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isPayOpen} onOpenChange={setIsPayOpen}>
                <DialogContent className="max-w-md rounded-[3rem] p-10 border-none shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black uppercase text-center tracking-tighter">Receive Funds</DialogTitle>
                    </DialogHeader>
                    {selectedPayment && (
                        <div className="text-center mt-6 mb-8 p-6 bg-slate-50 dark:bg-neutral-800 rounded-3xl border border-slate-100 dark:border-neutral-700">
                            <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Outstanding Balance</div>
                            <div className="text-5xl font-black text-indigo-600">${selectedPayment.amount - selectedPayment.paid_amount}</div>
                        </div>
                    )}
                    <form onSubmit={handleUpdatePayment} className="space-y-5">
                        <div className="space-y-2 text-center">
                            <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400">Amount Received</Label>
                            <Input 
                                type="number" 
                                className="h-16 rounded-2xl text-center text-3xl font-black border-4 border-emerald-100 focus:border-emerald-500 bg-emerald-50/20 px-5" 
                                value={payAmount} 
                                onChange={e => setPayAmount(e.target.value)} 
                                placeholder="0.00"
                                required 
                            />
                        </div>
                        <Button type="submit" className="w-full h-16 rounded-2xl bg-emerald-600 hover:bg-emerald-700 font-black text-xl uppercase tracking-widest mt-4 shadow-xl">Confirm & Receipt</Button>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}