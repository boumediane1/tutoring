import Heading from '@/components/heading';
import Pagination from '@/components/pagination';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { CreditCard } from 'lucide-react';

interface Invoice {
    id: number;
    amount: string;
    status: string;
    date: string;
    booking: {
        id: number;
        start: string;
        end: string;
    };
    student: {
        name: string;
    };
    tutor: {
        name: string;
    };
}

interface PaginatedInvoices {
    data: Invoice[];
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Billings',
        href: '/billings',
    },
];

export default function BillingIndex({
    invoices,
}: {
    invoices: PaginatedInvoices;
}) {
    const { auth } = usePage<SharedData>().props;
    const isTutor = auth.user.role === 'tutor';

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatCurrency = (amount: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(parseFloat(amount));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Billings" />
            <div className="space-y-8 p-4 md:p-8">
                <Heading
                    title="Billings"
                    description="View and manage your session invoices."
                />

                <div className="max-w-5xl space-y-8">
                    {invoices.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-xl border bg-white py-12 text-center">
                            <CreditCard className="mb-4 h-12 w-12 text-muted-foreground/20" />
                            <h3 className="text-lg font-semibold">
                                No invoices found
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                You don't have any billing records yet.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-hidden rounded-lg border bg-white">
                                <table className="w-full text-left text-sm">
                                    <thead className="border-b bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                                        <tr>
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4">
                                                {isTutor ? 'Student' : 'Tutor'}
                                            </th>
                                            <th className="px-6 py-4">
                                                Amount
                                            </th>
                                            <th className="px-6 py-4">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {invoices.data.map((invoice) => (
                                            <tr
                                                key={invoice.id}
                                                className="transition-colors hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 font-medium text-gray-900">
                                                    {formatDate(invoice.date)}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {isTutor
                                                        ? invoice.student.name
                                                        : invoice.tutor.name}
                                                </td>
                                                <td className="px-6 py-4 font-bold text-gray-900">
                                                    {formatCurrency(
                                                        invoice.amount,
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                                        {invoice.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination links={invoices.links} />
                        </>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
