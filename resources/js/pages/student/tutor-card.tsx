import { index } from '@/actions/App/Http/Controllers/BookingController';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { GraduationCap, Star } from 'lucide-react';

const TutorCard = ({
    id,
    name,
    country_code,
    specialities,
    tags,
    reviews,
    rating,
    lessons,
    image,
}: {
    id: number;
    name: string;
    country_code?: string;
    specialities: string[];
    tags: string[];
    reviews: number;
    rating: number;
    lessons: number;
    image: string;
}) => (
    <div className="flex gap-x-2 overflow-hidden rounded border border-gray-200 shadow-sm">
        <img src={image} alt="profile" className="size-64 object-cover" />

        <div className="flex flex-1 flex-col justify-between p-4">
            <div>
                <div className="flex items-center justify-between gap-x-4">
                    <h3 className="text-2xl font-black whitespace-nowrap">
                        {name}
                    </h3>

                    <div className="rounded-full">
                        <span
                            className={`fi fi-${country_code} fis rounded-full text-xl`}
                        ></span>
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-x-2 text-gray-700">
                        <GraduationCap className="size-4" />
                        <span className="text-sm">
                            {specialities.join(', ')}
                        </span>
                    </div>
                </div>

                <div className="mt-4 space-x-1">
                    {tags.map((tag) => (
                        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 inset-ring inset-ring-green-600/20">
                            {tag}
                        </span>
                    ))}
                </div>

                <ul className="mt-4 flex gap-x-4 text-sm">
                    <li>
                        <div className="flex items-center gap-x-1">
                            <span className="font-bold">{rating}</span>
                            <Star className="size-4" />
                        </div>
                        <div className="whitespace-nowrap text-gray-700">
                            {reviews} reviews
                        </div>
                    </li>

                    <li>
                        <div className="font-bold">{lessons}</div>
                        <div className="text-gray-700">lessons</div>
                    </li>
                </ul>
            </div>

            <div className="flex flex-col justify-between">
                <div className="space-y-2"></div>

                <Button size="lg" className="cursor-pointer" asChild>
                    <Link href={index.url(id)}>Book $20/h</Link>
                </Button>
            </div>
        </div>
    </div>
);
export default TutorCard;
