"use client";
import React, { useState, useEffect } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TableContainer from "@/components/royal-common/Table";
import Button from "@/components/ui/button/Button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Icon } from "@iconify/react/dist/iconify.js";
import ComponentCard from "@/components/common/ComponentCard";
import axios from "@/axios";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export default function PaymentNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionInProgress, setActionInProgress] = useState({});
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
    });
    const [filters, setFilters] = useState({
        status: undefined,
    });

    const fetchNotifications = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const params = {
                page: pagination.page,
                limit: pagination.limit,
                ...(filters.status && { status: filters.status }),
            };
            const response = await axios.get('/admin/payment-notifications', { params });
            setNotifications(response.data.data || []);
            if (response.data.pagination) {
                setPagination(response.data.pagination);
            }
        } catch (err) {
            console.error('Error fetching notifications:', err);
            setError('Ödeme bildirimleri yüklenirken bir hata oluştu.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [pagination.page, filters.status]);

    const handleAction = async (id, status) => {
        let adminNote = "";
        if (status === 'REJECTED') {
            adminNote = window.prompt("Reddetme sebebi nedir?");
            if (adminNote === null) return; // Cancelled prompt
        } else {
            if (!window.confirm(`Bu ödemeyi onaylamak istediğinize emin misiniz? Kullanıcı bakiyesine eklenecektir.`)) {
                return;
            }
        }

        setActionInProgress(prev => ({ ...prev, [id]: true }));

        try {
            await axios.patch(`/admin/payment-notifications/${id}/status`, { status, adminNote });
            fetchNotifications();
        } catch (err) {
            console.error('Error updating notification:', err);
            alert('İşlem sırasında bir hata oluştu.');
        } finally {
            setActionInProgress(prev => ({ ...prev, [id]: false }));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bu bildirimi silmek istediğinize emin misiniz?')) {
            return;
        }

        setActionInProgress(prev => ({ ...prev, [id]: true }));

        try {
            await axios.delete(`/admin/payment-notifications/${id}`);
            fetchNotifications();
        } catch (err) {
            console.error('Error deleting notification:', err);
            alert('Silme işlemi sırasında bir hata oluştu.');
        } finally {
            setActionInProgress(prev => ({ ...prev, [id]: false }));
        }
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            PENDING: { label: "Beklemede", class: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400" },
            APPROVED: { label: "Onaylandı", class: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" },
            REJECTED: { label: "Reddedildi", class: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400" },
        };
        const info = statusMap[status] || statusMap.PENDING;
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${info.class}`}>
                {info.label}
            </span>
        );
    };

    return (
        <div>
            <PageBreadcrumb pageTitle="Ödeme Bildirimleri" />
            <div className="space-y-6">
                <ComponentCard title="Ödeme Bildirimleri">
                    <div className="mb-4 flex flex-col sm:flex-row gap-4">
                        <select
                            value={filters.status || 'all'}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value === 'all' ? undefined : e.target.value })}
                            className="rounded-md border border-input bg-background px-3 py-2"
                        >
                            <option value="all">Tüm Durumlar</option>
                            <option value="PENDING">Beklemede</option>
                            <option value="APPROVED">Onaylandı</option>
                            <option value="REJECTED">Reddedildi</option>
                        </select>
                    </div>

                    <TableContainer
                        data={notifications}
                        navItems={["Kullanıcı", "Banka", "Miktar", "Ödeme Tarihi", "Bildirim Tarihi", "Açıklama", "Durum", "İşlemler"]}
                        renderItem={(notif) => (
                            <TableRow key={notif.id}>
                                <TableCell className="px-5 py-4 text-start">
                                    <div className="flex flex-col">
                                        <span className="font-medium">{notif.user?.name || "Bilinmeyen"}</span>
                                        <span className="text-xs text-gray-500">{notif.user?.phoneNumber}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="px-5 py-4 text-start font-medium">
                                    {notif.bankName}
                                </TableCell>
                                <TableCell className="px-5 py-4 text-start font-black text-primary">
                                    {notif.amount} TL
                                </TableCell>
                                <TableCell className="px-5 py-4 text-start text-sm">
                                    {format(new Date(notif.paymentDate), "dd MMM yyyy", { locale: tr })}
                                </TableCell>
                                <TableCell className="px-5 py-4 text-start text-sm text-gray-500">
                                    {format(new Date(notif.createdAt), "dd MMM yyyy HH:mm", { locale: tr })}
                                </TableCell>
                                <TableCell className="px-5 py-4 text-start text-xs max-w-xs truncate" title={notif.description}>
                                    {notif.description || "-"}
                                </TableCell>
                                <TableCell className="px-5 py-4 text-start">
                                    {getStatusBadge(notif.status)}
                                </TableCell>
                                <TableCell className="px-5 py-4 text-start flex gap-2">
                                    {notif.status === 'PENDING' && (
                                        <>
                                            <Button
                                                size="sm"
                                                variant="success"
                                                onClick={() => handleAction(notif.id, 'APPROVED')}
                                                disabled={actionInProgress[notif.id]}
                                            >
                                                <Icon icon="ri:check-line" className="text-base" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="warning"
                                                onClick={() => handleAction(notif.id, 'REJECTED')}
                                                disabled={actionInProgress[notif.id]}
                                            >
                                                <Icon icon="ri:close-line" className="text-base" />
                                            </Button>
                                        </>
                                    )}
                                    <Button
                                        size="sm"
                                        variant="danger"
                                        onClick={() => handleDelete(notif.id)}
                                        disabled={actionInProgress[notif.id]}
                                    >
                                        <Icon icon="ri:delete-bin-line" className="text-base" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )}
                        emptyMessage="Bildirim bulunamadı"
                    />

                    {pagination.totalPages > 1 && (
                        <div className="mt-4 flex items-center justify-between">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Sayfa {pagination.page} / {pagination.totalPages}
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
