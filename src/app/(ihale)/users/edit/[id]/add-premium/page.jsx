"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from '@/components/ui/button/Button';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from '@/axios';
import { getImage } from '@/utils';

export default function AddPremium({ params }) {
  const router = useRouter();
  const { id } = params;
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [formData, setFormData] = useState({
    days: '',
    description: ''
  });

  // Predefined premium duration options
  const premiumOptions = [
    { label: '1 Hafta (7 gün)', value: '7' },
    { label: '2 Hafta (14 gün)', value: '14' },
    { label: '1 Ay (30 gün)', value: '30' },
    { label: '2 Ay (60 gün)', value: '60' },
    { label: '3 Ay (90 gün)', value: '90' },
    { label: '6 Ay (180 gün)', value: '180' },
    { label: '1 Yıl (365 gün)', value: '365' },
    { label: 'Özel', value: 'custom' }
  ];

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setFetchLoading(true);
        setError(null);
        
        const response = await axios.get(`/admin/users/${id}`);
        setUser(response.data);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Kullanıcı bilgileri yüklenirken bir hata oluştu.');
      } finally {
        setFetchLoading(false);
      }
    };
    
    if (id) {
      fetchUser();
    }
  }, [id]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
    setSuccess(null);
  };

  const handlePremiumDurationChange = (value) => {
    if (value !== 'custom') {
      setFormData(prev => ({
        ...prev,
        days: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        days: ''
      }));
    }
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.days || formData.days <= 0) {
      setError('Lütfen geçerli bir gün sayısı girin.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(`/admin/users/${id}/add-premium`, {
        days: parseInt(formData.days),
        description: formData.description
      });
      
      setSuccess('Premium başarıyla eklendi!');
      
      // Update user data to show new premium end date
      setUser(prev => ({
        ...prev,
        premiumEndDate: response.data.premiumEndDate
      }));
      
      // Reset form
      setFormData({
        days: '',
        description: ''
      });
      
    } catch (err) {
      console.error('Error adding premium:', err);
      setError(err.response?.data?.message || 'Premium eklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Format premium status
  const formatPremiumStatus = (premiumEndDate) => {
    if (!premiumEndDate) return { status: "Hayır", color: "text-red-600" };

    const endDate = new Date(premiumEndDate);
    const now = new Date();

    if (endDate > now) {
      const diffTime = Math.abs(endDate - now);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return { 
        status: `Aktif (${diffDays} gün kaldı)`, 
        color: "text-green-600",
        endDate: endDate.toLocaleDateString('tr-TR')
      };
    } else {
      return { status: "Süresi Dolmuş", color: "text-orange-600" };
    }
  };

  if (fetchLoading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Premium Ekle" />
        <div className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center">
            <Icon icon="eos-icons:loading" className="text-4xl text-primary animate-spin" />
            <span className="mt-3 text-gray-600 dark:text-gray-400">Kullanıcı bilgileri yükleniyor...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Premium Ekle" />
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400">Kullanıcı bulunamadı.</p>
        </div>
      </div>
    );
  }

  const premiumStatus = formatPremiumStatus(user.premiumEndDate);

  return (
    <div>
      <PageBreadcrumb pageTitle="Premium Ekle" />
      <div className="space-y-6">
        {/* User Info Card */}
        <ComponentCard
          title="Kullanıcı Bilgileri"
        >
          <div className="flex items-center space-x-4">
            <img
              src={user.images?.[0] ? getImage(user.images[0]) : '/images/default-avatar.png'}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{user.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{user.credential}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Premium Durumu: <span className={`font-semibold ${premiumStatus.color}`}>{premiumStatus.status}</span>
              </p>
              {premiumStatus.endDate && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Bitiş Tarihi: <span className="font-semibold">{premiumStatus.endDate}</span>
                </p>
              )}
            </div>
          </div>
        </ComponentCard>

        {/* Add Premium Form */}
        <ComponentCard
          title="Premium Ekle"
          desc="Kullanıcıya premium üyelik eklemek için aşağıdaki formu kullanın"
        >
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-md">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <Label>Premium Süresi *</Label>
                <Select
                  options={premiumOptions}
                  placeholder="Premium süresini seçin"
                  onChange={handlePremiumDurationChange}
                />
              </div>
              
              {(formData.days === '' || !premiumOptions.find(opt => opt.value === formData.days)) && (
                <div>
                  <Label>Özel Gün Sayısı *</Label>
                  <Input 
                    type="number" 
                    placeholder="Gün sayısını girin" 
                    value={formData.days}
                    onChange={(e) => handleChange('days', e.target.value)}
                    min="1"
                    step="1"
                    required
                  />
                </div>
              )}
            </div>
            
            <div>
              <Label>Açıklama</Label>
              <Input 
                type="text" 
                placeholder="Premium ekleme sebebi (opsiyonel)" 
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>
            
            <div className="flex gap-3">
              <Button 
                type="submit"
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Icon icon="eos-icons:loading" className="mr-2" />
                    Premium Ekleniyor...
                  </>
                ) : (
                  <>
                    <Icon icon="heroicons:star" className="mr-2" />
                    Premium Ekle
                  </>
                )}
              </Button>
              <Button 
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
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
