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
import MapPicker from "@/components/map/MapPicker";

export default function EditCharityActivity() {
    const router = useRouter();
    const params = useParams();
    const id = params.id;
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        latitude: "",
        longitude: "",
        address: "",
        estimatedEndTime: "",
    });

    useEffect(() => {
        fetchActivity();
    }, [id]);

    const fetchActivity = async () => {
        setIsFetching(true);
        try {
            const response = await axios.get(`/admin/charity-activities/${id}`);
            const activity = response.data.data || response.data;
            setFormData({
                title: activity.title || "",
                description: activity.description || "",
                latitude: activity.latitude?.toString() || "",
                longitude: activity.longitude?.toString() || "",
                address: activity.address || "",
                estimatedEndTime: activity.estimatedEndTime 
                    ? new Date(activity.estimatedEndTime).toISOString().slice(0, 16)
                    : "",
            });
        } catch (error) {
            console.error('Error fetching charity activity:', error);
            alert('Hayır işi yüklenirken bir hata oluştu.');
            router.push('/charity-activities');
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
                latitude: parseFloat(formData.latitude),
                longitude: parseFloat(formData.longitude),
                estimatedEndTime: formData.estimatedEndTime || undefined,
            };

            await axios.put(`/admin/charity-activities/${id}`, data);
            router.push('/charity-activities');
        } catch (error) {
            console.error('Error updating charity activity:', error);
            alert(error.response?.data?.message || error.message || 'Hayır işi güncellenirken bir hata oluştu.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div>
                <PageBreadcrumb pageTitle="Hayır İşi Düzenle" />
                <div className="flex justify-center items-center h-64">
                    <Icon icon="eos-icons:loading" className="text-4xl text-primary" />
                </div>
            </div>
        );
    }

    return (
        <div>
            <PageBreadcrumb pageTitle="Hayır İşi Düzenle" />
            <div className="space-y-6">
                <ComponentCard
                    title="Hayır İşi Bilgileri"
                    desc="Hayır işi bilgilerini düzenlemek için aşağıdaki formu kullanın"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <Label htmlFor="title">Başlık *</Label>
                                <Input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Hayır işi başlığı"
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <Label htmlFor="description">Açıklama *</Label>
                                <TextArea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Hayır işi açıklaması"
                                    rows={4}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="address">Adres *</Label>
                                <Input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder="Detaylı adres"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="estimatedEndTime">Tahmini Bitiş Tarihi</Label>
                                <Input
                                    type="datetime-local"
                                    id="estimatedEndTime"
                                    name="estimatedEndTime"
                                    value={formData.estimatedEndTime}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <MapPicker
                                    latitude={formData.latitude}
                                    longitude={formData.longitude}
                                    onLocationChange={(lat, lng) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            latitude: lat.toString(),
                                            longitude: lng.toString()
                                        }));
                                    }}
                                    height="400px"
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

