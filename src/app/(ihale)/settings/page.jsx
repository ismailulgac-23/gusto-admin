"use client";
import React, { useState, useEffect } from 'react';
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from '@/components/common/ComponentCard';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import LoadingContainer from '@/components/royal-common/LoadingContainer';
import { Icon } from "@iconify/react";
import axios from '@/axios';

const SettingsPage = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newCityName, setNewCityName] = useState('');
  const [addingCity, setAddingCity] = useState(false);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/settings/admin/cities`);
      setCities(response.data.data || []);
    } catch (error) {
      console.error('Hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCity = async (cityId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/settings/admin/cities/${cityId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !currentStatus,
        }),
      });

      if (response.ok) {
        await fetchCities();
      } else {
        const data = await response.json();
        alert(data.message || 'Şehir durumu güncellenemedi');
      }
    } catch (error) {
      console.error('Hata:', error);
      alert('Bir hata oluştu');
    }
  };

  const handleAddCity = async () => {
    if (!newCityName.trim()) {
      alert('Lütfen şehir adı giriniz');
      return;
    }

    try {
      setAddingCity(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/settings/admin/cities`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newCityName.trim(),
        }),
      });

      if (response.ok) {
        setNewCityName('');
        await fetchCities();
      } else {
        const data = await response.json();
        alert(data.message || 'Şehir eklenemedi');
      }
    } catch (error) {
      console.error('Hata:', error);
      alert('Bir hata oluştu');
    } finally {
      setAddingCity(false);
    }
  };

  const handleBulkUpdate = async () => {
    const activeCityIds = cities.filter(city => city.isActive).map(city => city.id);

    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/settings/admin/cities`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cityIds: activeCityIds,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert('Aktif şehirler başarıyla güncellendi');
        await fetchCities();
      } else {
        const data = await response.json();
        alert(data.message || 'Şehirler güncellenemedi');
      }
    } catch (error) {
      console.error('Hata:', error);
      alert('Bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageBreadcrumb
        pageTitle="Genel Ayarlar"
        onSave={handleBulkUpdate}
        saving={saving}
        saveText="Değişiklikleri Kaydet"
      />

      <LoadingContainer loading={loading}>
        <div className="w-full space-y-6">
          <ComponentCard title="Aktif Şehirler">
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Uygulamanın aktif olduğu şehirleri seçin. Kullanıcılar kayıt olurken sadece aktif şehirlerden seçim yapabilecekler.
              </p>

              {/* Yeni Şehir Ekle */}
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <Label>Yeni Şehir Ekle</Label>
                  <Input
                    type="text"
                    value={newCityName}
                    onChange={(e) => setNewCityName(e.target.value)}
                    placeholder="Şehir adı (örn: İstanbul)"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddCity();
                      }
                    }}
                  />
                </div>
                <button
                  onClick={handleAddCity}
                  disabled={addingCity || !newCityName.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:cursor-not-allowed"
                >
                  {addingCity ? 'Ekleniyor...' : 'Ekle'}
                </button>
              </div>

              {/* Şehir Listesi */}
              <div className="mt-6">
                <Label>Şehirler ({cities.filter(c => c.isActive).length} aktif)</Label>
                <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
                  {cities.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                      Henüz şehir eklenmemiş
                    </p>
                  ) : (
                    cities.map((city) => (
                      <div
                        key={city.id}
                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            icon="ri:map-pin-line"
                            className="text-xl text-gray-400"
                          />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {city.name}
                          </span>
                          {city.isActive && (
                            <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                              Aktif
                            </span>
                          )}
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={city.isActive}
                            onChange={() => handleToggleCity(city.id, city.isActive)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </ComponentCard>
        </div>
      </LoadingContainer>
    </div>
  );
};

export default SettingsPage;

