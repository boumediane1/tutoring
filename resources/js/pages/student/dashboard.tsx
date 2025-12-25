import AppLayout from '@/layouts/app-layout';
import TutorCard from '@/pages/student/tutor-card';
import { dashboard } from '@/routes/student';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import '/node_modules/flag-icons/css/flag-icons.min.css';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="p-4">
                <div className="grid grid-cols-3">
                    <TutorCard
                        name="Fuzzy"
                        country_code="ma"
                        reviews={80}
                        rating={4.5}
                        lessons={50}
                        speciality="Programming"
                    />
                </div>
            </div>
        </AppLayout>
    );
}
