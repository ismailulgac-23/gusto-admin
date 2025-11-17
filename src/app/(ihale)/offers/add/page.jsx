"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "@/axios";

export default function AddOffer() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [demands, setDemands] = useState([]);
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        demandId: "",
        providerId: "",
        message: "",
        price: "",
        estimatedTime: "",
        status: "PENDING",
    });

    useEffect(() => {
        fetchDemands();
        fetchUsers();
    }, []);

    const fetchDemands = async () => {
        try {
            const response = await axios.get('/admin/demands');
            setDemands(response.data.data?.demands || response.data.data || response.data || []);
        } catch (err) {
            console.error('Error fetching demands:', err);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/admin/users');
            setUsers(response.data.data || response.data || []);
        } catch (err) {
            console.error('Error fetching users:', err);
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

            await axios.post('/admin/offers', data);
            router.push('/offers');
        } catch (error) {
            console.error('Error creating offer:', error);
            alert(error.response?.data?.message || error.message || 'Teklif oluşturulurken bir hata oluştu.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <PageBreadcrumb pageTitle="Yeni Teklif Ekle" />
            <div className="space-y-6">
                <ComponentCard
                    title="Teklif Bilgileri"
                    desc="Yeni bir teklif oluşturmak için aşağıdaki formu doldurun"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="demandId">Talep *</Label>
                                <select
                                    id="demandId"
                                    name="demandId"
                                    value={formData.demandId}
                                    onChange={handleInputChange}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                    required
                                >
                                    <option value="">Talep Seçin</option>
                                    {demands.map((demand) => (
                                        <option key={demand.id} value={demand.id}>
                                            {demand.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <Label htmlFor="providerId">Sağlayıcı *</Label>
                                <select
                                    id="providerId"
                                    name="providerId"
                                    value={formData.providerId}
                                    onChange={handleInputChange}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                    required
                                >
                                    <option value="">Sağlayıcı Seçin</option>
                                    {users.filter(u => u.userType === 'PROVIDER').map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name || user.phoneNumber || user.email || user.id}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <Label htmlFor="price">Fiyat (₺) *</Label>
                                <Input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="estimatedTime">Tahmini Süre *</Label>
                                <Input
                                    type="text"
                                    id="estimatedTime"
                                    name="estimatedTime"
                                    value={formData.estimatedTime}
                                    onChange={handleInputChange}
                                    placeholder="Örn: 2 gün, 1 hafta"
                                    required
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

