"use client";
import React, { useState, useEffect } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TableContainer from "@/components/royal-common/Table";
import { TableCell, TableRow } from "@/components/ui/table";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "@/axios";
import ComponentCard from "@/components/common/ComponentCard";
import { getImage } from "@/utils";
import { formatDate } from "@fullcalendar/core/index.js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/form/Select";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";

export default function Earnings({ isModerator, title }) {
    const [earnings, setEarnings] = useState([]);
    const [filteredEarnings, setFilteredEarnings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Filter states
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        commissionRange: ''
    });

    const fetchEarnings = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);
            if (filters.commissionRange) params.append('commissionRate', filters.commissionRange);
            const response = await axios.get('/admin/earnings', { params });
            setEarnings(response.data);
            setFilteredEarnings(response.data);
        } catch (err) {
            console.error('Error fetching bots:', err);
            setError(`${title} yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEarnings();
    }, []);

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle commission filter change (for select)
    const handleCommissionChange = (value) => {
        setFilters(prev => ({
            ...prev,
            commissionRange: value
        }));
    };

    // Apply filters
    const applyFilters = () => {
        let result = [...earnings];

        if (filters.startDate) {
            const startDate = new Date(filters.startDate);
            result = result.filter(earning => new Date(earning.createdAt) >= startDate);
        }

        if (filters.endDate) {
            const endDate = new Date(filters.endDate);
            endDate.setHours(23, 59, 59, 999);
            result = result.filter(earning => new Date(earning.createdAt) <= endDate);
        }

        result = result.filter(earning => earning.commissionRate >= Number(filters.commissionRange));

        console.log(result);

        setFilteredEarnings(result);
    };

    // Reset filters
    const resetFilters = () => {
        setFilters({
            startDate: '',
            endDate: '',
            commissionRange: ''
        });
        setFilteredEarnings(earnings);
    };

    // Apply filters whenever filters change
    useEffect(() => {
        applyFilters();
    }, [filters, earnings]);

    // Format premium status
    const formatPremiumStatus = (premiumEndDate) => {
        if (!premiumEndDate) return "Hayır";

        const endDate = new Date(premiumEndDate);
        const now = new Date();

        return endDate > now ? "Evet" : "Süresi Dolmuş";
    };

    return (
        <div>
            <PageBreadcrumb pageTitle={title} />
            <div className="space-y-6">
                <ComponentCard
                    title={title}
                >
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md">
                            {error}
                        </div>
                    )}

                    {/* Filter section */}
                    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <h3 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">Filtreler</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Başlangıç Tarihi</label>
                                <Input
                                    type="date"
                                    name="startDate"
                                    value={filters.startDate}
                                    onChange={handleFilterChange}
                                    className="w-full text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Bitiş Tarihi</label>
                                <Input
                                    type="date"
                                    name="endDate"
                                    value={filters.endDate}
                                    onChange={handleFilterChange}
                                    className="w-full text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Komisyon Oranı</label>
                                <Input
                                    type="text"
                                    name="commissionRange"
                                    value={filters.commissionRange}
                                    onChange={handleFilterChange}
                                    placeholder="Tüm Komisyonlar"
                                    className="w-full text-sm"
                                />
                            </div>
                            <div className="flex items-end gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={resetFilters}
                                    className="text-xs"
                                >
                                    Sıfırla
                                </Button>
                            </div>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="flex flex-col items-center">
                                <Icon icon="eos-icons:loading" className="text-4xl text-primary animate-spin" />
                                <span className="mt-3 text-gray-600 dark:text-gray-400">{title} yükleniyor...</span>
                            </div>
                        </div>
                    ) : (
                        <TableContainer
                            data={filteredEarnings}
                            navItems={isModerator ? ["Açıklama", "Komisyon", "Miktar", "Tarih"] : ["Fotoğraf", "Moderatör", "Açıklama", "Komisyon", "Miktar", "Tarih"]}
                            renderItem={(earning) => (
                                <TableRow key={earning.id}>
                                    {!isModerator && (
                                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                                            <img
                                                src={getImage(earning.moderator?.images[0])}
                                                className="w-16 h-16 rounded-full object-cover"
                                                alt={earning.moderator?.name}
                                            />
                                        </TableCell>
                                    )}
                                    {!isModerator && (
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {earning.moderator?.name || '-'}
                                        </TableCell>
                                    )}
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {earning.description}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {earning.commissionRate.toFixed(2)}%
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {earning.amount ? earning.amount.toLocaleString('tr-TR') : '0'}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {formatDate(earning.createdAt)}
                                    </TableCell>
                                </TableRow>
                            )}
                            emptyMessage={`Henüz ${title} bulunamadı`}
                        />
                    )}
                </ComponentCard>
            </div>
        </div>
    );
}
