"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "@/axios";

export default function EditOffer() {
    const router = useRouter();
    const params = useParams();
    const id = params.id;
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [formData, setFormData] = useState({
        message: "",
        price: "",
        status: "PENDING",
    });

    useEffect(() => {
        fetchOffer();
    }, [id]);

    const fetchOffer = async () => {
        setIsFetching(true);
        try {
            const response = await axios.get(`/admin/offers/${id}`);
            const offer = response.data.data || response.data;
            setFormData({
                message: offer.message || "",
                price: offer.price?.toString() || "",
                estimatedTime: offer.estimatedTime || "",
                status: offer.status || "PENDING",
            });
        } catch (error) {
            console.error('Error fetching offer:', error);
            alert('Teklif yüklenirken bir hata oluştu.');
            router.push('/offers');
        } finally {
            setIsFetching(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const data = {
                ...formData,
                price: formData.price ? parseFloat(formData.price) : undefined,
            };

            await axios.patch(`/admin/offers/${id}`, data);
            router.push('/offers');
        } catch (error) {
            console.error('Error updating offer:', error);
            alert(error.response?.data?.message || error.message || 'Teklif güncellenirken bir hata oluştu.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div>
                <PageBreadcrumb pageTitle="Teklif Düzenle" />
                <div className="flex justify-center items-center h-64">
                    <Icon icon="eos-icons:loading" className="text-4xl text-primary" />
                </div>
            </div>
        );
    }

    return (
        <div>
            <PageBreadcrumb pageTitle="Teklif Düzenle" />
            <div className="space-y-6">
                <ComponentCard
                    title="Teklif Bilgileri"
                    desc="Teklif bilgilerini düzenlemek için aşağıdaki formu kullanın"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="price">Fiyat (₺)</Label>
                                <Input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                />
                            </div>


                            <div>
                                <Label htmlFor="status">Durum</Label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                >
                                    <option value="PENDING">Beklemede</option>
                                    <option value="ACCEPTED">Kabul Edildi</option>
                                    <option value="REJECTED">Reddedildi</option>
                                    <option value="COMPLETED">Tamamlandı</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <Label htmlFor="message">Mesaj</Label>
                                <TextArea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    placeholder="Teklif mesajı"
                                    rows={4}
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button
                                type="submit"
                                className="bg-primary text-white"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Icon icon="eos-icons:loading" className="mr-2" />
                                        Kaydediliyor...
                                    </>
                                ) : (
                                    'Kaydet'
                                )}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                            >
                                İptal
                            </Button>
                        </div>
                    </form>
                </ComponentCard>
            </div>
        </div>
    );
}

