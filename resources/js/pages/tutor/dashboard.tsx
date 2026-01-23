import { show } from '@/actions/App/Http/Controllers/BookingController';
import { update } from '@/actions/App/Http/Controllers/Tutor/BookingController';
import Heading from '@/components/heading';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import { Head, Link, router } from '@inertiajs/react';
import { Calendar, CheckCircle, Clock, Star } from 'lucide-react';

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
        average_rating: number;
        total_reviews: number;
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
            timeZone: 'UTC',
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
                <Heading
                    title="Dashboard"
                    description="Welcome back! Here's what's happening with your tutoring."
                />

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Lessons
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
                                Average Rating
                            </CardTitle>
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {Number(stats.average_rating).toFixed(1)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Based on {stats.total_reviews} reviews
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
                            <Calendar className="h-4 w-4 text-purple-500" />
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
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <Calendar className="h-12 w-12 text-muted-foreground/20" />
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            No upcoming sessions.
                                        </p>
                                    </div>
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
                                                    variant="outline"
                                                    asChild
                                                >
                                                    <Link
                                                        href={
                                                            show(booking.id).url
                                                        }
                                                    >
                                                        Details
                                                    </Link>
                                                </Button>
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
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <Clock className="h-12 w-12 text-muted-foreground/20" />
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            No pending requests.
                                        </p>
                                    </div>
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
