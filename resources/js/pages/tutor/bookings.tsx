import { update } from '@/actions/App/Http/Controllers/Tutor/BookingController';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

interface Booking {
    id: string;
    title: string;
    start: string;
    end: string;
    status: string;
    student: {
        name: string;
        email: string;
    };
    color: string;
}

interface BookingsPageProps {
    bookings: Booking[];
}

export default function BookingsPage({ bookings }: BookingsPageProps) {
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(
        null,
    );

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/tutor/dashboard',
        },
        {
            title: 'Bookings',
            href: '/tutor/bookings',
        },
    ];

    const handleStatusUpdate = (
        bookingId: string,
        status: 'confirmed' | 'rejected',
    ) => {
        router.patch(
            update(parseInt(bookingId)),
            { status },
            {
                onSuccess: () => setSelectedBooking(null),
            },
        );
    };

    const handleEventClick = (clickInfo: { event: { id: string } }) => {
        const booking = bookings.find((b) => b.id === clickInfo.event.id);
        if (booking) {
            setSelectedBooking(booking);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="secondary">Pending</Badge>;
            case 'confirmed':
                return (
                    <Badge className="bg-green-500 hover:bg-green-600">
                        Confirmed
                    </Badge>
                );
            case 'rejected':
                return <Badge variant="destructive">Rejected</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Bookings" />

            <div className="p-4 md:p-8">
                <Heading
                    title="My Bookings"
                    description="Overview of your bookings."
                />

                <FullCalendar
                    plugins={[timeGridPlugin, interactionPlugin]}
                    initialView="timeGridWeek"
                    selectable={false}
                    dayMaxEvents={true}
                    weekends={true}
                    events={bookings}
                    eventClick={handleEventClick}
                    eventClassNames="cursor-pointer"
                    slotDuration="01:00:00"
                    allDaySlot={false}
                    expandRows={true}
                />

                <Dialog
                    open={!!selectedBooking}
                    onOpenChange={(open) => !open && setSelectedBooking(null)}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Booking Details</DialogTitle>
                            <DialogDescription>
                                Review the booking information below.
                            </DialogDescription>
                        </DialogHeader>

                        {selectedBooking && (
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        Student:
                                    </span>
                                    <span className="col-span-3 text-sm">
                                        {selectedBooking.student.name}
                                    </span>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        Email:
                                    </span>
                                    <span className="col-span-3 text-sm">
                                        {selectedBooking.student.email}
                                    </span>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        Time:
                                    </span>
                                    <span className="col-span-3 text-sm">
                                        {new Date(
                                            selectedBooking.start,
                                        ).toLocaleString()}{' '}
                                        -{' '}
                                        {new Date(
                                            selectedBooking.end,
                                        ).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        Status:
                                    </span>
                                    <div className="col-span-3">
                                        {getStatusBadge(selectedBooking.status)}
                                    </div>
                                </div>
                            </div>
                        )}

                        <DialogFooter>
                            {selectedBooking?.status === 'pending' && (
                                <div className="flex w-full justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            handleStatusUpdate(
                                                selectedBooking.id,
                                                'rejected',
                                            )
                                        }
                                    >
                                        Reject
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            handleStatusUpdate(
                                                selectedBooking.id,
                                                'confirmed',
                                            )
                                        }
                                    >
                                        Accept
                                    </Button>
                                </div>
                            )}
                            <Button
                                variant="ghost"
                                onClick={() => setSelectedBooking(null)}
                            >
                                Close
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
