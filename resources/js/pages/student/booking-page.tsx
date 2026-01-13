import { store } from '@/actions/App/Http/Controllers/BookingController';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Head, router } from '@inertiajs/react';

interface Booking {
    id: string;
    title: string;
    start: string;
    end: string;
    color: string;
}

interface BookingPageProps {
    tutor: {
        id: number;
        name: string;
    };
    bookings: Booking[];
}

export default function BookingPage({ tutor, bookings }: BookingPageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/student/dashboard',
        },
        {
            title: `Book with ${tutor.name}`,
            href: `/bookings/${tutor.id}`,
        },
    ];

    const handleDateSelect = (selectInfo: {
        startStr: string;
        endStr: string;
        view: { calendar: { unselect: () => void } };
    }) => {
        const title = confirm(
            `Do you want to book a session from ${selectInfo.startStr} to ${selectInfo.endStr}?`,
        );

        if (title) {
            router.post(store(), {
                tutor_id: tutor.id,
                start: selectInfo.startStr,
                end: selectInfo.endStr,
            });
        }

        selectInfo.view.calendar.unselect();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Book with ${tutor.name}`} />
            <div className="p-4">
                <div className="mb-4">
                    <h1 className="text-2xl font-bold">
                        Book a session with {tutor.name}
                    </h1>
                </div>

                <FullCalendar
                    plugins={[timeGridPlugin, interactionPlugin]}
                    initialView="timeGridWeek"
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    weekends={true}
                    events={bookings}
                    select={handleDateSelect}
                    slotMinTime="08:00:00"
                    slotMaxTime="20:00:00"
                    slotDuration="01:00:00"
                    snapDuration="01:00:00"
                    defaultTimedEventDuration="01:00:00"
                    allDaySlot={false}
                    height="700px"
                    expandRows={true}
                />
            </div>
        </AppLayout>
    );
}
