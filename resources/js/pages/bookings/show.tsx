import { join } from '@/actions/App/Http/Controllers/BookingJoinController';
import {
    destroy as deleteDocument,
    download as downloadDocument,
    store as uploadDocument,
} from '@/actions/App/Http/Controllers/SessionDocumentController';
import Heading from '@/components/heading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import {
    Calendar,
    Clock,
    Download,
    FileText,
    Loader2,
    Trash2,
    Upload,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface SessionDocument {
    id: number;
    filename: string;
    size: number;
    created_at: string;
}

interface Booking {
    id: number;
    start: string;
    end: string;
    status: string;
    tutor: {
        name: string;
        image: string;
    };
    student: {
        name: string;
        image: string;
    };
    documents: SessionDocument[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Session Details',
        href: '#',
    },
];

export default function Show({ booking }: { booking: Booking }) {
    const { auth } = usePage<SharedData>().props;
    const [now, setNow] = useState(new Date());
    const fileInput = useRef<HTMLInputElement>(null);

    const {
        post,
        processing,
        reset,
        errors,
        transform,
        delete: destroy,
    } = useForm({
        document: null as File | null,
    });

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 10000);
        return () => clearInterval(timer);
    }, []);

    const canJoin = () => {
        if (booking.status !== 'confirmed') {
            return false;
        }

        return true;

        // const start = new Date(booking.start);
        // const end = new Date(booking.end);
        // console.log('Booking start and end times:', start, end);
        // return now >= start && now <= end;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            timeZone: 'UTC',
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'UTC',
        });
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleUpload = (file: File) => {
        if (confirm(`Are you sure you want to upload "${file.name}"?`)) {
            transform((data) => ({
                ...data,
                document: file,
            }));

            post(uploadDocument(booking.id).url, {
                onSuccess: () => {
                    reset();
                    if (fileInput.current) {
                        fileInput.current.value = '';
                    }
                },
            });
        } else {
            if (fileInput.current) {
                fileInput.current.value = '';
            }
        }
    };

    const handleDeleteDocument = (documentId: number) => {
        if (confirm('Are you sure you want to delete this document?')) {
            destroy(deleteDocument(documentId).url);
        }
    };

    const isTutor = auth.user.role === 'tutor';
    const otherParty = isTutor ? booking.student : booking.tutor;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Session Details" />

            <div className="space-y-8 p-4 md:p-8">
                <Heading
                    title="Session Details"
                    description="View information about your tutoring session."
                />

                <div className="grid gap-6 lg:grid-cols-2">
                    <div>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <div>
                                    <CardTitle>Session Information</CardTitle>
                                    <CardDescription>
                                        Details about the scheduled time and
                                        status.
                                    </CardDescription>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Badge
                                        variant={
                                            booking.status === 'confirmed'
                                                ? 'default'
                                                : 'secondary'
                                        }
                                    >
                                        {booking.status.toUpperCase()}
                                    </Badge>
                                </div>
                            </CardHeader>

                            <CardContent className="flex flex-1 flex-col justify-between space-y-6">
                                <div className="space-y-6">
                                    <div className="grid gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                <Calendar className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">
                                                    Date
                                                </p>
                                                <p className="text-lg font-semibold">
                                                    {formatDate(booking.start)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                <Clock className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">
                                                    Time
                                                </p>
                                                <p className="text-lg font-semibold">
                                                    {formatTime(booking.start)}{' '}
                                                    - {formatTime(booking.end)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="rounded-full bg-primary/10 text-primary">
                                                <Avatar className="size-12">
                                                    <AvatarImage
                                                        className="object-cover"
                                                        src={otherParty.image}
                                                        alt={otherParty.name}
                                                    />
                                                    <AvatarFallback>
                                                        {otherParty.name.charAt(
                                                            0,
                                                        )}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">
                                                    {isTutor
                                                        ? 'Student'
                                                        : 'Tutor'}
                                                </p>
                                                <p className="text-lg font-semibold">
                                                    {otherParty.name}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto flex justify-start pt-4">
                                    <Button
                                        disabled={!canJoin()}
                                        asChild={canJoin()}
                                        size="lg"
                                        className="px-8"
                                    >
                                        {canJoin() ? (
                                            <a href={join(booking.id).url}>
                                                Join Session
                                            </a>
                                        ) : (
                                            <span>Join Session</span>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex flex-col">
                        <Card className="flex flex-1 flex-col">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Session Documents</CardTitle>
                                    <CardDescription>
                                        Documents shared for this session.
                                    </CardDescription>
                                </div>
                                {isTutor && (
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="file"
                                            ref={fileInput}
                                            className="hidden"
                                            onChange={(e) => {
                                                const file =
                                                    e.target.files?.[0];
                                                if (file) {
                                                    handleUpload(file);
                                                }
                                            }}
                                        />
                                        <Button
                                            type="button"
                                            onClick={() =>
                                                fileInput.current?.click()
                                            }
                                            disabled={processing}
                                            size="sm"
                                            variant="outline"
                                        >
                                            {processing ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <Upload className="mr-2 h-4 w-4" />
                                                    Upload
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </CardHeader>
                            <CardContent className="flex flex-1 flex-col">
                                {errors.document && (
                                    <p className="mb-4 text-sm text-destructive">
                                        {errors.document}
                                    </p>
                                )}

                                {booking.documents.length === 0 ? (
                                    <div className="flex flex-1 flex-col items-center justify-center py-8 text-center text-muted-foreground">
                                        <FileText className="mb-2 h-12 w-12 opacity-20" />
                                        <p>No documents shared yet.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {booking.documents.map((doc) => (
                                            <div
                                                key={doc.id}
                                                className="flex items-center justify-between rounded-lg border p-4"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded bg-primary/10 text-primary">
                                                        <FileText className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">
                                                            {doc.filename}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {formatFileSize(
                                                                doc.size,
                                                            )}{' '}
                                                            •{' '}
                                                            {new Date(
                                                                doc.created_at,
                                                            ).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        asChild
                                                    >
                                                        <a
                                                            href={
                                                                downloadDocument(
                                                                    doc.id,
                                                                ).url
                                                            }
                                                        >
                                                            <Download className="h-4 w-4" />
                                                        </a>
                                                    </Button>
                                                    {isTutor && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                            onClick={() =>
                                                                handleDeleteDocument(
                                                                    doc.id,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
