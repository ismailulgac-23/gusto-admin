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
import MapPicker from "@/components/map/MapPicker";

export default function AddCharityActivity() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        providerId: "",
        categoryId: "",
        title: "",
        description: "",
        latitude: "",
        longitude: "",
        address: "",
        estimatedEndTime: "",
    });

    useEffect(() => {
        fetchUsers();
        fetchCategories();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/admin/users');
            setUsers(response.data.data || response.data || []);
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/admin/categories');
            setCategories(response.data.data || response.data || []);
        } catch (err) {
            console.error('Error fetching categories:', err);
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

            await axios.post('/admin/charity-activities', data);
            router.push('/charity-activities');
        } catch (error) {
            console.error('Error creating charity activity:', error);
            alert(error.response?.data?.message || error.message || 'Hayır işi oluşturulurken bir hata oluştu.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <PageBreadcrumb pageTitle="Yeni Hayır İşi Ekle" />
            <div className="space-y-6">
                <ComponentCard
                    title="Hayır İşi Bilgileri"
                    desc="Yeni bir hayır işi oluşturmak için aşağıdaki formu doldurun"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                <Label htmlFor="categoryId">Kategori *</Label>
                                <select
                                    id="categoryId"
                                    name="categoryId"
                                    value={formData.categoryId}
                                    onChange={handleInputChange}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                    required
                                >
                                    <option value="">Kategori Seçin</option>
                                    {categories.filter(cat => cat.isActive).map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

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

