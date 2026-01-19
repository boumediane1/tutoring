import { index } from '@/actions/App/Http/Controllers/Student/TutorController';
import Heading from '@/components/heading';
import Pagination from '@/components/pagination';
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
import Combobox from '@/pages/profile/Combobox';
import TutorCard from '@/pages/student/tutor-card';
import { type BreadcrumbItem } from '@/types';
import { FormComponentSlotProps } from '@inertiajs/core';
import { Form, Head } from '@inertiajs/react';
import { Search, Users } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import '/node_modules/flag-icons/css/flag-icons.min.css';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Find a Tutor',
        href: '/student/tutors',
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

interface PaginatedTutors {
    data: Tutor[];
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

export default function TutorsIndex({
    tutors,
    specialities,
    filters,
}: {
    tutors: PaginatedTutors;
    specialities: Speciality[];
    filters: {
        speciality?: string;
        tag?: string;
        tutor?: string;
    };
}) {
    const [selectedSpeciality, setSelectedSpeciality] = useState(
        filters.speciality ?? '',
    );
    const [selectedTag, setSelectedTag] = useState(filters.tag ?? '');
    const [tutorName, setTutorName] = useState(filters.tutor ?? '');

    const tags = useMemo(() => {
        return specialities
            .filter((speciality) => speciality.title === selectedSpeciality)
            .flatMap((speciality) => speciality.tags);
    }, [specialities, selectedSpeciality]);

    const formRef = useRef<FormComponentSlotProps>(null);

    useEffect(() => {
        if (selectedSpeciality === (filters.speciality ?? '')) return;
        setTimeout(() => formRef.current?.submit(), 0);
    }, [filters.speciality, selectedSpeciality]);

    useEffect(() => {
        if (selectedTag === (filters.tag ?? '')) return;
        setTimeout(() => formRef.current?.submit(), 0);
    }, [filters.tag, selectedTag]);

    useEffect(() => {
        if (tutorName === (filters.tutor ?? '')) return;
        const handler = setTimeout(() => formRef.current?.submit(), 500);
        return () => clearTimeout(handler);
    }, [filters.tutor, tutorName]);

    const reset = () => {
        setSelectedSpeciality('');
        setSelectedTag('');
        setTutorName('');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Find a Tutor" />
            <div className="space-y-8 p-4 md:p-8">
                <Heading
                    title="Find a Tutor"
                    description="Search and filter tutors by speciality and name."
                />

                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Search className="h-5 w-5" />
                                Search Tutors
                            </CardTitle>
                            <CardDescription>
                                Narrow down your search to find the perfect
                                match.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form
                                {...index.form()}
                                ref={formRef}
                                className="grid gap-4 md:grid-cols-4"
                                options={{
                                    preserveState: true,
                                    preserveScroll: true,
                                }}
                            >
                                <Combobox
                                    label="Speciality"
                                    name="speciality"
                                    data={specialities.map((s) => ({
                                        label: s.title,
                                        value: s.title,
                                    }))}
                                    placeholder="Speciality"
                                    value={selectedSpeciality}
                                    setValue={setSelectedSpeciality}
                                />
                                <input
                                    type="hidden"
                                    name="speciality"
                                    value={selectedSpeciality}
                                />
                                <Combobox
                                    label="Tag"
                                    name="tag"
                                    data={tags.map((t) => ({
                                        label: t.title,
                                        value: t.title,
                                    }))}
                                    placeholder="Tag"
                                    value={selectedTag}
                                    setValue={setSelectedTag}
                                    disabled={!selectedSpeciality}
                                />
                                <input
                                    type="hidden"
                                    name="tag"
                                    value={selectedTag}
                                />
                                <Input
                                    placeholder="Tutor Name"
                                    name="tutor"
                                    value={tutorName}
                                    onChange={(e) =>
                                        setTutorName(e.target.value)
                                    }
                                />
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={reset}
                                >
                                    Reset
                                </Button>
                            </Form>
                        </CardContent>
                    </Card>

                    <div className="grid gap-6">
                        {tutors.data.length === 0 ? (
                            <Card className="col-span-full py-12">
                                <CardContent className="flex flex-col items-center justify-center text-center">
                                    <Users className="mb-4 h-12 w-12 text-muted-foreground/20" />
                                    <h3 className="text-lg font-semibold">
                                        No tutors found
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Try adjusting your filters to find
                                        available tutors.
                                    </p>
                                    <Button
                                        className="mt-4 cursor-pointer"
                                        onClick={reset}
                                        variant="secondary"
                                    >
                                        Clear all filters
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <>
                                <div className="grid gap-6 sm:grid-cols-2">
                                    {tutors.data.map((tutor) => (
                                        <TutorCard
                                            key={tutor.id}
                                            tutor={{
                                                id: tutor.id,
                                                name: tutor.user.name,
                                                country_code:
                                                    tutor.country?.code.toLowerCase(),
                                                specialities:
                                                    tutor.specialities.map(
                                                        (s) => s.title,
                                                    ),
                                                tags: tutor.tags.map(
                                                    (t) => t.title,
                                                ),
                                                reviews: 0,
                                                rating: 0,
                                                lessons: 0,
                                                image: tutor.user.image,
                                            }}
                                        />
                                    ))}
                                </div>
                                <Pagination links={tutors.links} />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
