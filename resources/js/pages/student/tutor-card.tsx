import { index } from '@/actions/App/Http/Controllers/BookingController';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { GraduationCap, Star, Users } from 'lucide-react';

const TutorCard = ({
    tutor,
}: {
    tutor: {
        id: number;
        name: string;
        country_code?: string;
        specialities: string[];
        tags: string[];
        reviews: number;
        rating: number;
        lessons: number;
        image: string;
    };
}) => {
    const {
        id,
        name,
        country_code,
        specialities = [],
        tags = [],
        reviews = 0,
        rating = 0,
        lessons = 0,
        image,
    } = tutor;

    return (
        <Card className="flex h-72 flex-col gap-x-2 overflow-hidden p-0 transition-all hover:shadow-md md:flex-row">
            <img
                src={image}
                alt={name}
                className="h-full w-full shrink-0 object-cover md:w-64"
            />

            <div className="flex flex-1 flex-col justify-between p-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-black tracking-tight">
                            {name}
                        </h3>
                        {country_code && (
                            <span
                                className={`fi fi-${country_code} fis rounded-sm text-lg shadow-sm`}
                            ></span>
                        )}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <GraduationCap className="h-4 w-4" />
                        <span className="line-clamp-1">
                            {specialities.join(', ') || 'Expert Tutor'}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/50 p-3">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-sm font-medium">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span>{rating.toFixed(1)}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                                {reviews} reviews
                            </span>
                        </div>
                        <div className="flex flex-col gap-1 border-l pl-4">
                            <div className="flex items-center gap-1.5 text-sm font-medium">
                                <Users className="h-4 w-4 text-blue-500" />
                                <span>{lessons}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                                lessons
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                        {tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                            >
                                {tag}
                            </span>
                        ))}
                        {tags.length > 3 && (
                            <span className="self-center text-xs text-muted-foreground">
                                +{tags.length - 3} more
                            </span>
                        )}
                    </div>
                </div>

                <div className="mt-4">
                    <Button className="w-full cursor-pointer" asChild>
                        <Link href={index.url(id)}>Book Session — $20/h</Link>
                    </Button>
                </div>
            </div>
        </Card>
    );
};
export default TutorCard;
