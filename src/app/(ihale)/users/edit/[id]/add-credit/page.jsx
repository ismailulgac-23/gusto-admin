"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from '@/components/ui/button/Button';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from '@/axios';
import { getImage } from '@/utils';

export default function AddCredit({ params }) {
  const router = useRouter();
  const { id } = params;
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [formData, setFormData] = useState({
    amount: '',
    description: ''
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.amount || formData.amount <= 0) {
      setError('Lütfen geçerli bir kredi miktarı girin.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(`/admin/users/${id}/add-credit`, {
        amount: parseFloat(formData.amount),
        description: formData.description
      });
      
      setSuccess('Kredi başarıyla eklendi!');
      
      // Update user data to show new balance
      setUser(prev => ({
        ...prev,
        balance: response.data.user.balance
      }));
      
      // Reset form
      setFormData({
        amount: '',
        description: ''
      });
      
    } catch (err) {
      console.error('Error adding credit:', err);
      setError(err.response?.data?.message || 'Kredi eklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Kredi Ekle" />
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
        <PageBreadcrumb pageTitle="Kredi Ekle" />
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400">Kullanıcı bulunamadı.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Kredi Ekle" />
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
                Mevcut Bakiye: <span className="font-semibold text-green-600">{user.balance?.toLocaleString('tr-TR') || '0'} Kredi</span>
              </p>
            </div>
          </div>
        </ComponentCard>

        {/* Add Credit Form */}
        <ComponentCard
          title="Kredi Ekle"
          desc="Kullanıcıya kredi eklemek için aşağıdaki formu kullanın"
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
                <Label>Kredi Miktarı *</Label>
                <Input 
                  type="number" 
                  placeholder="Eklenecek kredi miktarı" 
                  value={formData.amount}
                  onChange={(e) => handleChange('amount', e.target.value)}
                  min="1"
                  step="1"
                  required
                />
              </div>
              
              <div>
                <Label>Açıklama</Label>
                <Input 
                  type="text" 
                  placeholder="Kredi ekleme sebebi (opsiyonel)" 
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Icon icon="eos-icons:loading" className="mr-2" />
                    Kredi Ekleniyor...
                  </>
                ) : (
                  <>
                    <Icon icon="heroicons:plus-circle" className="mr-2" />
                    Kredi Ekle
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
