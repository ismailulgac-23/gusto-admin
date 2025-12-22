"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TableContainer from "@/components/royal-common/Table";
import Button from "@/components/ui/button/Button";
import { TableCell, TableRow } from "@/components/ui/table";
import ComponentCard from "@/components/common/ComponentCard";
import axios from "@/axios";
import { Icon } from "@iconify/react/dist/iconify.js";
import EditDemandModal from "@/components/Demands/EditDemandModal";

export default function PendingDemands() {
    const [demands, setDemands] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [approvalInProgress, setApprovalInProgress] = useState({});
    const [editingDemandId, setEditingDemandId] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
    });

    const fetchPendingDemands = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const params = {
                page: pagination.page,
                limit: pagination.limit,
            };
            const response = await axios.get('/admin/demands/pending', { params });
            setDemands(response.data.data || []);
            if (response.data.pagination) {
                setPagination(response.data.pagination);
            }
        } catch (err) {
            console.error('Error fetching pending demands:', err);
            setError('Bekleyen talepler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingDemands();
    }, [pagination.page]);

    const handleApproval = async (id, isApproved) => {
        const action = isApproved ? 'onaylamak' : 'silmek';
        if (!window.confirm(`Bu talebi ${action} istediğinize emin misiniz?`)) {
            return;
        }
        
        setApprovalInProgress(prev => ({ ...prev, [id]: true }));
        
        try {
            await axios.patch(`/admin/demands/${id}/approval`, { isApproved });
            fetchPendingDemands();
            alert(`Talep başarıyla ${isApproved ? 'onaylandı' : 'silindi'}.`);
        } catch (err) {
            console.error('Error updating demand approval:', err);
            alert(`Talep ${isApproved ? 'onaylanırken' : 'silinirken'} bir hata oluştu.`);
        } finally {
            setApprovalInProgress(prev => ({ ...prev, [id]: false }));
        }
    };

    const getStatusBadge = (status, isApproved) => {
        // Bekleyen talepler için özel badge
        if (isApproved === false) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                    Bekliyor
                </span>
            );
        }
        
        const statusMap = {
            ACTIVE: { label: "Aktif", class: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" },
            CLOSED: { label: "Kapalı", class: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400" },
            COMPLETED: { label: "Tamamlandı", class: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400" },
            CANCELLED: { label: "İptal", class: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400" },
        };
        const statusInfo = statusMap[status] || statusMap.ACTIVE;
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.class}`}>
                {statusInfo.label}
            </span>
        );
    };

    if (isLoading) {
        return (
            <div>
                <PageBreadcrumb pageTitle="Bekleyen Talepler" />
                <div className="flex justify-center items-center h-64">
                    <Icon icon="eos-icons:loading" className="text-4xl text-primary" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <PageBreadcrumb pageTitle="Bekleyen Talepler" />
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
            <PageBreadcrumb pageTitle="Bekleyen Talepler" />
            <div className="space-y-6">
                <ComponentCard title="Onay Bekleyen Talepler">
                    <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Icon icon="ri:information-line" className="text-yellow-600 dark:text-yellow-400 text-xl" />
                            <p className="text-sm text-yellow-800 dark:text-yellow-300">
                                Bu sayfada onay bekleyen talepler listelenmektedir. Talepleri onaylayarak veya silerek yönetebilirsiniz.
                            </p>
                        </div>
                    </div>
                    <TableContainer
                        data={demands}
                        navItems={["Talep No", "Başlık", "Kategori", "Talep Sahibi", "Durum", "Teklif Sayısı", "Oluşturulma", "İşlemler"]}
                        renderItem={(demand) => (
                            <TableRow key={demand.id}>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {demand.demandNumber ? (
                                        <span className="inline-flex items-center px-3 py-1 rounded-lg bg-primary/10 text-primary font-semibold">
                                            #{demand.demandNumber}
                                        </span>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    <Link href={`/demands/${demand.id}`} className="text-primary hover:underline">
                                        <div className="max-w-xs truncate" title={demand.title}>
                                            {demand.title}
                                        </div>
                                    </Link>
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {demand.category ? (
                                        <div className="flex items-center gap-2">
                                            {demand.category.icon && (
                                                <Icon icon={demand.category.icon} className="text-lg" />
                                            )}
                                            <span className="text-sm">{demand.category.name}</span>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {demand.user ? (
                                        <Link href={`/users/edit/${demand.user.id}`} className="flex items-center gap-2 text-primary hover:underline">
                                            {demand.user.profileImage && (
                                                <img 
                                                    src={demand.user.profileImage} 
                                                    alt={demand.user.name || "Kullanıcı"}
                                                    className="w-8 h-8 rounded-full"
                                                />
                                            )}
                                            <span className="text-sm">
                                                {demand.user.name || demand.user.phoneNumber || "Kullanıcı"}
                                            </span>
                                        </Link>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {getStatusBadge(demand.status, demand.isApproved)}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    <span className="text-sm font-medium">
                                        {demand._count?.offers || 0}
                                    </span>
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(demand.createdAt).toLocaleDateString('tr-TR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start flex gap-2">
                                    <Link href={`/demands/${demand.id}`} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors" title="Görüntüle">
                                        <Icon icon="ri:eye-line" className="text-xl" />
                                    </Link>
                                    <button
                                        className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white w-8 h-8 p-0 rounded-xl transition-colors"
                                        onClick={() => setEditingDemandId(demand.id)}
                                        title="Düzenle"
                                    >
                                        <Icon icon="ri:edit-line" className="text-base" />
                                    </button>
                                    <button
                                        className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white w-8 h-8 p-0 rounded-xl transition-colors"
                                        onClick={() => handleApproval(demand.id, true)}
                                        disabled={approvalInProgress[demand.id]}
                                        title="Onayla"
                                    >
                                        {approvalInProgress[demand.id] ? (
                                            <Icon icon="eos-icons:loading" className="text-base" />
                                        ) : (
                                            <Icon icon="ri:check-line" className="text-base" />
                                        )}
                                    </button>
                                    
                                    <button
                                        className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white w-8 h-8 p-0 rounded-xl transition-colors"
                                        onClick={() => handleApproval(demand.id, false)}
                                        disabled={approvalInProgress[demand.id]}
                                        title="Reddet"
                                    >
                                        {approvalInProgress[demand.id] ? (
                                            <Icon icon="eos-icons:loading" className="text-base" />
                                        ) : (
                                            <Icon icon="ri:delete-bin-line" className="text-base" />
                                        )}
                                    </button>
                                </TableCell>
                            </TableRow>
                        )}
                        emptyMessage="Onay bekleyen talep bulunmamaktadır"
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
            
            {/* Edit Demand Modal */}
            <EditDemandModal
                isOpen={!!editingDemandId}
                onClose={() => setEditingDemandId(null)}
                demandId={editingDemandId}
                onSuccess={() => {
                    fetchPendingDemands();
                    setEditingDemandId(null);
                }}
            />
        </div>
    );
}

