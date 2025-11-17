"use client";
import React, { useState, useEffect } from 'react';
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from '@/components/common/ComponentCard';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import Select from '@/components/form/Select';
import LoadingContainer from '@/components/royal-common/LoadingContainer';
import { Icon } from "@iconify/react";

const NotificationsPage = () => {
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [sendMode, setSendMode] = useState('single'); // 'single', 'multiple', 'all'
  
  // Form data
  const [formData, setFormData] = useState({
    userId: '',
    userIds: [],
    title: '',
    body: '',
    userType: '',
    cityId: '',
    search: '',
  });

  // Filter options
  const [cities, setCities] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchCities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (formData.search || formData.userType || formData.cityId) {
      filterUsers();
    } else {
      setFilteredUsers(users);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.search, formData.userType, formData.cityId, users]);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (formData.userType) params.append('userType', formData.userType);
      if (formData.cityId) params.append('cityId', formData.cityId);
      if (formData.search) params.append('search', formData.search);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/admin/notifications/users?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUsers(data.data || []);
        setFilteredUsers(data.data || []);
      }
    } catch (error) {
      console.error('Hata:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchCities = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/settings/admin/cities`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCities(data.data || []);
      }
    } catch (error) {
      console.error('Hata:', error);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    if (formData.search) {
      const searchLower = formData.search.toLowerCase();
      filtered = filtered.filter(user => 
        (user.name || '').toLowerCase().includes(searchLower) ||
        (user.phoneNumber || '').includes(searchLower) ||
        (user.email || '').toLowerCase().includes(searchLower)
      );
    }

    if (formData.userType) {
      filtered = filtered.filter(user => user.userType === formData.userType);
    }

    if (formData.cityId) {
      filtered = filtered.filter(user => user.cityId === formData.cityId);
    }

    setFilteredUsers(filtered);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUserSelect = (userId) => {
    if (sendMode === 'single') {
      setFormData(prev => ({ ...prev, userId }));
    } else if (sendMode === 'multiple') {
      setFormData(prev => ({
        ...prev,
        userIds: prev.userIds.includes(userId)
          ? prev.userIds.filter(id => id !== userId)
          : [...prev.userIds, userId],
      }));
    }
  };

  const handleSend = async () => {
    if (!formData.title.trim() || !formData.body.trim()) {
      alert('Lütfen başlık ve mesaj giriniz');
      return;
    }

    if (sendMode === 'single' && !formData.userId) {
      alert('Lütfen bir kullanıcı seçiniz');
      return;
    }

    if (sendMode === 'multiple' && formData.userIds.length === 0) {
      alert('Lütfen en az bir kullanıcı seçiniz');
      return;
    }

    try {
      setSending(true);
      const token = localStorage.getItem('token');
      let url = '';
      let body = {};

      if (sendMode === 'single') {
        url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/admin/notifications/send-single`;
        body = {
          userId: formData.userId,
          title: formData.title,
          body: formData.body,
        };
      } else if (sendMode === 'multiple') {
        url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/admin/notifications/send-multiple`;
        body = {
          userIds: formData.userIds,
          title: formData.title,
          body: formData.body,
        };
      } else {
        url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/admin/notifications/send-all`;
        body = {
          title: formData.title,
          body: formData.body,
          ...(formData.userType && { userType: formData.userType }),
          ...(formData.cityId && { cityId: formData.cityId }),
        };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || 'Bildirim başarıyla gönderildi');
        setFormData({
          userId: '',
          userIds: [],
          title: '',
          body: '',
          userType: '',
          cityId: '',
          search: '',
        });
      } else {
        alert(data.message || 'Bildirim gönderilemedi');
      }
    } catch (error) {
      console.error('Hata:', error);
      alert('Bir hata oluştu');
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <PageBreadcrumb 
        pageTitle="Bildirim Yönetimi" 
        onSave={handleSend} 
        saving={sending}
        saveText="Bildirim Gönder"
      />

      <LoadingContainer loading={loading}>
        <div className="w-full space-y-6">
          <ComponentCard title="Bildirim Gönder">
            <div className="space-y-6">
              {/* Send Mode Selection */}
              <div>
                <Label>Gönderim Tipi</Label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sendMode"
                      value="single"
                      checked={sendMode === 'single'}
                      onChange={(e) => setSendMode(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span>Tekli</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sendMode"
                      value="multiple"
                      checked={sendMode === 'multiple'}
                      onChange={(e) => setSendMode(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span>Çoklu</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sendMode"
                      value="all"
                      checked={sendMode === 'all'}
                      onChange={(e) => setSendMode(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span>Tümü</span>
                  </label>
                </div>
              </div>

              {/* Filters (for multiple and all) */}
              {(sendMode === 'multiple' || sendMode === 'all') && (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Kullanıcı Tipi</Label>
                    <Select
                      options={[
                        { value: '', label: 'Tümü' },
                        { value: 'PROVIDER', label: 'Hizmet Sağlayıcı' },
                        { value: 'RECEIVER', label: 'Talep Oluşturan' },
                      ]}
                      value={formData.userType}
                      onChange={(value) => {
                        setFormData(prev => ({ ...prev, userType: value }));
                        fetchUsers();
                      }}
                      placeholder="Seçiniz"
                    />
                  </div>
                  <div>
                    <Label>Şehir</Label>
                    <Select
                      options={[
                        { value: '', label: 'Tümü' },
                        ...cities.map(city => ({
                          value: city.id,
                          label: city.name,
                        })),
                      ]}
                      value={formData.cityId}
                      onChange={(value) => {
                        setFormData(prev => ({ ...prev, cityId: value }));
                        fetchUsers();
                      }}
                      placeholder="Seçiniz"
                    />
                  </div>
                  <div>
                    <Label>Ara</Label>
                    <Input
                      type="text"
                      name="search"
                      value={formData.search}
                      onChange={handleInputChange}
                      placeholder="İsim, telefon, email..."
                    />
                  </div>
                </div>
              )}

              {/* User Selection */}
              {sendMode === 'single' && (
                <div>
                  <Label>Kullanıcı Seç</Label>
                  <Select
                    options={[
                      { value: '', label: 'Kullanıcı seçiniz' },
                      ...filteredUsers.map(user => ({
                        value: user.id,
                        label: `${user.name || user.phoneNumber} (${user.userType === 'PROVIDER' ? 'Hizmet Sağlayıcı' : 'Talep Oluşturan'})`,
                      })),
                    ]}
                    value={formData.userId}
                    onChange={(value) => setFormData(prev => ({ ...prev, userId: value }))}
                    placeholder="Kullanıcı seçiniz"
                  />
                </div>
              )}

              {sendMode === 'multiple' && (
                <div>
                  <Label>Kullanıcılar ({formData.userIds.length} seçildi)</Label>
                  <div className="mt-2 max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-2">
                    {loadingUsers ? (
                      <div className="text-center py-4">Yükleniyor...</div>
                    ) : filteredUsers.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">Kullanıcı bulunamadı</div>
                    ) : (
                      filteredUsers.map(user => (
                        <label
                          key={user.id}
                          className="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={formData.userIds.includes(user.id)}
                            onChange={() => handleUserSelect(user.id)}
                            className="w-4 h-4"
                          />
                          <div className="flex-1">
                            <div className="font-medium">{user.name || user.phoneNumber}</div>
                            <div className="text-sm text-gray-500">
                              {user.userType === 'PROVIDER' ? 'Hizmet Sağlayıcı' : 'Talep Oluşturan'}
                              {user.city && ` • ${user.city.name}`}
                              {!user.fcmToken && ' • FCM token yok'}
                            </div>
                          </div>
                        </label>
                      ))
                    )}
                  </div>
                </div>
              )}

              {sendMode === 'all' && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Icon icon="ri:information-line" className="text-xl text-blue-600 dark:text-blue-400" />
                    <span className="text-sm text-blue-800 dark:text-blue-200">
                      {filteredUsers.length} kullanıcıya bildirim gönderilecek
                      {filteredUsers.filter(u => !u.fcmToken).length > 0 && (
                        <span className="ml-2 text-orange-600 dark:text-orange-400">
                          ({filteredUsers.filter(u => !u.fcmToken).length} kullanıcının FCM token'ı yok)
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              )}

              {/* Notification Content */}
              <div>
                <Label>Başlık *</Label>
                <Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Bildirim başlığı"
                />
              </div>

              <div>
                <Label>Mesaj *</Label>
                <TextArea
                  value={formData.body}
                  onChange={(value) => setFormData(prev => ({ ...prev, body: value }))}
                  placeholder="Bildirim mesajı"
                  rows={6}
                />
              </div>
            </div>
          </ComponentCard>
        </div>
      </LoadingContainer>
    </div>
  );
};

export default NotificationsPage;

