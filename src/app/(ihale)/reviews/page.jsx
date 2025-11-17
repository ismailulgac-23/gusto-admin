"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TableContainer from "@/components/royal-common/Table";
import Button from "@/components/ui/button/Button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Icon } from "@iconify/react/dist/iconify.js";
import ComponentCard from "@/components/common/ComponentCard";
import axios from "@/axios";

export default function Reviews() {
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteInProgress, setDeleteInProgress] = useState({});
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
    });
    const [filters, setFilters] = useState({
        rating: undefined,
        reviewedUserId: undefined,
        reviewerId: undefined,
    });

    const fetchReviews = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const params = {
                page: pagination.page,
                limit: pagination.limit,
                ...(filters.rating && { rating: filters.rating }),
                ...(filters.reviewedUserId && { reviewedUserId: filters.reviewedUserId }),
                ...(filters.reviewerId && { reviewerId: filters.reviewerId }),
            };
            const response = await axios.get('/admin/reviews', { params });
            setReviews(response.data.data || []);
            if (response.data.pagination) {
                setPagination(response.data.pagination);
            }
        } catch (err) {
            console.error('Error fetching reviews:', err);
            setError('Değerlendirmeler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [pagination.page, filters.rating, filters.reviewedUserId, filters.reviewerId]);

    const handleDelete = async (id) => {
        if (!window.confirm('Bu değerlendirmeyi silmek istediğinize emin misiniz?')) {
            return;
        }
        
        setDeleteInProgress(prev => ({ ...prev, [id]: true }));
        
        try {
            await axios.delete(`/admin/reviews/${id}`);
            fetchReviews();
        } catch (err) {
            console.error('Error deleting review:', err);
            alert('Değerlendirme silinirken bir hata oluştu.');
        } finally {
            setDeleteInProgress(prev => ({ ...prev, [id]: false }));
        }
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Icon 
                key={i} 
                icon={i < rating ? "ri:star-fill" : "ri:star-line"} 
                className={i < rating ? "text-yellow-400" : "text-gray-300"}
            />
        ));
    };

    if (isLoading) {
        return (
            <div>
                <PageBreadcrumb pageTitle="Değerlendirme Yönetimi" />
                <div className="flex justify-center items-center h-64">
                    <Icon icon="eos-icons:loading" className="text-4xl text-primary" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <PageBreadcrumb pageTitle="Değerlendirme Yönetimi" />
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <div className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
                            <p>{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <PageBreadcrumb pageTitle="Değerlendirme Yönetimi" />
            <div className="space-y-6">
                <ComponentCard title="Değerlendirmeler">
                    <div className="mb-4 flex flex-col sm:flex-row gap-4">
                        <select
                            value={filters.rating || 'all'}
                            onChange={(e) => setFilters({ ...filters, rating: e.target.value === 'all' ? undefined : parseInt(e.target.value) })}
                            className="rounded-md border border-input bg-background px-3 py-2"
                        >
                            <option value="all">Tüm Puanlar</option>
                            <option value="5">5 Yıldız</option>
                            <option value="4">4 Yıldız</option>
                            <option value="3">3 Yıldız</option>
                            <option value="2">2 Yıldız</option>
                            <option value="1">1 Yıldız</option>
                        </select>
                    </div>
                    <TableContainer
                        data={reviews}
                        navItems={["Değerlendiren", "Değerlendirilen", "Puan", "Yorum", "Tarih", "İşlemler"]}
                        renderItem={(review) => (
                            <TableRow key={review.id}>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {review.reviewer ? (
                                        <Link href={`/users/edit/${review.reviewer.id}`} className="flex items-center gap-2 text-primary hover:underline">
                                            {review.reviewer.profileImage && (
                                                <img 
                                                    src={review.reviewer.profileImage} 
                                                    alt={review.reviewer.name || "Kullanıcı"}
                                                    className="w-8 h-8 rounded-full"
                                                />
                                            )}
                                            <span className="text-sm">
                                                {review.reviewer.name || review.reviewer.phoneNumber || "Kullanıcı"}
                                            </span>
                                        </Link>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {review.reviewedUser ? (
                                        <Link href={`/users/edit/${review.reviewedUser.id}`} className="flex items-center gap-2 text-primary hover:underline">
                                            {review.reviewedUser.profileImage && (
                                                <img 
                                                    src={review.reviewedUser.profileImage} 
                                                    alt={review.reviewedUser.name || "Kullanıcı"}
                                                    className="w-8 h-8 rounded-full"
                                                />
                                            )}
                                            <span className="text-sm">
                                                {review.reviewedUser.name || review.reviewedUser.phoneNumber || "Kullanıcı"}
                                            </span>
                                        </Link>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    <div className="flex items-center gap-1">
                                        {renderStars(review.rating)}
                                        <span className="ml-2 text-sm font-medium">{review.rating}/5</span>
                                    </div>
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    <div className="max-w-xs truncate" title={review.comment || "-"}>
                                        {review.comment || <span className="text-gray-400">-</span>}
                                    </div>
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(review.createdAt).toLocaleDateString('tr-TR')}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start flex gap-2">
                                    <Link href={`/reviews/${review.id}`}>
                                        <Button size="sm" variant="info" className="flex items-center justify-center">
                                            <Icon icon="ri:eye-line" className="text-base" />
                                        </Button>
                                    </Link>
                                    <Button 
                                        size="sm" 
                                        variant="danger" 
                                        className="flex items-center justify-center"
                                        onClick={() => handleDelete(review.id)}
                                        disabled={deleteInProgress[review.id]}
                                    >
                                        {deleteInProgress[review.id] ? (
                                            <Icon icon="eos-icons:loading" className="text-base" />
                                        ) : (
                                            <Icon icon="ri:delete-bin-line" className="text-base" />
                                        )}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )}
                        emptyMessage="Henüz değerlendirme bulunmamaktadır"
                    />
                    {pagination.totalPages > 1 && (
                        <div className="mt-4 flex items-center justify-between">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Toplam {pagination.total} kayıt, Sayfa {pagination.page} / {pagination.totalPages}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                                    disabled={pagination.page === 1}
                                >
                                    Önceki
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                                    disabled={pagination.page >= pagination.totalPages}
                                >
                                    Sonraki
                                </Button>
                            </div>
                        </div>
                    )}
                </ComponentCard>
            </div>
        </div>
    );
}

