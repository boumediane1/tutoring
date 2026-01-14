import { update } from '@/actions/App/Http/Controllers/Tutor/BookingController';
import Heading from '@/components/heading';
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
import { dashboard } from '@/routes/tutor';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Calendar, CheckCircle, Clock } from 'lucide-react';

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

            <div className="px-4 py-6">
                <Heading
                    title="Dashboard"
                    description="Overview of your tutoring sessions and requests."
                />

                <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Sessions
                                </CardTitle>
                                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {stats.total_sessions}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Pending Requests
                                </CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {stats.pending_requests}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Upcoming Sessions
                                </CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {stats.upcoming_sessions}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Upcoming Sessions</CardTitle>
                                <CardDescription>
                                    {counts.upcoming > 5
                                        ? `Showing the latest 5 of ${counts.upcoming} upcoming sessions.`
                                        : `You have ${counts.upcoming} sessions coming up.`}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-8">
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
                                                <Avatar className="h-9 w-9">
                                                    <AvatarFallback>
                                                        {booking.student.user.name.charAt(
                                                            0,
                                                        )}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="ml-4 space-y-1">
                                                    <p className="text-sm leading-none font-medium">
                                                        {
                                                            booking.student.user
                                                                .name
                                                        }
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {formatDate(
                                                            booking.start,
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="ml-auto font-medium">
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

                        <Card>
                            <CardHeader>
                                <CardTitle>Pending Requests</CardTitle>
                                <CardDescription>
                                    {counts.pending > 5
                                        ? `Showing the latest 5 of ${counts.pending} pending requests.`
                                        : `You have ${counts.pending} pending requests.`}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
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
                                                <div className="flex items-center">
                                                    <Avatar className="h-9 w-9">
                                                        <AvatarFallback>
                                                            {booking.student.user.name.charAt(
                                                                0,
                                                            )}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="ml-4 space-y-1">
                                                        <p className="text-sm leading-none font-medium">
                                                            {
                                                                booking.student
                                                                    .user.name
                                                            }
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
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
            </div>
        </AppLayout>
    );
}
