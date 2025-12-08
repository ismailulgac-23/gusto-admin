"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "@/axios";
import Link from "next/link";

export default function OfferDetail() {
    const router = useRouter();
    const params = useParams();
    const id = params.id;
    const [offer, setOffer] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [approvalInProgress, setApprovalInProgress] = useState(false);

    useEffect(() => {
        fetchOffer();
    }, [id]);

    const fetchOffer = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await axios.get(`/admin/offers/${id}`);
            setOffer(response.data.data || response.data);
        } catch (err) {
            console.error('Error fetching offer:', err);
            setError('Teklif yüklenirken bir hata oluştu.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleApproval = async () => {
        if (!window.confirm('Bu teklifi onaylamak istediğinize emin misiniz?')) {
            return;
        }
        
        setApprovalInProgress(true);
        
        try {
            await axios.patch(`/admin/offers/${id}/approval`, { isApproved: true });
            fetchOffer(); // Tekrar yükle
            alert('Teklif başarıyla onaylandı.');
        } catch (err) {
            console.error('Error updating offer approval:', err);
            alert('Teklif onaylanırken bir hata oluştu.');
        } finally {
            setApprovalInProgress(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            PENDING: { label: "Beklemede", class: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400" },
            ACCEPTED: { label: "Kabul Edildi", class: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" },
            REJECTED: { label: "Reddedildi", class: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400" },
            COMPLETED: { label: "Tamamlandı", class: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400" },
        };
        const statusInfo = statusMap[status] || statusMap.PENDING;
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.class}`}>
                {statusInfo.label}
            </span>
        );
    };

    const getApprovalBadge = (isApproved) => {
        if (isApproved === undefined || isApproved === null) return null;
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isApproved 
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" 
                    : "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
            }`}>
                {isApproved ? "Onaylandı" : "Onay Bekliyor"}
            </span>
        );
    };

    if (isLoading) {
        return (
            <div>
                <PageBreadcrumb pageTitle="Teklif Detayı" />
                <div className="flex justify-center items-center h-64">
                    <Icon icon="eos-icons:loading" className="text-4xl text-primary" />
                </div>
            </div>
        );
    }

    if (error || !offer) {
        return (
            <div>
                <PageBreadcrumb pageTitle="Teklif Detayı" />
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <div className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
                            <p>{error || 'Teklif bulunamadı'}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <PageBreadcrumb 
                pageTitle="Teklif Detayı"
                create={`/offers/edit/${id}`}
            />
            <div className="space-y-6">
                <ComponentCard title="Teklif Bilgileri">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Durum
                            </label>
                            {getStatusBadge(offer.status)}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Onay Durumu
                            </label>
                            {getApprovalBadge(offer.isApproved)}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Fiyat
                            </label>
                            <p className="text-gray-900 dark:text-white font-medium">
                                {offer.price ? `${offer.price} ₺` : "Belirtilmemiş"}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Tahmini Süre
                            </label>
                            <p className="text-gray-900 dark:text-white">
                                {offer.estimatedTime || "-"}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Oluşturulma Tarihi
                            </label>
                            <p className="text-gray-900 dark:text-white text-sm">
                                {new Date(offer.createdAt).toLocaleString('tr-TR')}
                            </p>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Mesaj
                            </label>
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                {offer.message || "-"}
                            </p>
                        </div>
                    </div>
                </ComponentCard>

                {offer.demand && (
                    <ComponentCard title="Talep Bilgileri">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                    Talep Başlığı
                                </label>
                                <Link href={`/demands/${offer.demand.id}`} className="text-primary hover:underline font-medium">
                                    {offer.demand.title}
                                </Link>
                            </div>
                            {offer.demand.category && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        Kategori
                                    </label>
                                    <div className="flex items-center gap-2">
                                        {offer.demand.category.icon && (
                                            <Icon icon={offer.demand.category.icon} className="text-lg" />
                                        )}
                                        <span>{offer.demand.category.name}</span>
                                    </div>
                                </div>
                            )}
                            {offer.demand.user && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        Talep Sahibi
                                    </label>
                                    <Link href={`/users/edit/${offer.demand.user.id}`} className="flex items-center gap-2 text-primary hover:underline">
                                        {offer.demand.user.profileImage && (
                                            <img 
                                                src={offer.demand.user.profileImage} 
                                                alt={offer.demand.user.name || "Kullanıcı"}
                                                className="w-8 h-8 rounded-full"
                                            />
                                        )}
                                        <span>{offer.demand.user.name || offer.demand.user.phoneNumber || "Kullanıcı"}</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </ComponentCard>
                )}

                {offer.provider && (
                    <ComponentCard title="Sağlayıcı Bilgileri">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                    Sağlayıcı
                                </label>
                                <Link href={`/users/edit/${offer.provider.id}`} className="flex items-center gap-2 text-primary hover:underline">
                                    {offer.provider.profileImage && (
                                        <img 
                                            src={offer.provider.profileImage} 
                                            alt={offer.provider.name || "Sağlayıcı"}
                                            className="w-8 h-8 rounded-full"
                                        />
                                    )}
                                    <span>{offer.provider.name || offer.provider.phoneNumber || "Sağlayıcı"}</span>
                                </Link>
                            </div>
                            {offer.provider.rating !== undefined && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        Değerlendirme
                                    </label>
                                    <p className="text-gray-900 dark:text-white">
                                        ⭐ {offer.provider.rating.toFixed(1)} ({offer.provider.ratingCount || 0} değerlendirme)
                                    </p>
                                </div>
                            )}
                            {offer.provider.companyName && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        Firma Adı
                                    </label>
                                    <p className="text-gray-900 dark:text-white">
                                        {offer.provider.companyName}
                                    </p>
                                </div>
                            )}
                        </div>
                    </ComponentCard>
                )}

                {/* Onaylama Butonu - Sadece onay bekleyen teklifler için */}
                {offer.isApproved === false && (
                    <ComponentCard title="Onay İşlemi">
                        <div className="flex gap-4">
                            <Button
                                variant="success"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={handleApproval}
                                disabled={approvalInProgress}
                            >
                                {approvalInProgress ? (
                                    <>
                                        <Icon icon="eos-icons:loading" className="mr-2" />
                                        İşleniyor...
                                    </>
                                ) : (
                                    <>
                                        <Icon icon="ri:check-line" className="mr-2" />
                                        Onayla
                                    </>
                                )}
                            </Button>
                        </div>
                    </ComponentCard>
                )}
            </div>
        </div>
    );
}

