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

export default function Categories() {
    const [categories, setCategories] = useState([]);
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
        search: '',
        isActive: undefined,
    });

    const fetchCategories = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const params = {
                page: pagination.page,
                limit: pagination.limit,
                ...(filters.search && { search: filters.search }),
                ...(filters.isActive !== undefined && { isActive: filters.isActive }),
            };
            const response = await axios.get('/admin/categories', { params });
            setCategories(response.data.data || []);
            if (response.data.pagination) {
                setPagination(response.data.pagination);
            }
        } catch (err) {
            console.error('Error fetching categories:', err);
            setError('Kategoriler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [pagination.page, filters.search, filters.isActive]);

    const handleDelete = async (id) => {
        if (!window.confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) {
            return;
        }
        
        setDeleteInProgress(prev => ({ ...prev, [id]: true }));
        
        try {
            await axios.delete(`/admin/categories/${id}`);
            setCategories(prev => prev.filter(category => category.id !== id));
        } catch (err) {
            console.error('Error deleting category:', err);
            alert('Kategori silinirken bir hata oluştu.');
        } finally {
            setDeleteInProgress(prev => ({ ...prev, [id]: false }));
        }
    };

    const toggleActive = async (id, currentStatus) => {
        try {
            await axios.patch(`/admin/categories/${id}`, { isActive: !currentStatus });
            setCategories(prev => 
                prev.map(cat => 
                    cat.id === id ? { ...cat, isActive: !currentStatus } : cat
                )
            );
        } catch (err) {
            console.error('Error updating category:', err);
            alert('Kategori güncellenirken bir hata oluştu.');
        }
    };

    if (isLoading) {
        return (
            <div>
                <PageBreadcrumb pageTitle="Kategori Yönetimi" />
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Yükleniyor...</span>
                        </div>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">Kategoriler yükleniyor...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <PageBreadcrumb pageTitle="Kategori Yönetimi" />
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
            <PageBreadcrumb pageTitle="Kategori Yönetimi" />
            <div className="space-y-6">
                <ComponentCard 
                    title="Kategoriler"
                    titleRightRenderer={
                        <Link href="/categories/add">
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
                            value={filters.isActive === undefined ? 'all' : filters.isActive ? 'true' : 'false'}
                            onChange={(e) => setFilters({ ...filters, isActive: e.target.value === 'all' ? undefined : e.target.value === 'true' })}
                            className="rounded-md border border-input bg-background px-3 py-2"
                        >
                            <option value="all">Tümü</option>
                            <option value="true">Aktif</option>
                            <option value="false">Pasif</option>
                        </select>
                    </div>
                    <TableContainer
                        data={categories}
                        navItems={["İkon", "Ad", "Üst Kategori", "Aktif", "Soru Kalıpları", "Oluşturulma", "İşlemler"]}
                        renderItem={(category) => (
                            <TableRow key={category.id}>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {category.icon ? (
                                        <Icon icon={category.icon} className="text-2xl" />
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start font-medium">
                                    {category.name}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {category.parent ? (
                                        <div className="flex items-center gap-2">
                                            {category.parent.icon && (
                                                <Icon icon={category.parent.icon} className="text-base" />
                                            )}
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                {category.parent.name}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 text-sm">Ana Kategori</span>
                                    )}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {category.isActive ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                            Aktif
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                                            Pasif
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {category.questions ? (
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {Array.isArray(category.questions) 
                                                ? `${category.questions.length} soru` 
                                                : 'Var'}
                                        </span>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(category.createdAt).toLocaleDateString('tr-TR')}
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start flex gap-2">
                                    <Link href={`/categories/edit/${category.id}`}>
                                        <Button size="sm" variant="info" className="flex items-center justify-center">
                                            <Icon icon="ri:edit-line" className="text-base" />
                                        </Button>
                                    </Link>
                                    <Button 
                                        size="sm" 
                                        variant={category.isActive ? "warning" : "success"}
                                        className="flex items-center justify-center"
                                        onClick={() => toggleActive(category.id, category.isActive)}
                                    >
                                        <Icon 
                                            icon={category.isActive ? "ri:eye-off-line" : "ri:eye-line"} 
                                            className="text-base" 
                                        />
                                    </Button>
                                    <Button 
                                        size="sm" 
                                        variant="danger" 
                                        className="flex items-center justify-center"
                                        onClick={() => handleDelete(category.id)}
                                        disabled={deleteInProgress[category.id]}
                                    >
                                        {deleteInProgress[category.id] ? (
                                            <Icon icon="eos-icons:loading" className="text-base" />
                                        ) : (
                                            <Icon icon="ri:delete-bin-line" className="text-base" />
                                        )}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )}
                        emptyMessage="Henüz kategori bulunmamaktadır"
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

