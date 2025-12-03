"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "@/axios";
import Link from "next/link";

export default function DemandDetail() {
    const router = useRouter();
    const params = useParams();
    const id = params.id;
    const [demand, setDemand] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDemand();
    }, [id]);

    const fetchDemand = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await axios.get(`/admin/demands/${id}`);
            setDemand(response.data.data || response.data);
        } catch (err) {
            console.error('Error fetching demand:', err);
            setError('Talep yüklenirken bir hata oluştu.');
        } finally {
            setIsLoading(false);
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
                <PageBreadcrumb pageTitle="Talep Detayı" />
                <div className="flex justify-center items-center h-64">
                    <Icon icon="eos-icons:loading" className="text-4xl text-primary" />
                </div>
            </div>
        );
    }

    if (error || !demand) {
        return (
            <div>
                <PageBreadcrumb pageTitle="Talep Detayı" />
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <div className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
                            <p>{error || 'Talep bulunamadı'}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <PageBreadcrumb 
                pageTitle="Talep Detayı"
                create={`/demands/edit/${id}`}
            />
            <div className="space-y-6">
                <ComponentCard title="Talep Bilgileri">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Başlık
                            </label>
                            <p className="text-gray-900 dark:text-white font-medium">{demand.title}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Durum
                            </label>
                            {getStatusBadge(demand.status)}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Kullanıcı
                            </label>
                            {demand.user ? (
                                <Link href={`/users/edit/${demand.user.id}`} className="flex items-center gap-2 text-primary hover:underline">
                                    {demand.user.profileImage && (
                                        <img 
                                            src={demand.user.profileImage} 
                                            alt={demand.user.name || "Kullanıcı"}
                                            className="w-8 h-8 rounded-full"
                                        />
                                    )}
                                    <span>{demand.user.name || demand.user.phoneNumber || "Kullanıcı"}</span>
                                </Link>
                            ) : (
                                <span className="text-gray-400">-</span>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Kategori
                            </label>
                            {demand.category ? (
                                <div className="flex items-center gap-2">
                                    {demand.category.icon && (
                                        <Icon icon={demand.category.icon} className="text-lg" />
                                    )}
                                    <span>{demand.category.name}</span>
                                </div>
                            ) : (
                                <span className="text-gray-400">-</span>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Acil
                            </label>
                            <p className="text-gray-900 dark:text-white">
                                {demand.isUrgent ? (
                                    <span className="text-red-500 flex items-center gap-1">
                                        <Icon icon="ri:alert-line" /> Evet
                                    </span>
                                ) : "Hayır"}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Kişi Sayısı
                            </label>
                            <p className="text-gray-900 dark:text-white">
                                {demand.peopleCount || "-"}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Etkinlik Tarihi
                            </label>
                            <p className="text-gray-900 dark:text-white">
                                {demand.eventDate 
                                    ? new Date(demand.eventDate).toLocaleDateString('tr-TR')
                                    : "-"}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Etkinlik Saati
                            </label>
                            <p className="text-gray-900 dark:text-white">
                                {demand.eventTime || "-"}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Teslim Süresi
                            </label>
                            <p className="text-gray-900 dark:text-white">
                                {demand.deadline || "-"}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Konum
                            </label>
                            <p className="text-gray-900 dark:text-white">
                                {demand.location || demand.address || "-"}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Koordinatlar
                            </label>
                            <p className="text-gray-900 dark:text-white text-sm">
                                {demand.latitude && demand.longitude 
                                    ? `${demand.latitude}, ${demand.longitude}`
                                    : "-"}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Teklif Sayısı
                            </label>
                            <p className="text-gray-900 dark:text-white">
                                {demand._count?.offers || demand.offers?.length || 0}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Oluşturulma Tarihi
                            </label>
                            <p className="text-gray-900 dark:text-white text-sm">
                                {new Date(demand.createdAt).toLocaleString('tr-TR')}
                            </p>
                        </div>
                    </div>
                </ComponentCard>

                <ComponentCard title="Açıklama">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {demand.description}
                    </p>
                </ComponentCard>

                {demand.images && demand.images.length > 0 && (
                    <ComponentCard title="Görseller">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {demand.images.map((image, index) => (
                                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                                    <img 
                                        src={image} 
                                        alt={`Görsel ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </ComponentCard>
                )}

                {demand.questionResponses && (
                    <ComponentCard title="Soru Cevapları">
                        <pre className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-sm overflow-auto">
                            {JSON.stringify(demand.questionResponses, null, 2)}
                        </pre>
                    </ComponentCard>
                )}

                {demand.offers && demand.offers.length > 0 && (
                    <ComponentCard title="Teklifler">
                        <div className="space-y-4">
                            {demand.offers.map((offer) => (
                                <div key={offer.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-medium">
                                                {offer.provider?.name || offer.provider?.phoneNumber || "Sağlayıcı"}
                                            </p>
                                            {offer.price && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Fiyat: {offer.price} ₺
                                                </p>
                                            )}
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs ${
                                            offer.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                                            offer.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {offer.status === 'ACCEPTED' ? 'Kabul Edildi' :
                                             offer.status === 'REJECTED' ? 'Reddedildi' :
                                             'Beklemede'}
                                        </span>
                                    </div>
                                    {offer.message && (
                                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                                            {offer.message}
                                        </p>
                                    )}
                                    {offer.estimatedTime && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            Tahmini Süre: {offer.estimatedTime}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </ComponentCard>
                )}
            </div>
        </div>
    );
}

