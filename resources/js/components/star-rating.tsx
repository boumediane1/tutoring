import ReviewController from '@/actions/App/Http/Controllers/ReviewController';
import { router } from '@inertiajs/react';
import { Star } from 'lucide-react';
import { useState } from 'react';

interface StarRatingProps {
    bookingId: number;
    initialRating?: number;
    readonly?: boolean;
}

export default function StarRating({
    bookingId,
    initialRating = 0,
    readonly = false,
}: StarRatingProps) {
    const [rating, setRating] = useState(initialRating);
    const [hover, setHover] = useState(0);

    const handleRating = (value: number) => {
        if (readonly) {
            return;
        }

        if (
            window.confirm(
                `Are you sure you want to rate this tutor ${value} stars?`,
            )
        ) {
            setRating(value);
            router.post(
                ReviewController.store(),
                {
                    booking_id: bookingId,
                    rating: value,
                },
                {
                    preserveScroll: true,
                },
            );
        }
    };

    return (
        <div
            className="flex items-center gap-1"
            onClick={(e) => e.preventDefault()}
        >
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={readonly}
                    className={`${readonly ? 'cursor-default' : 'cursor-pointer'} transition-colors duration-200`}
                    onMouseEnter={() => !readonly && setHover(star)}
                    onMouseLeave={() => !readonly && setHover(0)}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleRating(star);
                    }}
                >
                    <Star
                        size={20}
                        className={`${
                            star <= (hover || rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-transparent text-gray-300'
                        } transition-colors duration-200`}
                    />
                </button>
            ))}
        </div>
    );
}
