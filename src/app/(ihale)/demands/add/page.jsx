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
    const [cities, setCities] = useState([]);
    const [availableCounties, setAvailableCounties] = useState([]);
    const [loadingCounties, setLoadingCounties] = useState(false);
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
        cityId: "",
        county: "",
    });

    useEffect(() => {
        fetchUsers();
        fetchCategories();
        fetchCities();
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

    const fetchCities = async () => {
        try {
            const response = await axios.get('/settings/admin/cities');
            setCities(response.data.data || []);
        } catch (err) {
            console.error('Error fetching cities:', err);
        }
    };

    const loadCountiesForCity = async (cityName) => {
        setLoadingCounties(true);
        try {
            const response = await axios.get(`/locations/cities/${cityName}/counties`);
            setAvailableCounties(response.data.data || []);
        } catch (err) {
            console.error('Error fetching counties:', err);
            setAvailableCounties([]);
        } finally {
            setLoadingCounties(false);
        }
    };

    const handleCityChange = async (cityId) => {
        const city = cities.find(c => c.id === cityId);
        setFormData(prev => ({
            ...prev,
            cityId,
            county: '' // Reset county when city changes
        }));
        setAvailableCounties([]); // Reset available counties
        
        if (city && city.name) {
            await loadCountiesForCity(city.name);
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
            // Prepare countie JSON for single city/county
            const city = cities.find(c => c.id === formData.cityId);
            const countieData = {};
            if (city && formData.county) {
                countieData[city.name] = [formData.county];
            }

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
                cityIds: formData.cityId ? [formData.cityId] : undefined,
                countie: Object.keys(countieData).length > 0 ? JSON.stringify(countieData) : undefined,
            };

            // Remove empty fields and form-specific fields
            Object.keys(data).forEach(key => {
                if (data[key] === "" || data[key] === null || data[key] === undefined || key === 'cityId' || key === 'county') {
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
                                <Label htmlFor="cityId">Şehir *</Label>
                                <select
                                    id="cityId"
                                    name="cityId"
                                    value={formData.cityId}
                                    onChange={(e) => handleCityChange(e.target.value)}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                    required
                                >
                                    <option value="">Şehir Seçin</option>
                                    {cities.filter(city => city.isActive).map((city) => (
                                        <option key={city.id} value={city.id}>
                                            {city.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <Label htmlFor="county">İlçe *</Label>
                                <div className="relative">
                                    <select
                                        id="county"
                                        name="county"
                                        value={formData.county}
                                        onChange={handleInputChange}
                                        disabled={!formData.cityId || loadingCounties}
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 disabled:opacity-50"
                                        required
                                    >
                                        <option value="">İlçe Seçin</option>
                                        {availableCounties.map((county) => (
                                            <option key={county} value={county}>
                                                {county}
                                            </option>
                                        ))}
                                    </select>
                                    {loadingCounties && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            <Icon icon="eos-icons:loading" className="text-sm" />
                                        </div>
                                    )}
                                </div>
                                {!formData.cityId && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        Önce bir şehir seçiniz
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="location">Konum</Label>
                                <Input
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    placeholder="Ek konum bilgisi"
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

