"use client";
import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import axios from "@/axios";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function EditDemandModal({ isOpen, onClose, demandId, onSuccess }) {
    const [demand, setDemand] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    
    // Form data
    const [formData, setFormData] = useState({
        title: '',
        categoryId: '',
        userId: '',
        status: 'ACTIVE',
        location: '',
        address: '',
        latitude: '',
        longitude: '',
        eventDate: '',
        eventTime: '',
        isUrgent: false,
        countie: '',
        questionResponses: {},
    });
    
    // Options
    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCityIds, setSelectedCityIds] = useState([]);
    const [countiesByCity, setCountiesByCity] = useState({}); // { cityId: [counties] }
    const [availableCounties, setAvailableCounties] = useState({}); // { cityName: [counties] }
    const [loadingCounties, setLoadingCounties] = useState({});
    
    useEffect(() => {
        if (isOpen && demandId) {
            fetchDemand();
            fetchCategories();
            fetchUsers();
            fetchCities();
        }
    }, [isOpen, demandId]);
    
    const fetchDemand = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`/admin/demands/${demandId}`);
            const data = response.data.data;
            
            setDemand(data);
            
            // Parse countie JSON if exists
            let parsedCounties = {};
            if (data.countie) {
                try {
                    parsedCounties = JSON.parse(data.countie);
                } catch (e) {
                    console.error('Error parsing countie:', e);
                }
            }
            
            // Set selected cities
            const cityIds = data.cities?.map(c => c.cityId) || [];
            setSelectedCityIds(cityIds);
            
            // Load counties for selected cities
            const countiesMap = {};
            for (const cityRelation of data.cities || []) {
                const cityName = cityRelation.city?.name;
                if (cityName && parsedCounties[cityName]) {
                    countiesMap[cityRelation.cityId] = parsedCounties[cityName];
                }
            }
            setCountiesByCity(countiesMap);
            
            // Load counties data for all selected cities
            for (const cityRelation of data.cities || []) {
                if (cityRelation.city?.name) {
                    loadCountiesForCity(cityRelation.city.name, cityRelation.cityId);
                }
            }
            
            setFormData({
                title: data.title || '',
                categoryId: data.categoryId || '',
                userId: data.userId || '',
                status: data.status || 'ACTIVE',
                location: data.location || '',
                address: data.address || '',
                latitude: data.latitude?.toString() || '',
                longitude: data.longitude?.toString() || '',
                eventDate: data.eventDate ? new Date(data.eventDate).toISOString().split('T')[0] : '',
                eventTime: data.eventTime || '',
                isUrgent: data.isUrgent || false,
                countie: data.countie || '',
                questionResponses: data.questionResponses || {},
            });
        } catch (err) {
            console.error('Error fetching demand:', err);
            setError('Talep bilgileri yüklenirken bir hata oluştu.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const fetchCategories = async () => {
        try {
            const response = await axios.get('/admin/categories', {
                params: { isActive: true, limit: 1000 }
            });
            setCategories(response.data.data || []);
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };
    
    const fetchUsers = async () => {
        try {
            const response = await axios.get('/admin/users', {
                params: { limit: 1000 }
            });
            // API returns { success: true, data: [...users], pagination: {...} }
            setUsers(Array.isArray(response.data.data) ? response.data.data : []);
        } catch (err) {
            console.error('Error fetching users:', err);
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
    
    const loadCountiesForCity = async (cityName, cityId) => {
        if (availableCounties[cityName]) return; // Already loaded
        
        setLoadingCounties(prev => ({ ...prev, [cityId]: true }));
        try {
            const response = await axios.get(`/locations/cities/${cityName}/counties`);
            setAvailableCounties(prev => ({
                ...prev,
                [cityName]: response.data.data || []
            }));
        } catch (err) {
            console.error('Error fetching counties:', err);
        } finally {
            setLoadingCounties(prev => ({ ...prev, [cityId]: false }));
        }
    };
    
    const handleCityToggle = async (cityId) => {
        const city = cities.find(c => c.id === cityId);
        if (!city) return;
        
        if (selectedCityIds.includes(cityId)) {
            // Remove city
            setSelectedCityIds(prev => prev.filter(id => id !== cityId));
            setCountiesByCity(prev => {
                const newMap = { ...prev };
                delete newMap[cityId];
                return newMap;
            });
        } else {
            // Add city
            setSelectedCityIds(prev => [...prev, cityId]);
            // Load counties for this city
            await loadCountiesForCity(city.name, cityId);
        }
    };
    
    const handleCountyToggle = (cityId, county) => {
        setCountiesByCity(prev => {
            const current = prev[cityId] || [];
            const newCounties = current.includes(county)
                ? current.filter(c => c !== county)
                : [...current, county];
            return { ...prev, [cityId]: newCounties };
        });
    };
    
    const renderQuestionInput = (question) => {
        const currentValue = formData.questionResponses[question.id];
        
        switch (question.type) {
            case 'number':
                return (
                    <div className="relative">
                        <input
                            type="number"
                            step="any"
                            value={currentValue || ''}
                            onChange={(e) => {
                                const value = e.target.value === '' ? null : (parseFloat(e.target.value) || 0);
                                setFormData({
                                    ...formData,
                                    questionResponses: {
                                        ...formData.questionResponses,
                                        [question.id]: value
                                    }
                                });
                            }}
                            placeholder={question.placeholder || 'Sayı giriniz'}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                        {question.unit && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                    {question.unit}
                                </span>
                            </div>
                        )}
                    </div>
                );
            
            case 'text':
                return (
                    <textarea
                        rows={4}
                        value={currentValue || ''}
                        onChange={(e) => setFormData({
                            ...formData,
                            questionResponses: {
                                ...formData.questionResponses,
                                [question.id]: e.target.value
                            }
                        })}
                        placeholder={question.placeholder || 'Cevabınızı yazın'}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                    />
                );
            
            case 'select':
                if (!question.options || question.options.length === 0) {
                    return (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            Seçenek bulunamadı
                        </div>
                    );
                }
                
                return (
                    <div className="space-y-2">
                        {question.options.map((option, optIdx) => {
                            const isSelected = currentValue === option.value;
                            return (
                                <label
                                    key={optIdx}
                                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                                        isSelected
                                            ? 'bg-primary/10 border-primary text-primary'
                                            : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name={`question-${question.id}`}
                                        checked={isSelected}
                                        onChange={() => setFormData({
                                            ...formData,
                                            questionResponses: {
                                                ...formData.questionResponses,
                                                [question.id]: option.value
                                            }
                                        })}
                                        className="w-4 h-4 text-primary"
                                    />
                                    <span className="flex-1">{option.label}</span>
                                    {isSelected && (
                                        <Icon icon="ri:check-circle-fill" className="text-primary text-xl" />
                                    )}
                                </label>
                            );
                        })}
                    </div>
                );
            
            case 'multiselect':
                if (!question.options || question.options.length === 0) {
                    return (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            Seçenek bulunamadı
                        </div>
                    );
                }
                
                const selectedValues = Array.isArray(currentValue) ? currentValue : [];
                
                return (
                    <div className="space-y-2">
                        {question.options.map((option, optIdx) => {
                            const isSelected = selectedValues.includes(option.value);
                            return (
                                <label
                                    key={optIdx}
                                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                                        isSelected
                                            ? 'bg-primary/10 border-primary text-primary'
                                            : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={(e) => {
                                            const newValues = e.target.checked
                                                ? [...selectedValues, option.value]
                                                : selectedValues.filter(v => v !== option.value);
                                            setFormData({
                                                ...formData,
                                                questionResponses: {
                                                    ...formData.questionResponses,
                                                    [question.id]: newValues
                                                }
                                            });
                                        }}
                                        className="w-4 h-4 text-primary rounded"
                                    />
                                    <span className="flex-1">{option.label}</span>
                                    {isSelected && (
                                        <Icon icon="ri:check-circle-fill" className="text-primary text-xl" />
                                    )}
                                </label>
                            );
                        })}
                    </div>
                );
            
            case 'boolean':
                const boolValue = currentValue === true || currentValue === 'true';
                return (
                    <div className="flex items-center justify-between p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                        <div className="flex-1">
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {boolValue ? 'Evet' : 'Hayır'}
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setFormData({
                                ...formData,
                                questionResponses: {
                                    ...formData.questionResponses,
                                    [question.id]: !boolValue
                                }
                            })}
                            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                                boolValue ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                        >
                            <span
                                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                                    boolValue ? 'translate-x-7' : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>
                );
            
            case 'date':
                const dateValue = currentValue ? (typeof currentValue === 'string' ? currentValue.split('T')[0] : new Date(currentValue).toISOString().split('T')[0]) : '';
                return (
                    <input
                        type="date"
                        value={dateValue}
                        onChange={(e) => {
                            const date = e.target.value ? new Date(e.target.value).toISOString() : null;
                            setFormData({
                                ...formData,
                                questionResponses: {
                                    ...formData.questionResponses,
                                    [question.id]: date
                                }
                            });
                        }}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                );
            
            default:
                return (
                    <input
                        type="text"
                        value={currentValue || ''}
                        onChange={(e) => setFormData({
                            ...formData,
                            questionResponses: {
                                ...formData.questionResponses,
                                [question.id]: e.target.value
                            }
                        })}
                        placeholder={question.placeholder || 'Cevabınızı yazın'}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                );
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        
        try {
            // Prepare countie JSON
            const countieData = {};
            for (const cityId of selectedCityIds) {
                const city = cities.find(c => c.id === cityId);
                const counties = countiesByCity[cityId] || [];
                if (city && counties.length > 0) {
                    countieData[city.name] = counties;
                }
            }
            
            const updateData = {
                ...formData,
                cityIds: selectedCityIds,
                countie: Object.keys(countieData).length > 0 ? JSON.stringify(countieData) : '',
                latitude: formData.latitude ? parseFloat(formData.latitude) : null,
                longitude: formData.longitude ? parseFloat(formData.longitude) : null,
                eventDate: formData.eventDate || null,
            };
            
            await axios.patch(`/admin/demands/${demandId}`, updateData);
            
            if (onSuccess) {
                onSuccess();
            }
            onClose();
        } catch (err) {
            console.error('Error updating demand:', err);
            setError(err.response?.data?.message || 'Talep güncellenirken bir hata oluştu.');
        } finally {
            setIsSaving(false);
        }
    };
    
    if (!isOpen) return null;
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl max-h-[90vh] overflow-y-auto p-6">
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Talep Düzenle
                    </h2>
                </div>
                
                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <Icon icon="eos-icons:loading" className="text-4xl text-primary" />
                    </div>
                ) : error && !demand ? (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <p className="text-red-600 dark:text-red-400">{error}</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                <p className="text-red-600 dark:text-red-400">{error}</p>
                            </div>
                        )}
                        
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Başlık *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Durum
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                >
                                    <option value="ACTIVE">Aktif</option>
                                    <option value="CLOSED">Kapalı</option>
                                    <option value="COMPLETED">Tamamlandı</option>
                                    <option value="CANCELLED">İptal</option>
                                </select>
                            </div>
                        </div>
                        
                        {/* Category & User */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Kategori *
                                </label>
                                <select
                                    required
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                >
                                    <option value="">Seçiniz</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Talep Sahibi *
                                </label>
                                <select
                                    required
                                    value={formData.userId}
                                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                >
                                    <option value="">Seçiniz</option>
                                    {users.map(user => (
                                        <option key={user.id} value={user.id}>
                                            {user.name || user.phoneNumber || user.id}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        
                        {/* Location */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Konum
                                </label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Adres
                                </label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Enlem
                                </label>
                                <input
                                    type="number"
                                    step="any"
                                    value={formData.latitude}
                                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Boylam
                                </label>
                                <input
                                    type="number"
                                    step="any"
                                    value={formData.longitude}
                                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                />
                            </div>
                        </div>
                        
                        {/* Cities & Counties */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Şehirler ve İlçeler *
                        </label>
                            <div className="space-y-4 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                {cities.map(city => {
                                    const isSelected = selectedCityIds.includes(city.id);
                                    const cityCounties = availableCounties[city.name] || [];
                                    const selectedCounties = countiesByCity[city.id] || [];
                                    
                                    return (
                                        <div key={city.id} className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-4 last:pb-0">
                                            <div className="flex items-center gap-3 mb-3">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => handleCityToggle(city.id)}
                                                    className="w-5 h-5 text-primary rounded"
                                                />
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {city.name}
                                                </span>
                                                {loadingCounties[city.id] && (
                                                    <Icon icon="eos-icons:loading" className="text-sm" />
                                                )}
                                            </div>
                                            
                                            {isSelected && cityCounties.length > 0 && (
                                                <div className="ml-8 mt-2 space-y-2">
                                                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                        İlçeler:
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {cityCounties.map(county => {
                                                            const isCountySelected = selectedCounties.includes(county);
                                                            return (
                                                                <label
                                                                    key={county}
                                                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer transition-colors ${
                                                                        isCountySelected
                                                                            ? 'bg-primary/10 border-primary text-primary'
                                                                            : 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                                                                    }`}
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={isCountySelected}
                                                                        onChange={() => handleCountyToggle(city.id, county)}
                                                                        className="w-4 h-4 text-primary rounded"
                                                                    />
                                                                    <span className="text-sm">{county}</span>
                                                                </label>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        
                        {/* Event Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Etkinlik Tarihi
                                </label>
                                <input
                                    type="date"
                                    value={formData.eventDate}
                                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Etkinlik Saati
                                </label>
                                <input
                                    type="time"
                                    value={formData.eventTime}
                                    onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                />
                            </div>
                        </div>
                        
                        {/* Other Fields */}
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={formData.isUrgent}
                                onChange={(e) => setFormData({ ...formData, isUrgent: e.target.checked })}
                                className="w-5 h-5 text-primary rounded"
                            />
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Acil Talep
                            </label>
                        </div>
                        
                        {/* Question Responses */}
                        {demand?.category?.questions && Array.isArray(demand.category.questions) && demand.category.questions.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                                    Soru Cevapları
                                </label>
                                <div className="space-y-6">
                                    {demand.category.questions.map((question, idx) => (
                                        <div key={question.id || idx} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                                {question.question}
                                                {question.required && <span className="text-red-500 ml-1">*</span>}
                                            </label>
                                            {renderQuestionInput(question)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={isSaving}
                            >
                                İptal
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <>
                                        <Icon icon="eos-icons:loading" className="mr-2" />
                                        Kaydediliyor...
                                    </>
                                ) : (
                                    'Kaydet'
                                )}
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </Modal>
    );
}

