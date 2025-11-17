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

export default function Demands() {
    const [demands, setDemands] = useState([]);
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
        categoryId: undefined,
        userId: undefined,
        isUrgent: undefined,
        search: '',
    });

    const fetchDemands = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const params = {
                page: pagination.page,
                limit: pagination.limit,
                ...(filters.status && { status: filters.status }),
                ...(filters.categoryId && { categoryId: filters.categoryId }),
                ...(filters.userId && { userId: filters.userId }),
                ...(filters.isUrgent !== undefined && { isUrgent: filters.isUrgent }),
                ...(filters.search && { search: filters.search }),
            };
            const response = await axios.get('/admin/demands', { params });
            setDemands(response.data.data || []);
            if (response.data.pagination) {
                setPagination(response.data.pagination);
            }
        } catch (err) {
            console.error('Error fetching demands:', err);
            setError('Talepler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDemands();
    }, [pagination.page, filters.status, filters.categoryId, filters.userId, filters.isUrgent, filters.search]);

    const handleDelete = async (id) => {
        if (!window.confirm('Bu talebi silmek istediğinize emin misiniz?')) {
            return;
        }
        
        setDeleteInProgress(prev => ({ ...prev, [id]: true }));
        
        try {
            await axios.delete(`/admin/demands/${id}`);
            fetchDemands();
        } catch (err) {
            console.error('Error deleting demand:', err);
            alert('Talep silinirken bir hata oluştu.');
        } finally {
            setDeleteInProgress(prev => ({ ...prev, [id]: false }));
        }
    };

    const getStatusBadge = (status) => {
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
                <PageBreadcrumb pageTitle="Talep Yönetimi" />
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <Icon icon="eos-icons:loading" className="text-4xl text-primary" />
                        <p className="mt-2 text-gray-600 dark:text-gray-400">Talepler yükleniyor...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <PageBreadcrumb pageTitle="Talep Yönetimi" />
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
            <PageBreadcrumb pageTitle="Talep Yönetimi" />
            <div className="space-y-6">
                <ComponentCard 
                    title="Talepler"
                    titleRightRenderer={
                        <Link href="/demands/add">
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
                        <select
                            value={filters.status || 'all'}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value === 'all' ? undefined : e.target.value })}
                            className="rounded-md border border-input bg-background px-3 py-2"
                        >
                            <option value="all">Tüm Durumlar</option>
                            <option value="ACTIVE">Aktif</option>
                            <option value="CLOSED">Kapalı</option>
                            <option value="COMPLETED">Tamamlandı</option>
                            <option value="CANCELLED">İptal</option>
                        </select>
                        <select
                            value={filters.isUrgent === undefined ? 'all' : filters.isUrgent ? 'true' : 'false'}
                            onChange={(e) => setFilters({ ...filters, isUrgent: e.target.value === 'all' ? undefined : e.target.value === 'true' })}
                            className="rounded-md border border-input bg-background px-3 py-2"
                        >
                            <option value="all">Acil Durum</option>
                            <option value="true">Acil</option>
                            <option value="false">Normal</option>
                        </select>
                    </div>
                    <TableContainer
                        data={demands}
                        navItems={["Başlık", "Kullanıcı", "Kategori", "Bütçe", "Durum", "Acil", "Teklif Sayısı", "Oluşturulma", "İşlemler"]}
                        renderItem={(demand) => (
                            <TableRow key={demand.id}>
                                <TableCell className="px-5 py-4 sm:px-6 text-start font-medium">
                                    <div className="max-w-xs truncate" title={demand.title}>
                                        {demand.title}
                                    </div>
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {demand.user ? (
                                        <div className="flex items-center gap-2">
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
                                        </div>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {demand.category ? (
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                {demand.category.icon && (
                                                    <Icon icon={demand.category.icon} className="text-lg" />
                                                )}
                                                <span className="text-sm font-medium">{demand.category.name}</span>
                                            </div>
                                            {demand.category.parent && (
                                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 ml-7">
                                                    <span>Üst:</span>
                                                    {demand.category.parent.icon && (
                                                        <Icon icon={demand.category.parent.icon} className="text-sm" />
                                                    )}
                                                    <span>{demand.category.parent.name}</span>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {demand.budget ? `${demand.budget} ₺` : "-"}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {getStatusBadge(demand.status)}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {demand.isUrgent ? (
                                        <span className="text-red-500">
                                            <Icon icon="ri:alert-line" className="text-xl" />
                                        </span>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {demand._count?.offers || demand.offers?.length || 0}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(demand.createdAt).toLocaleDateString('tr-TR')}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start flex gap-2">
                                    <Link href={`/demands/${demand.id}`}>
                                        <Button size="sm" variant="info" className="flex items-center justify-center">
                                            <Icon icon="ri:eye-line" className="text-base" />
                                        </Button>
                                    </Link>
                                    <Link href={`/demands/edit/${demand.id}`}>
                                        <Button size="sm" variant="info" className="flex items-center justify-center">
                                            <Icon icon="ri:edit-line" className="text-base" />
                                        </Button>
                                    </Link>
                                    <Button 
                                        size="sm" 
                                        variant="danger" 
                                        className="flex items-center justify-center"
                                        onClick={() => handleDelete(demand.id)}
                                        disabled={deleteInProgress[demand.id]}
                                    >
                                        {deleteInProgress[demand.id] ? (
                                            <Icon icon="eos-icons:loading" className="text-base" />
                                        ) : (
                                            <Icon icon="ri:delete-bin-line" className="text-base" />
                                        )}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )}
                        emptyMessage="Henüz talep bulunmamaktadır"
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

