import React from 'react';
import { Star, MessageCircle, ThumbsUp, Calendar, Building } from 'lucide-react';
import WorkerLayout from '../../components/worker/WorkerLayout';

const WorkerRatings = () => {
    const reviews = [
        {
            id: 1,
            employer: 'Hotel Himalaya',
            job: 'Kitchen Helper',
            rating: 5,
            date: 'Jan 26, 2026',
            comment: 'Excellent work! Very punctual and hardworking. Would definitely hire again.',
            helpful: 3
        },
        {
            id: 2,
            employer: 'Marriott Hotel',
            job: 'Event Staff',
            rating: 5,
            date: 'Jan 24, 2026',
            comment: 'Great attitude and professional service. Handled guests with care.',
            helpful: 5
        },
        {
            id: 3,
            employer: 'Daraz Nepal',
            job: 'Warehouse Helper',
            rating: 4,
            date: 'Jan 22, 2026',
            comment: 'Good work overall. Could improve on speed but reliable.',
            helpful: 2
        },
        {
            id: 4,
            employer: 'Cafe Mitra',
            job: 'Restaurant Server',
            rating: 5,
            date: 'Jan 20, 2026',
            comment: 'Outstanding customer service! Customers loved the service.',
            helpful: 8
        },
    ];

    const ratingBreakdown = [
        { stars: 5, count: 18, percentage: 75 },
        { stars: 4, count: 4, percentage: 17 },
        { stars: 3, count: 2, percentage: 8 },
        { stars: 2, count: 0, percentage: 0 },
        { stars: 1, count: 0, percentage: 0 },
    ];

    return (
        <WorkerLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#032A33] mb-2">Ratings & Reviews</h1>
                    <p className="text-[#888888]">See what employers say about your work</p>
                </div>

                {/* Overall Rating Card */}
                <div className="glass-card rounded-2xl p-8 mb-8 animate-fade-in-up">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Big Rating */}
                        <div className="text-center">
                            <p className="text-6xl font-bold text-[#032A33] mb-2">4.9</p>
                            <div className="flex items-center gap-1 justify-center mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={24} className="text-yellow-500 fill-yellow-500" />
                                ))}
                            </div>
                            <p className="text-[#888888]">Based on 24 reviews</p>
                        </div>

                        {/* Rating Breakdown */}
                        <div className="flex-1 w-full">
                            {ratingBreakdown.map((item) => (
                                <div key={item.stars} className="flex items-center gap-3 mb-2">
                                    <span className="text-sm text-[#032A33] w-8">{item.stars} ★</span>
                                    <div className="flex-1 h-3 bg-[#D3E4E7] rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-yellow-500 rounded-full transition-all duration-500"
                                            style={{ width: `${item.percentage}%` }}
                                        />
                                    </div>
                                    <span className="text-sm text-[#888888] w-8">{item.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                    {reviews.map((review, index) => (
                        <div
                            key={review.id}
                            className="glass-card rounded-2xl p-6 animate-fade-in-up"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0B4B54] to-[#82ACAB] flex items-center justify-center text-white font-bold text-lg">
                                        {review.employer.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-[#032A33]">{review.employer}</h4>
                                        <p className="text-sm text-[#888888]">{review.job}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1 mb-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={16}
                                                className={i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-[#888888]">{review.date}</span>
                                </div>
                            </div>

                            <p className="text-[#032A33] mb-4">"{review.comment}"</p>

                            <div className="flex items-center gap-4 pt-4 border-t border-[#82ACAB]/20">
                                <button className="flex items-center gap-2 text-sm text-[#888888] hover:text-[#0B4B54] transition-colors">
                                    <ThumbsUp size={16} />
                                    Helpful ({review.helpful})
                                </button>
                                <button className="flex items-center gap-2 text-sm text-[#888888] hover:text-[#0B4B54] transition-colors">
                                    <MessageCircle size={16} />
                                    Reply
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </WorkerLayout>
    );
};

export default WorkerRatings;
