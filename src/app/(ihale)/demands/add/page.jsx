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

export default function AddDemand() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        userId: "",
        title: "",
        description: "",
        categoryId: "",
        location: "",
        latitude: "",
        longitude: "",
        budget: "",
        images: [],
        peopleCount: "",
        eventDate: "",
        eventTime: "",
        isUrgent: false,
        deadline: "",
        address: "",
        questionResponses: null,
        status: "ACTIVE",
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
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const data = {
                ...formData,
                userId: formData.userId || undefined,
                category: formData.categoryId || undefined,
                latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
                longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
                budget: formData.budget ? parseFloat(formData.budget) : undefined,
                peopleCount: formData.peopleCount ? parseInt(formData.peopleCount) : undefined,
                eventDate: formData.eventDate || undefined,
                images: formData.images.length > 0 ? formData.images : undefined,
            };

            // Remove empty fields
            Object.keys(data).forEach(key => {
                if (data[key] === "" || data[key] === null || data[key] === undefined) {
                    delete data[key];
                }
            });

            await axios.post('/admin/demands', data);
            router.push('/demands');
        } catch (error) {
            console.error('Error creating demand:', error);
            alert(error.response?.data?.message || error.message || 'Talep oluşturulurken bir hata oluştu.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <PageBreadcrumb pageTitle="Yeni Talep Ekle" />
            <div className="space-y-6">
                <ComponentCard
                    title="Talep Bilgileri"
                    desc="Yeni bir talep oluşturmak için aşağıdaki formu doldurun"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="userId">Kullanıcı *</Label>
                                <select
                                    id="userId"
                                    name="userId"
                                    value={formData.userId}
                                    onChange={handleInputChange}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                    required
                                >
                                    <option value="">Kullanıcı Seçin</option>
                                    {users.map((user) => (
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
                                    placeholder="Talep başlığı"
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
                                    placeholder="Talep açıklaması"
                                    rows={4}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="budget">Bütçe (₺)</Label>
                                <Input
                                    type="number"
                                    id="budget"
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleInputChange}
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                />
                            </div>

                            <div>
                                <Label htmlFor="peopleCount">Kişi Sayısı</Label>
                                <Input
                                    type="number"
                                    id="peopleCount"
                                    name="peopleCount"
                                    value={formData.peopleCount}
                                    onChange={handleInputChange}
                                    placeholder="1"
                                    min="1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="eventDate">Etkinlik Tarihi</Label>
                                <Input
                                    type="date"
                                    id="eventDate"
                                    name="eventDate"
                                    value={formData.eventDate}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div>
                                <Label htmlFor="eventTime">Etkinlik Saati</Label>
                                <Input
                                    type="time"
                                    id="eventTime"
                                    name="eventTime"
                                    value={formData.eventTime}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div>
                                <Label htmlFor="deadline">Teslim Süresi</Label>
                                <Input
                                    type="text"
                                    id="deadline"
                                    name="deadline"
                                    value={formData.deadline}
                                    onChange={handleInputChange}
                                    placeholder="Örn: 2 gün, 1 hafta"
                                />
                            </div>

                            <div>
                                <Label htmlFor="location">Konum</Label>
                                <Input
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    placeholder="Şehir, İlçe"
                                />
                            </div>

                            <div>
                                <Label htmlFor="address">Adres</Label>
                                <Input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder="Detaylı adres"
                                />
                            </div>

                            <div>
                                <Label htmlFor="latitude">Enlem</Label>
                                <Input
                                    type="number"
                                    id="latitude"
                                    name="latitude"
                                    value={formData.latitude}
                                    onChange={handleInputChange}
                                    placeholder="41.0082"
                                    step="any"
                                />
                            </div>

                            <div>
                                <Label htmlFor="longitude">Boylam</Label>
                                <Input
                                    type="number"
                                    id="longitude"
                                    name="longitude"
                                    value={formData.longitude}
                                    onChange={handleInputChange}
                                    placeholder="28.9784"
                                    step="any"
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
                                    <option value="ACTIVE">Aktif</option>
                                    <option value="CLOSED">Kapalı</option>
                                    <option value="COMPLETED">Tamamlandı</option>
                                    <option value="CANCELLED">İptal</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isUrgent"
                                    name="isUrgent"
                                    checked={formData.isUrgent}
                                    onChange={handleInputChange}
                                    className="w-4 h-4"
                                />
                                <Label htmlFor="isUrgent" className="mb-0">
                                    Acil
                                </Label>
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

