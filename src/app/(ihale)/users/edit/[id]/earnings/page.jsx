"use client"
import React, { useEffect, useState } from 'react'
import axios from '@/axios'
import { useParams } from 'next/navigation';
import ModeratorProfileCard from '@/components/ModeratorProfileCard';
import { Icon } from '@iconify/react';

const Page = () => {
    const [earnings, setEarnings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [moderator, setModerator] = useState(null);

    const { id } = useParams();

    const fetchEarnings = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.get(`/admin/moderators/${id}/earnings`);
            setEarnings(response.data.earnings);
            setModerator(response.data.moderator);
        } catch (err) {
            console.error('Error fetching earnings:', err);
            setError(`Kazançlar yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEarnings();
    }, []);

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY'
        }).format(amount);
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Hata! </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            </div>
        );
    }

    // Calculate total earnings
    const totalEarnings = earnings.reduce((sum, earning) => sum + earning.amount, 0);
    const averageCommissionRate = earnings.reduce((sum, earning) => sum + earning.commissionRate, 0) / earnings.length;

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Moderator Profile Card */}
            {moderator && <ModeratorProfileCard user={moderator} />}

            {/* Earnings Summary */}
            <div className="mt-8 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Kazanç Özeti</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <Icon icon="heroicons:currency-dollar" className="h-8 w-8 text-green-500 mr-3" />
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Toplam Kazanç</p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalEarnings)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <Icon icon="heroicons:chart-bar" className="h-8 w-8 text-blue-500 mr-3" />
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">İşlem Sayısı</p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">{earnings.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <Icon icon="heroicons:percentage" className="h-8 w-8 text-purple-500 mr-3" />
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Aktif Komisyon</p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">%{moderator.commissionRate.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <Icon icon="heroicons:percentage" className="h-8 w-8 text-purple-500 mr-3" />
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Ortalama Komisyon</p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">%{averageCommissionRate.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Earnings Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Kazanç Detayları</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tarih</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Açıklama</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tutar</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Komisyon Oranı</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {earnings.map((earning) => (
                                <tr key={earning.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                        {formatDate(earning.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                        {earning.description}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                        {formatCurrency(earning.amount)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                        %{earning.commissionRate.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Page;