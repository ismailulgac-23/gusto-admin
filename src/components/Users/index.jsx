"use client";
import React, { useState, useEffect } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TableContainer from "@/components/royal-common/Table";
import Button from "@/components/ui/button/Button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "@/axios";
import Link from "next/link";
import ComponentCard from "@/components/common/ComponentCard";
import { getImage } from "@/utils";
import Pagination from "@/components/tables/Pagination";

export default function Users({ addButton, title, userType }) {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
    });
    const [searchQuery, setSearchQuery] = useState('');

    const [navItems, setNavItems] = useState([])

    const fetchUsers = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const params = {
                page: pagination.page,
                limit: pagination.limit,
                userType: userType,
                ...(searchQuery && { search: searchQuery }),
            };
            const response = await axios.get('/admin/users', { params });
            const data = response.data.data || response.data;
            setUsers(Array.isArray(data) ? data : []);
            if (response.data.pagination) {
                setPagination(prev => ({
                    ...prev,
                    ...response.data.pagination,
                }));
            }
        } catch (err) {
            console.error('Error fetching users:', err);
            setError(`${title} yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [userType, pagination.page, searchQuery]);

    useEffect(() => {
        setNavItems(
            userType == 'PROVIDER' ? 
            ["#", "Şirket","Ad & Soyad", "Telefon", "Email", "Kullanıcı Tipi", "Aktif", "İşlem"]
            : ["#", "Ad & Soyad", "Telefon", "Email", "Kullanıcı Tipi", "Aktif", "İşlem"]
        );
    }, []);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handleDelete = async (id) => {
        if (!window.confirm(`Bu ${addButton} silmek istediğinize emin misiniz?`)) {
            return;
        }

        try {
            setDeleteLoading(true);
            await axios.delete(`/admin/users/${id}`);
            await fetchUsers();
        } catch (err) {
            console.error(`Error deleting ${addButton}:`, err);
            alert(`${addButton} silinirken bir hata oluştu.`);
        } finally {
            setDeleteLoading(false);
        }
    };


    return (
        <div>
            <PageBreadcrumb pageTitle={title} />
            <div className="space-y-6">
                <ComponentCard
                    title={title}
                >
                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative">
                            <Icon 
                                icon="ri:search-line" 
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" 
                            />
                            <input
                                type="text"
                                placeholder={`${title} ara...`}
                                value={searchQuery}
                                onChange={handleSearch}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md">
                            {error}
                        </div>
                    )}

                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="flex flex-col items-center">
                                <Icon icon="eos-icons:loading" className="text-4xl text-primary animate-spin" />
                                <span className="mt-3 text-gray-600 dark:text-gray-400">{title} yükleniyor...</span>
                            </div>
                        </div>
                    ) : (
                        <TableContainer
                            data={users}
                            navItems={navItems}
                            renderItem={(user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                                        {user.profileImage ? (
                                            <img
                                                src={user.profileImage}
                                                className="w-16 h-16 rounded-md object-cover"
                                                alt={user.name || 'Kullanıcı'}
                                            />
                                        ) : (
                                            <div className="w-16 h-16 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                                <Icon icon="ri:user-line" className="text-2xl text-gray-400" />
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                                        {user.companyName || '-'}
                                    </TableCell>
                                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                                        {user.name || '-'}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {user.phoneNumber || '-'}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {user.email || '-'}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-start">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            user.userType === 'PROVIDER'
                                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                                : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                        }`}>
                                            {user.userType === 'PROVIDER' ? 'Sağlayıcı' : 'Alıcı'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-start">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            user.isActive 
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                                        }`}>
                                            {user.isActive ? 'Aktif' : 'Pasif'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 flex items-center gap-2">
                                        <Link href={`/users/edit/${user.id}`}>
                                            <Button
                                                size="sm"
                                                variant="info"
                                                className="flex items-center justify-center"
                                                title="Düzenle"
                                            >
                                                <Icon icon="ri:edit-line" className="text-base" />
                                            </Button>
                                        </Link>
                                        <Button
                                            size="sm"
                                            variant="danger"
                                            className="flex items-center justify-center"
                                            onClick={() => handleDelete(user.id)}
                                            disabled={deleteLoading}
                                            title="Sil"
                                        >
                                            <Icon icon="ri:delete-bin-line" className="text-base" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )}
                            emptyMessage={`Henüz ${title.toLowerCase()} bulunamadı`}
                        />
                    )}

                    {/* Pagination */}
                    {!isLoading && pagination.totalPages > 1 && (
                        <div className="mt-6 flex justify-between items-center">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Toplam {pagination.total} {title.toLowerCase()} • Sayfa {pagination.page} / {pagination.totalPages}
                            </div>
                            <Pagination
                                currentPage={pagination.page}
                                totalPages={pagination.totalPages}
                                onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
                            />
                        </div>
                    )}
                </ComponentCard>
            </div>
        </div>
    );
}
