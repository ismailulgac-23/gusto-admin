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

export default function PendingOffers() {
    const [offers, setOffers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [approvalInProgress, setApprovalInProgress] = useState({});
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
    });

    const fetchPendingOffers = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const params = {
                page: pagination.page,
                limit: pagination.limit,
            };
            const response = await axios.get('/admin/offers/pending', { params });
            setOffers(response.data.data || []);
            if (response.data.pagination) {
                setPagination(response.data.pagination);
            }
        } catch (err) {
            console.error('Error fetching pending offers:', err);
            setError('Bekleyen teklifler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingOffers();
    }, [pagination.page]);

    const handleApproval = async (id) => {
        if (!window.confirm('Bu teklifi onaylamak istediğinize emin misiniz?')) {
            return;
        }
        
        setApprovalInProgress(prev => ({ ...prev, [id]: true }));
        
        try {
            await axios.patch(`/admin/offers/${id}/approval`, { isApproved: true });
            fetchPendingOffers();
            alert('Teklif başarıyla onaylandı.');
        } catch (err) {
            console.error('Error updating offer approval:', err);
            alert('Teklif onaylanırken bir hata oluştu.');
        } finally {
            setApprovalInProgress(prev => ({ ...prev, [id]: false }));
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
                <PageBreadcrumb pageTitle="Bekleyen Teklifler" />
                <div className="flex justify-center items-center h-64">
                    <Icon icon="eos-icons:loading" className="text-4xl text-primary" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <PageBreadcrumb pageTitle="Bekleyen Teklifler" />
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
            <PageBreadcrumb pageTitle="Bekleyen Teklifler" />
            <div className="space-y-6">
                <ComponentCard title="Onay Bekleyen Teklifler">
                    <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Icon icon="ri:information-line" className="text-yellow-600 dark:text-yellow-400 text-xl" />
                            <p className="text-sm text-yellow-800 dark:text-yellow-300">
                                Bu sayfada onay bekleyen teklifler listelenmektedir. Teklifleri onaylayarak veya reddederek yönetebilirsiniz.
                            </p>
                        </div>
                    </div>
                    <TableContainer
                        data={offers}
                        navItems={["Talep", "Talep Sahibi", "Sağlayıcı", "Mesaj", "Fiyat", "Tahmini Süre", "Durum", "Oluşturulma", "İşlemler"]}
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
                                    {offer.demand?.user ? (
                                        <Link href={`/users/edit/${offer.demand.user.id}`} className="flex items-center gap-2 text-primary hover:underline">
                                            <span className="text-sm">
                                                {offer.demand.user.name || offer.demand.user.phoneNumber || "Kullanıcı"}
                                            </span>
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
                                                {offer.provider.name || offer.provider.companyName || offer.provider.phoneNumber || "Sağlayıcı"}
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
                                    <Button 
                                        size="sm" 
                                        variant="success" 
                                        className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white"
                                        onClick={() => handleApproval(offer.id)}
                                        disabled={approvalInProgress[offer.id]}
                                    >
                                        {approvalInProgress[offer.id] ? (
                                            <Icon icon="eos-icons:loading" className="text-base" />
                                        ) : (
                                            <>
                                                <Icon icon="ri:check-line" className="text-base mr-1" />
                                                Onayla
                                            </>
                                        )}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )}
                        emptyMessage="Onay bekleyen teklif bulunmamaktadır"
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

