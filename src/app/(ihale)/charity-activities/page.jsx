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

export default function CharityActivities() {
    const [activities, setActivities] = useState([]);
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
        categoryId: undefined,
        providerId: undefined,
        search: '',
    });

    const fetchActivities = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const params = {
                page: pagination.page,
                limit: pagination.limit,
                ...(filters.categoryId && { categoryId: filters.categoryId }),
                ...(filters.providerId && { providerId: filters.providerId }),
                ...(filters.search && { search: filters.search }),
            };
            const response = await axios.get('/admin/charity-activities', { params });
            setActivities(response.data.data || []);
            if (response.data.pagination) {
                setPagination(response.data.pagination);
            }
        } catch (err) {
            console.error('Error fetching charity activities:', err);
            setError('Hayır işleri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, [pagination.page, filters.categoryId, filters.providerId, filters.search]);

    const handleDelete = async (id) => {
        if (!window.confirm('Bu hayır işini silmek istediğinize emin misiniz?')) {
            return;
        }
        
        setDeleteInProgress(prev => ({ ...prev, [id]: true }));
        
        try {
            await axios.delete(`/admin/charity-activities/${id}`);
            fetchActivities();
        } catch (err) {
            console.error('Error deleting charity activity:', err);
            alert('Hayır işi silinirken bir hata oluştu.');
        } finally {
            setDeleteInProgress(prev => ({ ...prev, [id]: false }));
        }
    };

    if (isLoading) {
        return (
            <div>
                <PageBreadcrumb pageTitle="Hayır İşleri Yönetimi" />
                <div className="flex justify-center items-center h-64">
                    <Icon icon="eos-icons:loading" className="text-4xl text-primary" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <PageBreadcrumb pageTitle="Hayır İşleri Yönetimi" />
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
            <PageBreadcrumb pageTitle="Hayır İşleri Yönetimi" />
            <div className="space-y-6">
                <ComponentCard 
                    title="Hayır İşleri"
                    titleRightRenderer={
                        <Link href="/charity-activities/add">
                            <Button className="bg-primary text-white px-4 py-2">
                                Ekle
                            </Button>
                        </Link>
                    }
                >
                    <div className="mb-4 flex flex-col sm:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="Ara..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            className="flex-1 rounded-md border border-input bg-background px-3 py-2"
                        />
                    </div>
                    <TableContainer
                        data={activities}
                        navItems={["Başlık", "Sağlayıcı", "Kategori", "Adres", "Tahmini Bitiş", "Oluşturulma", "İşlemler"]}
                        renderItem={(activity) => (
                            <TableRow key={activity.id}>
                                <TableCell className="px-5 py-4 sm:px-6 text-start font-medium">
                                    <div className="max-w-xs truncate" title={activity.title}>
                                        {activity.title}
                                    </div>
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {activity.provider ? (
                                        <Link href={`/users/edit/${activity.provider.id}`} className="flex items-center gap-2 text-primary hover:underline">
                                            {activity.provider.profileImage && (
                                                <img 
                                                    src={activity.provider.profileImage} 
                                                    alt={activity.provider.name || "Sağlayıcı"}
                                                    className="w-8 h-8 rounded-full"
                                                />
                                            )}
                                            <span className="text-sm">
                                                {activity.provider.name || activity.provider.phoneNumber || "Sağlayıcı"}
                                            </span>
                                        </Link>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {activity.category ? (
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                {activity.category.icon && (
                                                    <Icon icon={activity.category.icon} className="text-lg" />
                                                )}
                                                <span className="text-sm font-medium">{activity.category.name}</span>
                                            </div>
                                            {activity.category.parent && (
                                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 ml-7">
                                                    <span>Üst:</span>
                                                    {activity.category.parent.icon && (
                                                        <Icon icon={activity.category.parent.icon} className="text-sm" />
                                                    )}
                                                    <span>{activity.category.parent.name}</span>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    <div className="max-w-xs truncate" title={activity.address}>
                                        {activity.address || <span className="text-gray-400">-</span>}
                                    </div>
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start text-sm text-gray-500 dark:text-gray-400">
                                    {activity.estimatedEndTime 
                                        ? new Date(activity.estimatedEndTime).toLocaleDateString('tr-TR')
                                        : "-"}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(activity.createdAt).toLocaleDateString('tr-TR')}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start flex gap-2">
                                    <Link href={`/charity-activities/${activity.id}`}>
                                        <Button size="sm" variant="info" className="flex items-center justify-center">
                                            <Icon icon="ri:eye-line" className="text-base" />
                                        </Button>
                                    </Link>
                                    <Link href={`/charity-activities/edit/${activity.id}`}>
                                        <Button size="sm" variant="info" className="flex items-center justify-center">
                                            <Icon icon="ri:edit-line" className="text-base" />
                                        </Button>
                                    </Link>
                                    <Button 
                                        size="sm" 
                                        variant="danger" 
                                        className="flex items-center justify-center"
                                        onClick={() => handleDelete(activity.id)}
                                        disabled={deleteInProgress[activity.id]}
                                    >
                                        {deleteInProgress[activity.id] ? (
                                            <Icon icon="eos-icons:loading" className="text-base" />
                                        ) : (
                                            <Icon icon="ri:delete-bin-line" className="text-base" />
                                        )}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )}
                        emptyMessage="Henüz hayır işi bulunmamaktadır"
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

