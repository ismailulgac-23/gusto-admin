"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "@/axios";
import Link from "next/link";
import EditDemandModal from "@/components/Demands/EditDemandModal";

export default function DemandDetail() {
    const router = useRouter();
    const params = useParams();
    const id = params.id;
    const [demand, setDemand] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
                onCreate={() => setIsEditModalOpen(true)}
            />
            <div className="space-y-6">
                <ComponentCard title="Talep Bilgileri">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Talep Numarası
                            </label>
                            {demand.demandNumber ? (
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-semibold text-lg">
                                        #{demand.demandNumber}
                                    </span>
                                </div>
                            ) : (
                                <p className="text-gray-400">-</p>
                            )}
                        </div>
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
                                İl
                            </label>
                            {demand.cities && demand.cities.length > 0 ? (
                                <div className="flex items-center gap-2">
                                    <Icon icon="mdi:map-marker" className="text-primary text-xl" />
                                    <div className="flex flex-wrap gap-2">
                                        {demand.cities.map((dc, index) => (
                                            <span 
                                                key={dc.id || index}
                                                className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm font-medium"
                                            >
                                                {dc.city?.name || 'Bilinmeyen İl'}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-400">-</p>
                            )}
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
                                Teklif Sayıları
                            </label>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-sm font-medium">
                                            <Icon icon="mdi:check-circle" className="mr-1" />
                                            Onaylı: {demand.approvedOffersCount || 0}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 text-sm font-medium">
                                            <Icon icon="mdi:clock-outline" className="mr-1" />
                                            Bekleyen: {demand.pendingOffersCount || 0}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Toplam: {demand._count?.offers || demand.offers?.length || 0}
                                </p>
                            </div>
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
                    <ComponentCard title="İl ve İlçe Koordinasyonu">
                        {(() => {
                            try {
                                const responses = typeof demand.questionResponses === 'string' 
                                    ? JSON.parse(demand.questionResponses) 
                                    : demand.questionResponses;
                                
                                // Check if it's the city-county structure
                                if (responses && typeof responses === 'object' && !Array.isArray(responses)) {
                                    const cities = Object.keys(responses);
                                    
                                    if (cities.length > 0 && Array.isArray(responses[cities[0]])) {
                                        // It's the city-county structure
                                        return (
                                            <div className="space-y-4">
                                                {cities.map((cityName, cityIndex) => {
                                                    const counties = responses[cityName] || [];
                                                    return (
                                                        <div 
                                                            key={cityIndex}
                                                            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700"
                                                        >
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <Icon 
                                                                    icon="mdi:city" 
                                                                    className="text-2xl text-primary" 
                                                                />
                                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                                    {cityName}
                                                                </h3>
                                                                <span className="ml-auto px-2.5 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-medium">
                                                                    {counties.length} İlçe
                                                                </span>
                                                            </div>
                                                            <div className="flex flex-wrap gap-2">
                                                                {counties.length > 0 ? (
                                                                    counties.map((county, countyIndex) => (
                                                                        <span
                                                                            key={countyIndex}
                                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:shadow-md transition-shadow"
                                                                        >
                                                                            <Icon 
                                                                                icon="mdi:map-marker" 
                                                                                className="text-primary text-sm" 
                                                                            />
                                                                            {county}
                                                                        </span>
                                                                    ))
                                                                ) : (
                                                                    <span className="text-sm text-gray-500 dark:text-gray-400 italic">
                                                                        İlçe bilgisi bulunmamaktadır
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        );
                                    }
                                }
                                
                                // Fallback to JSON display for other structures
                                return (
                                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                        <pre className="text-sm overflow-auto">
                                            {JSON.stringify(responses, null, 2)}
                                        </pre>
                                    </div>
                                );
                            } catch (error) {
                                // If parsing fails, show as JSON
                                return (
                                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                        <pre className="text-sm overflow-auto">
                                            {JSON.stringify(demand.questionResponses, null, 2)}
                                        </pre>
                                    </div>
                                );
                            }
                        })()}
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
            
            {/* Edit Demand Modal */}
            <EditDemandModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                demandId={id}
                onSuccess={() => {
                    fetchDemand();
                    setIsEditModalOpen(false);
                }}
            />
        </div>
    );
}

