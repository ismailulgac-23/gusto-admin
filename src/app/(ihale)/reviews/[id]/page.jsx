"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "@/axios";
import Link from "next/link";

export default function ReviewDetail() {
    const router = useRouter();
    const params = useParams();
    const id = params.id;
    const [review, setReview] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchReview();
    }, [id]);

    const fetchReview = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            // Since there's no GET /reviews/:id endpoint, we'll need to get it from the list
            const response = await axios.get('/admin/reviews');
            const reviews = response.data.data || response.data || [];
            const foundReview = reviews.find(r => r.id === id);
            if (foundReview) {
                setReview(foundReview);
            } else {
                setError('Değerlendirme bulunamadı');
            }
        } catch (err) {
            console.error('Error fetching review:', err);
            setError('Değerlendirme yüklenirken bir hata oluştu.');
        } finally {
            setIsLoading(false);
        }
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Icon 
                key={i} 
                icon={i < rating ? "ri:star-fill" : "ri:star-line"} 
                className={i < rating ? "text-yellow-400 text-2xl" : "text-gray-300 text-2xl"}
            />
        ));
    };

    if (isLoading) {
        return (
            <div>
                <PageBreadcrumb pageTitle="Değerlendirme Detayı" />
                <div className="flex justify-center items-center h-64">
                    <Icon icon="eos-icons:loading" className="text-4xl text-primary" />
                </div>
            </div>
        );
    }

    if (error || !review) {
        return (
            <div>
                <PageBreadcrumb pageTitle="Değerlendirme Detayı" />
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <div className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
                            <p>{error || 'Değerlendirme bulunamadı'}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <PageBreadcrumb pageTitle="Değerlendirme Detayı" />
            <div className="space-y-6">
                <ComponentCard title="Değerlendirme Bilgileri">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Puan
                            </label>
                            <div className="flex items-center gap-2">
                                {renderStars(review.rating)}
                                <span className="text-lg font-medium">{review.rating}/5</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Tarih
                            </label>
                            <p className="text-gray-900 dark:text-white text-sm">
                                {new Date(review.createdAt).toLocaleString('tr-TR')}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Değerlendiren
                            </label>
                            {review.reviewer ? (
                                <Link href={`/users/edit/${review.reviewer.id}`} className="flex items-center gap-2 text-primary hover:underline">
                                    {review.reviewer.profileImage && (
                                        <img 
                                            src={review.reviewer.profileImage} 
                                            alt={review.reviewer.name || "Kullanıcı"}
                                            className="w-8 h-8 rounded-full"
                                        />
                                    )}
                                    <span>{review.reviewer.name || review.reviewer.phoneNumber || "Kullanıcı"}</span>
                                </Link>
                            ) : (
                                <span className="text-gray-400">-</span>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Değerlendirilen
                            </label>
                            {review.reviewedUser ? (
                                <Link href={`/users/edit/${review.reviewedUser.id}`} className="flex items-center gap-2 text-primary hover:underline">
                                    {review.reviewedUser.profileImage && (
                                        <img 
                                            src={review.reviewedUser.profileImage} 
                                            alt={review.reviewedUser.name || "Kullanıcı"}
                                            className="w-8 h-8 rounded-full"
                                        />
                                    )}
                                    <span>{review.reviewedUser.name || review.reviewedUser.phoneNumber || "Kullanıcı"}</span>
                                </Link>
                            ) : (
                                <span className="text-gray-400">-</span>
                            )}
                        </div>
                        {review.comment && (
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                    Yorum
                                </label>
                                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                    {review.comment}
                                </p>
                            </div>
                        )}
                    </div>
                </ComponentCard>
            </div>
        </div>
    );
}

