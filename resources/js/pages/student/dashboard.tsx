import { join } from '@/actions/App/Http/Controllers/BookingJoinController';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { index as bookTutor } from '@/routes/booking';
import { dashboard } from '@/routes/student';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Calendar, CheckCircle, Clock, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import '/node_modules/flag-icons/css/flag-icons.min.css';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface Tag {
    id: number;
    title: string;
}

interface Speciality {
    id: number;
    title: string;
    tags: Tag[];
}

interface Tutor {
    id: number;
    user: { name: string; image: string };
    country?: { code: string };
    specialities: Speciality[];
    tags: Tag[];
}

interface Booking {
    id: number;
    start: string;
    end: string;
    tutor: {
        user: {
            name: string;
            image: string;
        };
    };
}

export default function Dashboard({
    upcomingBookings = [],
    recentTutors = [],
    stats,
    counts,
}: {
    upcomingBookings?: Booking[];
    recentTutors?: Tutor[];
    stats: {
        upcoming_lessons: number;
        pending_requests: number;
        total_completed: number;
    };
    counts: {
        upcoming: number;
    };
}) {
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Student Dashboard" />
            <div className="space-y-8 p-4 md:p-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground">
                        Welcome back! Here's what's happening with your
                        learning.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Lessons Completed
                            </CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.total_completed}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Total learning sessions
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
                                Waiting for tutor approval
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Upcoming Lessons
                            </CardTitle>
                            <Calendar className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.upcoming_lessons}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Next sessions scheduled
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
                                            No upcoming sessions. Time to book
                                            one!
                                        </p>
                                    </div>
                                ) : (
                                    upcomingBookings.map((booking) => (
                                        <div
                                            key={booking.id}
                                            className="flex items-center"
                                        >
                                            <Avatar className="h-10 w-10 border border-border">
                                                <AvatarImage
                                                    className="object-cover"
                                                    src={
                                                        booking.tutor.user.image
                                                    }
                                                    alt={
                                                        booking.tutor.user.name
                                                    }
                                                />
                                                <AvatarFallback>
                                                    {booking.tutor.user.name.charAt(
                                                        0,
                                                    )}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="ml-4 flex-1 space-y-1">
                                                <p className="text-sm leading-none font-semibold">
                                                    {booking.tutor.user.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(
                                                        booking.start,
                                                    ).toLocaleDateString(
                                                        'en-US',
                                                        {
                                                            weekday: 'long',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        },
                                                    )}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    Details
                                                </Button>
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
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-1 lg:col-span-3">
                        <CardHeader>
                            <CardTitle>My Tutors</CardTitle>
                            <CardDescription>
                                Tutors you've worked with recently.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {recentTutors.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <Users className="h-12 w-12 text-muted-foreground/20" />
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            No tutors yet. Start your journey
                                            today!
                                        </p>
                                    </div>
                                ) : (
                                    recentTutors.map((tutor) => (
                                        <div
                                            key={tutor.id}
                                            className="flex items-center"
                                        >
                                            <Avatar className="h-10 w-10 border border-border">
                                                <AvatarImage
                                                    className="object-cover"
                                                    src={tutor.user.image}
                                                    alt={tutor.user.name}
                                                />
                                                <AvatarFallback>
                                                    {tutor.user.name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="ml-4 flex-1 space-y-1">
                                                <p className="text-sm leading-none font-semibold">
                                                    {tutor.user.name}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    {tutor.country && (
                                                        <span
                                                            className={`fi fi-${tutor.country.code.toLowerCase()} h-3 w-4 rounded-sm`}
                                                        ></span>
                                                    )}
                                                    <p className="text-xs text-muted-foreground">
                                                        {tutor.specialities?.[0]
                                                            ?.title ||
                                                            'Expert Tutor'}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                size="sm"
                                                className="cursor-pointer"
                                                asChild
                                            >
                                                <Link
                                                    href={bookTutor.url(
                                                        tutor.id,
                                                    )}
                                                >
                                                    Book
                                                </Link>
                                            </Button>
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
