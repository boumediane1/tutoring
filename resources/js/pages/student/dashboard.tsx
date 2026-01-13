import { index } from '@/actions/App/Http/Controllers/Student/DashboardController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import Combobox from '@/pages/profile/Combobox';
import TutorCard from '@/pages/student/tutor-card';
import { dashboard } from '@/routes/student';
import { type BreadcrumbItem } from '@/types';
import { FormComponentSlotProps } from '@inertiajs/core';
import { Form, Head } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
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

export default function Dashboard({
    tutors,
    specialities,
}: {
    tutors: {
        id: number;
        user: { name: string; image: string };
        country?: { code: string };
        specialities: Speciality[];
        tags: Tag[];
    }[];
    specialities: Speciality[];
}) {
    const params = useMemo(
        () => new URLSearchParams(window.location.search),
        [],
    );

    const [selectedSpeciality, setSelectedSpeciality] = useState(
        params.get('speciality') ?? '',
    );
    const [selectedTag, setSelectedTag] = useState(params.get('tag') ?? '');
    const [tutorName, setTutorName] = useState(params.get('tutor') ?? '');

    const tags = specialities
        .filter((speciality) => speciality.title === selectedSpeciality)
        .flatMap((speciality) => speciality.tags);

    const formRef = useRef<FormComponentSlotProps>(null);

    useEffect(() => {
        if (selectedSpeciality === params.get('speciality')) return;
        formRef.current?.submit();
    }, [params, selectedSpeciality]);

    useEffect(() => {
        if (selectedTag === params.get('tag')) return;
        formRef.current?.submit();
    }, [params, selectedTag]);

    useEffect(() => {
        if (tutorName === params.get('tutor')) return;
        formRef.current?.submit();
    }, [params, tutorName]);

    const reset = () => {
        setSelectedSpeciality('');
        setSelectedTag('');
        setTutorName('');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="p-4">
                <Form
                    className="flex space-y-8 gap-x-4"
                    ref={formRef}
                    action={index().url}
                    method={index().method}
                    options={{ preserveState: true, preserveScroll: true }}
                    transform={(data) => ({
                        ...data,
                        speciality: selectedSpeciality,
                        tag: selectedTag,
                        tutor: tutorName,
                    })}
                >
                    <Combobox
                        data={specialities.map((speciality) => ({
                            value: speciality.title,
                            label: speciality.title,
                        }))}
                        placeholder="Choose speciality..."
                        value={selectedSpeciality}
                        setValue={setSelectedSpeciality}
                    />

                    <Combobox
                        data={tags.map((tag) => ({
                            value: tag.title,
                            label: tag.title,
                        }))}
                        placeholder="Choose tag..."
                        value={selectedTag}
                        setValue={setSelectedTag}
                    />

                    <Input
                        type="text"
                        placeholder="Search tutor..."
                        value={tutorName}
                        onChange={(e) => setTutorName(e.target.value)}
                    />

                    <Button onClick={reset} className="cursor-pointer">
                        Reset filters
                    </Button>
                </Form>

                <div className="grid grid-cols-2 gap-4">
                    {tutors.map((tutor, index) => (
                        <TutorCard
                            key={index}
                            id={tutor.id}
                            name={tutor.user.name}
                            country_code={tutor.country?.code.toLowerCase()}
                            tags={tutor.tags.map((t) => t.title)}
                            specialities={tutor.specialities.map(
                                (s) => s.title,
                            )}
                            reviews={120}
                            rating={4.9}
                            lessons={300}
                            image={tutor.user.image}
                        />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
