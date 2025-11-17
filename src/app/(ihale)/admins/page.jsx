"use client";
import React, { useState, useEffect } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TableContainer from "@/components/royal-common/Table";
import Button from "@/components/ui/button/Button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "@/axios";

export default function Admins() {
    const [admins, setAdmins] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAdmins = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                const response = await axios.get('/admin/users', {
                    params: { isAdmin: true }
                });
                const data = response.data.data || response.data;
                setAdmins(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Error fetching admins:', err);
                setError('Yöneticiler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAdmins();
    }, []);

    const handleDelete = (id) => {
        if (window.confirm('Bu yöneticiyi silmek istediğinize emin misiniz?')) {
            // In a real app, you would call an API to delete the admin
            console.log(`Delete admin with ID: ${id}`);
        }
    };

    if (isLoading) {
        return (
            <div>
                <PageBreadcrumb pageTitle="Yöneticiler" />
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Yükleniyor...</span>
                        </div>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">Yöneticiler yükleniyor...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <PageBreadcrumb pageTitle="Yöneticiler" />
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
            <PageBreadcrumb pageTitle="Yöneticiler" />
            <div className="space-y-6">
                <TableContainer
                    data={admins}
                    navItems={["Ad & Soyad", "Yetkilendirme", "Aktif", "İşlem"]}
                    renderItem={(admin) => {
                        return (
                            <TableRow key={admin.id}>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    {admin.name || '-'}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {admin.email || admin.phoneNumber || '-'}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-start">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                        admin.isActive 
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                                    }`}>
                                        {admin.isActive ? 'Aktif' : 'Pasif'}
                                    </span>
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 flex items-center gap-3">
                                    <Button 
                                        size="sm" 
                                        variant="outline"
                                        onClick={() => window.location.href = `/users/edit/${admin.id}`}
                                    >
                                        <Icon icon="mingcute:edit-line" className="text-lg" />
                                    </Button>
                                    <Button 
                                        size="sm" 
                                        variant="danger"
                                        onClick={() => handleDelete(admin.id)}
                                    >
                                        <Icon icon="ri:delete-bin-line" className="text-base" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )
                    }}
                    emptyMessage="Henüz yönetici bulunamadı"
                />
            </div>
        </div>
    );
}
