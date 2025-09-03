import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { router } from "@inertiajs/react";
import ReviewList from "@/Components/Molecules/ReviewList";
import ReviewSummary from "@/Components/Molecules/ReviewSummary";
import ReviewModal from "@/Components/Molecules/ReviewModal";

import { useTranslation } from "react-i18next";


export default function Review({ productId, initialReviews, summary, userReview }) {

    const { t, i18n } = useTranslation();

    const [reviews, setReviews] = useState(initialReviews.data);
    const [page, setPage] = useState(2);
    const [hasMore, setHasMore] = useState(initialReviews.current_page < initialReviews.last_page);
    const isLoading = false;

    // Fetch next page reviews
    const fetchMoreReviews = async () => {
        router.get(
            `/product/${productId}`,
            { page },
            {
                preserveScroll: true,
                preserveState: true,
                only: ['reviews'],
                onSuccess: (pageProps) => {
                    const newReviews = pageProps.props.reviews.data;
                    setReviews(prev => [...prev, ...newReviews]);
                    setPage(prev => prev + 1);
                    setHasMore(pageProps.props.reviews.current_page < pageProps.props.reviews.last_page);
                }
            }
        );
    };

    return (
        <>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-20 mt-10">
                <ReviewSummary
                    isLoading={isLoading}
                    summary={summary}
                    userReview={userReview}
                />

                {(!summary || Object.keys(summary).length === 0) ? (
                    <div className="flex justify-center text-center items-center w-full">
                        {t("home.noReviews")}
                    </div>
                ) : (
                    <InfiniteScroll
                        dataLength={reviews.length}
                        next={fetchMoreReviews}
                        hasMore={hasMore}
                        loader={<p className="text-center">Loading...</p>}
                        scrollableTarget={null}
                    >
                        <ReviewList reviews={reviews} isLoading={isLoading} />
                    </InfiniteScroll>
                )}
            </div>
        </>
    );
}