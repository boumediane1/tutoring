import Heading from '@/components/heading';
import Pagination from '@/components/pagination';
import StarRating from '@/components/star-rating';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { FileText } from 'lucide-react';

interface Session {
    id: number;
    name: string;
    start: string;
    end: string;
    duration: number;
    tutor: {
        name: string;
        image?: string;
    };
    student: {
        name: string;
        image?: string;
    };
    documents_count: number;
    rating?: number;
}

interface PaginatedSessions {
    data: Session[];
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Session Notes',
        href: '/sessions',
    },
];

export default function SessionsIndex({
    sessions,
}: {
    sessions: PaginatedSessions;
}) {
    const { auth } = usePage<SharedData>().props;
    const isTutor = auth.user.role === 'tutor';

    const formatTime = (dateString: string) => {
        return new Date(dateString)
            .toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
            })
            .toLowerCase()
            .replace(' ', '');
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Session Notes" />
            <div className="space-y-8 p-4 md:p-8">
                <Heading
                    title="Session Notes"
                    description="View your session notes and access shared documents."
                />

                <div className="max-w-5xl space-y-8">
                    {sessions.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-xl border bg-white py-12 text-center">
                            <FileText className="mb-4 h-12 w-12 text-muted-foreground/20" />
                            <h3 className="text-lg font-semibold">
                                No session notes found
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                You don't have any session notes yet.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col gap-4">
                                {sessions.data.map((session) => {
                                    const participant = isTutor
                                        ? session.student
                                        : session.tutor;
                                    return (
                                        <div
                                            key={session.id}
                                            className="group flex items-center gap-4 rounded-lg border bg-white p-4 transition-colors hover:bg-gray-50"
                                        >
                                            {/* Left: Avatar and Participant Info */}
                                            <Link
                                                href={`/bookings/show/${session.id}`}
                                                className="flex min-w-0 flex-1 items-center gap-4"
                                            >
                                                <Avatar className="h-12 w-12 border">
                                                    {participant.image && (
                                                        <AvatarImage
                                                            className="object-cover"
                                                            src={
                                                                participant.image
                                                            }
                                                            alt={
                                                                participant.name
                                                            }
                                                        />
                                                    )}
                                                    <AvatarFallback className="bg-primary/10 font-medium text-primary">
                                                        {getInitials(
                                                            participant.name,
                                                        )}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col truncate">
                                                    <span className="text-lg font-bold text-[#1a1a1a]">
                                                        {participant.name}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        {isTutor
                                                            ? 'Student'
                                                            : 'Tutor'}
                                                    </span>
                                                </div>
                                            </Link>

                                            {/* Middle: Session Name */}
                                            <Link
                                                href={`/bookings/show/${session.id}`}
                                                className="flex min-w-0 flex-1 flex-col"
                                            >
                                                <span className="truncate text-lg font-bold text-[#1a1a1a]">
                                                    {session.name}
                                                </span>
                                            </Link>

                                            {/* Session Duration Column */}
                                            <div className="flex min-w-[100px] flex-col items-center">
                                                <span className="text-lg font-bold text-[#1a1a1a]">
                                                    {session.duration} mins
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    Duration
                                                </span>
                                            </div>

                                            {/* Documents Shared Column */}
                                            <div className="flex min-w-[120px] flex-col items-center">
                                                <span className="text-lg font-bold text-[#1a1a1a]">
                                                    {session.documents_count}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    {session.documents_count ===
                                                    1
                                                        ? 'document'
                                                        : 'documents'}
                                                </span>
                                            </div>

                                            {/* Right: Time */}
                                            <div className="flex min-w-[100px] flex-col items-end">
                                                <span className="text-lg font-bold text-[#1a1a1a]">
                                                    {formatTime(session.start)}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    Your time
                                                </span>
                                                {!isTutor && (
                                                    <div className="mt-2">
                                                        <StarRating
                                                            bookingId={
                                                                session.id
                                                            }
                                                            initialRating={
                                                                session.rating
                                                            }
                                                        />
                                                    </div>
                                                )}
                                                {isTutor && session.rating && (
                                                    <div className="mt-2">
                                                        <StarRating
                                                            bookingId={
                                                                session.id
                                                            }
                                                            initialRating={
                                                                session.rating
                                                            }
                                                            readonly
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <Pagination links={sessions.links} />
                        </>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
