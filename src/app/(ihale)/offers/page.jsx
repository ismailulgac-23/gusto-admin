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

export default function Offers() {
    const [offers, setOffers] = useState([]);
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
        status: undefined,
        demandId: undefined,
        providerId: undefined,
    });

    const fetchOffers = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const params = {
                page: pagination.page,
                limit: pagination.limit,
                ...(filters.status && { status: filters.status }),
                ...(filters.demandId && { demandId: filters.demandId }),
                ...(filters.providerId && { providerId: filters.providerId }),
            };
            const response = await axios.get('/admin/offers', { params });
            setOffers(response.data.data || []);
            if (response.data.pagination) {
                setPagination(response.data.pagination);
            }
        } catch (err) {
            console.error('Error fetching offers:', err);
            setError('Teklifler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOffers();
    }, [pagination.page, filters.status, filters.demandId, filters.providerId]);

    const handleDelete = async (id) => {
        if (!window.confirm('Bu teklifi silmek istediğinize emin misiniz?')) {
            return;
        }
        
        setDeleteInProgress(prev => ({ ...prev, [id]: true }));
        
        try {
            await axios.delete(`/admin/offers/${id}`);
            fetchOffers();
        } catch (err) {
            console.error('Error deleting offer:', err);
            alert('Teklif silinirken bir hata oluştu.');
        } finally {
            setDeleteInProgress(prev => ({ ...prev, [id]: false }));
        }
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            PENDING: { label: "Beklemede", class: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400" },
            ACCEPTED: { label: "Kabul Edildi", class: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" },
            REJECTED: { label: "Reddedildi", class: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400" },
            COMPLETED: { label: "Tamamlandı", class: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400" },
        };
        const statusInfo = statusMap[status] || statusMap.PENDING;
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.class}`}>
                {statusInfo.label}
            </span>
        );
    };

    if (isLoading) {
        return (
            <div>
                <PageBreadcrumb pageTitle="Teklif Yönetimi" />
                <div className="flex justify-center items-center h-64">
                    <Icon icon="eos-icons:loading" className="text-4xl text-primary" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <PageBreadcrumb pageTitle="Teklif Yönetimi" />
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
            <PageBreadcrumb pageTitle="Teklif Yönetimi" />
            <div className="space-y-6">
                <ComponentCard 
                    title="Teklifler"
                    titleRightRenderer={
                        <Link href="/offers/add">
                            <Button className="bg-primary text-white px-4 py-2">
                                Ekle
                            </Button>
                        </Link>
                    }
                >
                    <div className="mb-4 flex flex-col sm:flex-row gap-4">
                        <select
                            value={filters.status || 'all'}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value === 'all' ? undefined : e.target.value })}
                            className="rounded-md border border-input bg-background px-3 py-2"
                        >
                            <option value="all">Tüm Durumlar</option>
                            <option value="PENDING">Beklemede</option>
                            <option value="ACCEPTED">Kabul Edildi</option>
                            <option value="REJECTED">Reddedildi</option>
                            <option value="COMPLETED">Tamamlandı</option>
                        </select>
                    </div>
                    <TableContainer
                        data={offers}
                        navItems={["Talep", "Sağlayıcı", "Mesaj", "Fiyat", "Tahmini Süre", "Durum", "Oluşturulma", "İşlemler"]}
                        renderItem={(offer) => (
                            <TableRow key={offer.id}>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {offer.demand ? (
                                        <Link href={`/demands/${offer.demand.id}`} className="text-primary hover:underline">
                                            <div className="max-w-xs truncate" title={offer.demand.title}>
                                                {offer.demand.title}
                                            </div>
                                        </Link>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {offer.provider ? (
                                        <Link href={`/users/edit/${offer.provider.id}`} className="flex items-center gap-2 text-primary hover:underline">
                                            {offer.provider.profileImage && (
                                                <img 
                                                    src={offer.provider.profileImage} 
                                                    alt={offer.provider.name || "Sağlayıcı"}
                                                    className="w-8 h-8 rounded-full"
                                                />
                                            )}
                                            <span className="text-sm">
                                                {offer.provider.name || offer.provider.phoneNumber || "Sağlayıcı"}
                                            </span>
                                        </Link>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    <div className="max-w-xs truncate" title={offer.message || "-"}>
                                        {offer.message || <span className="text-gray-400">-</span>}
                                    </div>
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {offer.price ? `${offer.price} ₺` : "-"}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {offer.estimatedTime || <span className="text-gray-400">-</span>}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {getStatusBadge(offer.status)}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(offer.createdAt).toLocaleDateString('tr-TR')}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start flex gap-2">
                                    <Link href={`/offers/${offer.id}`}>
                                        <Button size="sm" variant="info" className="flex items-center justify-center">
                                            <Icon icon="ri:eye-line" className="text-base" />
                                        </Button>
                                    </Link>
                                    <Link href={`/offers/edit/${offer.id}`}>
                                        <Button size="sm" variant="info" className="flex items-center justify-center">
                                            <Icon icon="ri:edit-line" className="text-base" />
                                        </Button>
                                    </Link>
                                    <Button 
                                        size="sm" 
                                        variant="danger" 
                                        className="flex items-center justify-center"
                                        onClick={() => handleDelete(offer.id)}
                                        disabled={deleteInProgress[offer.id]}
                                    >
                                        {deleteInProgress[offer.id] ? (
                                            <Icon icon="eos-icons:loading" className="text-base" />
                                        ) : (
                                            <Icon icon="ri:delete-bin-line" className="text-base" />
                                        )}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )}
                        emptyMessage="Henüz teklif bulunmamaktadır"
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

