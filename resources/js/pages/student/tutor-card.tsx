import { Button } from '@/components/ui/button';
import { GraduationCap, Star } from 'lucide-react';

const TutorCard = ({
    name,
    country_code,
    speciality,
    reviews,
    rating,
    lessons,
}: {
    name: string;
    country_code: string;
    speciality: string;
    reviews: number;
    rating: number;
    lessons: number;
}) => (
    <div className="flex gap-x-2 overflow-hidden rounded border border-gray-200 shadow-sm">
        <img
            src="https://plus.unsplash.com/premium_photo-1668319914124-57301e0a1850?q=80&w=1287&auto=format&fit=crop"
            alt="profile"
            className="size-56 object-cover"
        />

        <div className="flex flex-1 flex-col justify-between p-4">
            <div>
                <div className="flex items-center justify-between gap-x-4">
                    <h3 className="text-xl font-black whitespace-nowrap">
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
                        <GraduationCap className="size-5" />
                        <span className="">{speciality}</span>
                    </div>
                </div>

                <ul className="mt-4 flex gap-x-4">
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

                <Button size="lg" className="cursor-pointer">
                    Book $20/h
                </Button>
            </div>
        </div>
    </div>
);
export default TutorCard;
