"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "@/axios";
import Link from "next/link";
import MapViewer from "@/components/map/MapViewer";

export default function CharityActivityDetail() {
    const router = useRouter();
    const params = useParams();
    const id = params.id;
    const [activity, setActivity] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchActivity();
    }, [id]);

    const fetchActivity = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await axios.get(`/admin/charity-activities/${id}`);
            setActivity(response.data.data || response.data);
        } catch (err) {
            console.error('Error fetching charity activity:', err);
            setError('Hayır işi yüklenirken bir hata oluştu.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div>
                <PageBreadcrumb pageTitle="Hayır İşi Detayı" />
                <div className="flex justify-center items-center h-64">
                    <Icon icon="eos-icons:loading" className="text-4xl text-primary" />
                </div>
            </div>
        );
    }

    if (error || !activity) {
        return (
            <div>
                <PageBreadcrumb pageTitle="Hayır İşi Detayı" />
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <div className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
                            <p>{error || 'Hayır işi bulunamadı'}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <PageBreadcrumb 
                pageTitle="Hayır İşi Detayı"
                create={`/charity-activities/edit/${id}`}
            />
            <div className="space-y-6">
                <ComponentCard title="Hayır İşi Bilgileri">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Başlık
                            </label>
                            <p className="text-gray-900 dark:text-white font-medium">{activity.title}</p>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Açıklama
                            </label>
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                {activity.description}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Sağlayıcı
                            </label>
                            {activity.provider ? (
                                <Link href={`/users/edit/${activity.provider.id}`} className="flex items-center gap-2 text-primary hover:underline">
                                    {activity.provider.profileImage && (
                                        <img 
                                            src={activity.provider.profileImage} 
                                            alt={activity.provider.name || "Sağlayıcı"}
                                            className="w-8 h-8 rounded-full"
                                        />
                                    )}
                                    <span>{activity.provider.name || activity.provider.phoneNumber || "Sağlayıcı"}</span>
                                </Link>
                            ) : (
                                <span className="text-gray-400">-</span>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Kategori
                            </label>
                            {activity.category ? (
                                <div className="flex items-center gap-2">
                                    {activity.category.icon && (
                                        <Icon icon={activity.category.icon} className="text-lg" />
                                    )}
                                    <span>{activity.category.name}</span>
                                </div>
                            ) : (
                                <span className="text-gray-400">-</span>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Adres
                            </label>
                            <p className="text-gray-900 dark:text-white">
                                {activity.address}
                            </p>
                        </div>
                        <div className="md:col-span-2">
                            <MapViewer
                                latitude={activity.latitude}
                                longitude={activity.longitude}
                                address={activity.address}
                                title="Hayır İşi Konumu"
                                height="500px"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Tahmini Bitiş Tarihi
                            </label>
                            <p className="text-gray-900 dark:text-white text-sm">
                                {activity.estimatedEndTime 
                                    ? new Date(activity.estimatedEndTime).toLocaleString('tr-TR')
                                    : "-"}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Oluşturulma Tarihi
                            </label>
                            <p className="text-gray-900 dark:text-white text-sm">
                                {new Date(activity.createdAt).toLocaleString('tr-TR')}
                            </p>
                        </div>
                    </div>
                </ComponentCard>
            </div>
        </div>
    );
}

