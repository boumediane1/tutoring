import CompleteProfileController from '@/actions/App/Http/Controllers/CompleteProfileController';
import InputError from '@/components/input-error';
import { MultiSelect } from '@/components/multi-select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import Combobox from '@/pages/profile/Combobox';
import { SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface Tutor {
    country: {
        name: string;
    };
    languages: {
        language: string;
    }[];
    specialities: {
        title: string;
    }[];
    tags: {
        title: string;
    }[];
}

interface Props {
    tutor: Tutor;
    countries: { name: string }[];
    languages: { id: number; language: string }[];
    specialities: {
        id: number;
        title: string;
        tags: { id: number; title: string }[];
    }[];
}

const Complete = ({ tutor, countries, languages, specialities }: Props) => {
    const [selectedCountry, setSelectedCountry] = useState(tutor.country.name);
    const [selectedLanguages, setSelectedLanguages] = useState(
        tutor.languages.map((l) => l.language),
    );
    const [selectedSpecialities, setSelectedSpecialities] = useState(
        tutor.specialities.map((s) => s.title),
    );
    const [selectedTags, setSelectedTags] = useState(
        tutor.tags.map((t) => t.title),
    );
    const { auth } = usePage<SharedData>().props;

    const tags = specialities
        .filter((speciality) => selectedSpecialities.includes(speciality.title))
        .flatMap((speciality) =>
            speciality.tags.map((tag) => ({
                ...tag,
                selected: tutor.tags
                    .map((tag) => tag.title)
                    .includes(tag.title),
            })),
        );

    return (
        <AppLayout>
            <Head title="Dashboard" />

            <div className="grid grid-cols-2 p-4">
                <Form
                    action={CompleteProfileController.update().url}
                    method={CompleteProfileController.update().method}
                    options={{
                        preserveScroll: true,
                    }}
                    transform={(data) => ({
                        ...data,
                        country: selectedCountry,
                        languages: selectedLanguages,
                        specialities: selectedSpecialities,
                        tags: selectedTags,
                    })}
                    className="space-y-6"
                >
                    {({ errors, processing, recentlySuccessful }) => {
                        return (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>

                                    <Input
                                        id="name"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.name}
                                        name="name"
                                        autoComplete="name"
                                        placeholder="Full name"
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.name}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email address</Label>

                                    <Input
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.email}
                                        name="email"
                                        required
                                        autoComplete="username"
                                        placeholder="Email address"
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.email}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="bio">
                                        Bio{' '}
                                        <span className="text-gray-500">
                                            (optional)
                                        </span>
                                    </Label>

                                    <Textarea name="bio"></Textarea>

                                    <InputError
                                        className="mt-2"
                                        message={errors.bio}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="country">Country</Label>

                                    <Combobox
                                        data={countries.map((country) => ({
                                            value: country.name,
                                            label: country.name,
                                        }))}
                                        placeholder="Choose country..."
                                        value={selectedCountry}
                                        setValue={setSelectedCountry}
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.country}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="languages">
                                        Spoken languages
                                    </Label>

                                    <MultiSelect
                                        options={languages.map((language) => ({
                                            value: language.language,
                                            label: language.language,
                                        }))}
                                        defaultValue={selectedLanguages}
                                        onValueChange={setSelectedLanguages}
                                        placeholder="Choose lanagues..."
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.languages}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="languages">
                                        Specialities
                                    </Label>

                                    <MultiSelect
                                        options={specialities.map(
                                            (speciality) => ({
                                                value: speciality.title,
                                                label: speciality.title,
                                            }),
                                        )}
                                        defaultValue={selectedSpecialities}
                                        onValueChange={setSelectedSpecialities}
                                        placeholder="Choose tags..."
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.specialities}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="languages">Tags</Label>

                                    <MultiSelect
                                        options={tags.map((tag) => ({
                                            value: tag.title,
                                            label: tag.title,
                                        }))}
                                        defaultValue={tags
                                            .filter((tag) => tag.selected)
                                            .map((tag) => tag.title)}
                                        onValueChange={setSelectedTags}
                                        placeholder="Choose tags..."
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.tags}
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <Button
                                        disabled={processing}
                                        data-test="update-profile-button"
                                        className="cursor-pointer"
                                    >
                                        Save
                                    </Button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-neutral-600">
                                            Saved
                                        </p>
                                    </Transition>
                                </div>
                            </>
                        );
                    }}
                </Form>
            </div>
        </AppLayout>
    );
};

export default Complete;
