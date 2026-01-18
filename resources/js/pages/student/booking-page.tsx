import { store } from '@/actions/App/Http/Controllers/BookingController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

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
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            tutor_id: tutor.id,
            start: '',
            end: '',
        });

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
        start: Date;
        startStr: string;
        endStr: string;
        view: { calendar: { unselect: () => void } };
    }) => {
        // use selectInfo.start (which is a Date object) for comparison
        // But FullCalendar in UTC mode gives start as if it were local time
        // actually when timeZone="UTC", selectInfo.start is the UTC date
        if (selectInfo.start < new Date()) {
            alert('You cannot book a session in the past.');
            selectInfo.view.calendar.unselect();
            return;
        }

        // selectInfo.startStr and endStr are in ISO format (e.g., 2026-01-18T18:00:00Z or similar)
        // Since we are using timeZone="UTC", these will be UTC strings.
        // We want to extract the date and time for our datetime-local input, which expects YYYY-MM-DDTHH:mm
        const formatForInput = (dateStr: string) => {
            return dateStr.substring(0, 16);
        };

        setData({
            ...data,
            start: formatForInput(selectInfo.startStr),
            end: formatForInput(selectInfo.endStr),
        });
        setIsDialogOpen(true);

        selectInfo.view.calendar.unselect();
    };

    const handleBookingSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(store().url, {
            onSuccess: () => {
                setIsDialogOpen(false);
                reset();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Book with ${tutor.name}`} />
            <div className="p-4 md:p-8">
                <Heading
                    title={`Book a session with ${tutor.name}`}
                    description={`Select a time slot to book your session with ${tutor.name}.`}
                />

                <FullCalendar
                    plugins={[timeGridPlugin, interactionPlugin]}
                    initialView="timeGridWeek"
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    weekends={true}
                    events={bookings}
                    select={handleDateSelect}
                    timeZone="UTC"
                    slotDuration="01:00:00"
                    snapDuration="01:00:00"
                    defaultTimedEventDuration="01:00:00"
                    allDaySlot={false}
                    expandRows={true}
                />

                <Dialog
                    open={isDialogOpen}
                    onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) {
                            clearErrors();
                        }
                    }}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirm Booking</DialogTitle>
                            <DialogDescription>
                                Set your preferred time for the session with{' '}
                                {tutor.name}.
                            </DialogDescription>
                        </DialogHeader>

                        <form
                            onSubmit={handleBookingSubmit}
                            className="space-y-4 py-4"
                        >
                            <div className="grid gap-2">
                                <Label htmlFor="start">Start Time</Label>
                                <Input
                                    id="start"
                                    type="datetime-local"
                                    value={data.start}
                                    onChange={(e) =>
                                        setData('start', e.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.start} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="end">End Time</Label>
                                <Input
                                    id="end"
                                    type="datetime-local"
                                    value={data.end}
                                    onChange={(e) =>
                                        setData('end', e.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.end} />
                            </div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    Book Session
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
