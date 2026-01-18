import { update } from '@/actions/App/Http/Controllers/Tutor/BookingController';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { join } from '@/routes/bookings';
import { dashboard } from '@/routes/tutor';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Calendar, CheckCircle, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface Booking {
    id: number;
    start: string;
    end: string;
    status: string;
    student: {
        user: {
            name: string;
            email: string;
        };
    };
}

interface Props {
    stats: {
        total_sessions: number;
        pending_requests: number;
        upcoming_sessions: number;
    };
    pendingBookings: Booking[];
    upcomingBookings: Booking[];
    counts: {
        pending: number;
        upcoming: number;
    };
}

export default function Dashboard({
    stats,
    pendingBookings,
    upcomingBookings,
    counts,
}: Props) {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 10000);
        return () => clearInterval(timer);
    }, []);

    const canJoin = (booking: Booking) => {
        const start = new Date(booking.start);
        const end = new Date(booking.end);
        return now >= start && now <= end;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleStatusUpdate = (
        id: number,
        status: 'confirmed' | 'rejected',
    ) => {
        const action = status === 'confirmed' ? 'approve' : 'reject';
        if (
            !confirm(`Are you sure you want to ${action} this booking request?`)
        ) {
            return;
        }

        router.patch(
            update(id).url,
            { status },
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tutor Dashboard" />

            <div className="space-y-8 p-4 md:p-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground">
                        Welcome back! Here's what's happening with your
                        tutoring.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Sessions
                            </CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.total_sessions}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Total tutoring sessions
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Pending Requests
                            </CardTitle>
                            <Clock className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.pending_requests}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Requests awaiting your approval
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Upcoming Sessions
                            </CardTitle>
                            <Calendar className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.upcoming_sessions}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Sessions scheduled soon
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="md:col-span-1 lg:col-span-4">
                        <CardHeader>
                            <CardTitle>Upcoming Sessions</CardTitle>
                            <CardDescription>
                                {counts.upcoming > 5
                                    ? `Showing the latest 5 of ${counts.upcoming} upcoming sessions.`
                                    : `You have ${counts.upcoming} sessions coming up.`}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {upcomingBookings.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">
                                        No upcoming sessions.
                                    </p>
                                ) : (
                                    upcomingBookings.map((booking) => (
                                        <div
                                            key={booking.id}
                                            className="flex items-center"
                                        >
                                            <Avatar className="h-10 w-10 border border-border">
                                                <AvatarFallback>
                                                    {booking.student.user.name.charAt(
                                                        0,
                                                    )}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="ml-4 flex-1 space-y-1">
                                                <p className="text-sm leading-none font-semibold">
                                                    {booking.student.user.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatDate(booking.start)}
                                                </p>
                                            </div>
                                            <div className="ml-auto flex items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    disabled={!canJoin(booking)}
                                                    asChild={canJoin(booking)}
                                                >
                                                    {canJoin(booking) ? (
                                                        <a
                                                            href={
                                                                join(booking.id)
                                                                    .url
                                                            }
                                                        >
                                                            Join session
                                                        </a>
                                                    ) : (
                                                        'Join session'
                                                    )}
                                                </Button>
                                                <Badge variant="outline">
                                                    Confirmed
                                                </Badge>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-1 lg:col-span-3">
                        <CardHeader>
                            <CardTitle>Pending Requests</CardTitle>
                            <CardDescription>
                                {counts.pending > 5
                                    ? `Showing the latest 5 of ${counts.pending} pending requests.`
                                    : `You have ${counts.pending} pending requests.`}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {pendingBookings.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">
                                        No pending requests.
                                    </p>
                                ) : (
                                    pendingBookings.map((booking) => (
                                        <div
                                            key={booking.id}
                                            className="flex items-center justify-between"
                                        >
                                            <div className="flex flex-1 items-center">
                                                <Avatar className="h-10 w-10 border border-border">
                                                    <AvatarFallback>
                                                        {booking.student.user.name.charAt(
                                                            0,
                                                        )}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="ml-4 space-y-1">
                                                    <p className="text-sm leading-none font-semibold">
                                                        {
                                                            booking.student.user
                                                                .name
                                                        }
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatDate(
                                                            booking.start,
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8"
                                                    onClick={() =>
                                                        handleStatusUpdate(
                                                            booking.id,
                                                            'rejected',
                                                        )
                                                    }
                                                >
                                                    Reject
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="h-8"
                                                    onClick={() =>
                                                        handleStatusUpdate(
                                                            booking.id,
                                                            'confirmed',
                                                        )
                                                    }
                                                >
                                                    Approve
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
