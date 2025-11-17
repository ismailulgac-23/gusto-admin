import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button/Button';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import Select from '@/components/form/Select';
import MultiSelect from '@/components/form/MultiSelect';
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from '@/axios';

export default function UserForm({ mode = 'edit', userId = null, onSuccess, onError, backUrl = '/users' }) {
  const router = useRouter();
  const isEditMode = mode === 'edit';

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    userType: 'PROVIDER',
    bio: '',
    location: '',
    profileImage: '',
    companyName: '',
    address: '',
    responseTime: '',
    isActive: true,
    isAdmin: false,
    password: '',
    categories: [],
  });

  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // UI states
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditMode);
  const [error, setError] = useState(null);

  const userTypeOptions = [
    { label: 'Sağlayıcı (Provider)', value: 'PROVIDER' },
    { label: 'Alıcı (Receiver)', value: 'RECEIVER' },
  ];

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await axios.get('/admin/categories', {
          params: { isActive: true, limit: 100 }
        });
        const data = response.data.data || response.data;
        const categoriesList = Array.isArray(data) ? data : (data.data || []);
        const categoryOptions = categoriesList.map(cat => ({
          label: cat.name,
          value: cat.id
        }));
        setCategories(categoryOptions);
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch user data in edit mode
  useEffect(() => {
    const fetchUser = async () => {
      if (!isEditMode || !userId || categoriesLoading) return;

      try {
        setFetchLoading(true);
        setError(null);

        const response = await axios.get(`/admin/users/${userId}`);
        const user = response.data.data || response.data;

        setFormData({
          name: user.name || '',
          email: user.email || '',
          phoneNumber: user.phoneNumber || '',
          userType: user.userType || 'PROVIDER',
          bio: user.bio || '',
          location: user.location || '',
          profileImage: user.profileImage || '',
          companyName: user.companyName || '',
          address: user.address || '',
          responseTime: user.responseTime || '',
          isActive: user.isActive !== undefined ? user.isActive : true,
          isAdmin: user.isAdmin || false,
          password: '',
          categories: user.categories || [],
        });

        // Set selected categories
        if (user.categories && Array.isArray(user.categories) && categories.length > 0) {
          const categoryIds = user.categories.map(cat => {
            if (typeof cat === 'string') {
              // If it's just a name, find the category ID
              const found = categories.find(c => c.label === cat);
              return found ? found.value : null;
            }
            // Handle category object from backend
            if (cat.category) {
              return cat.category.id;
            }
            return cat.id || null;
          }).filter(Boolean);

          const selectedCategoryOptions = categoryIds.map(id => {
            const found = categories.find(c => c.value === id);
            if (found) {
              return found;
            }
            // If not found, try to get from user.categories
            const userCat = user.categories.find(cat => {
              if (typeof cat === 'string') return false;
              return (cat.category?.id === id) || (cat.id === id);
            });
            if (userCat && userCat.category) {
              return { label: userCat.category.name, value: userCat.category.id };
            }
            return { label: `Kategori ${id}`, value: id };
          });
          setSelectedCategories(selectedCategoryOptions);
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Kullanıcı bilgileri yüklenirken bir hata oluştu.');
        if (onError) onError(err);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchUser();
  }, [isEditMode, userId, onError, categories, categoriesLoading]);

  // Handle form change
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
  };

  // Handle multi-select change
  const handleMultiSelectChange = (field, selectedOptions) => {
    if (!selectedOptions || !Array.isArray(selectedOptions)) {
      handleChange(field, []);
      setSelectedCategories([]);
      return;
    }

    const values = selectedOptions
      .filter(option => option && option.value)
      .map(option => option.value);
    
    handleChange(field, values);
    
    // Update selected categories with proper labels
    const updatedOptions = selectedOptions
      .filter(opt => opt && opt.value)
      .map(opt => {
        const found = categories.find(c => c.value === opt.value);
        return found || opt;
      });
    
    setSelectedCategories(updatedOptions);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.name.trim()) {
      setError('Lütfen bir isim girin.');
      return;
    }

    if (!formData.phoneNumber.trim()) {
      setError('Lütfen telefon numarası girin.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Prepare data
      const userData = {
        name: formData.name.trim(),
        email: formData.email.trim() || null,
        phoneNumber: formData.phoneNumber.trim(),
        userType: formData.userType,
        bio: formData.bio.trim() || null,
        location: formData.location.trim() || null,
        profileImage: formData.profileImage.trim() || null,
        companyName: formData.companyName.trim() || null,
        address: formData.address.trim() || null,
        responseTime: formData.responseTime.trim() || null,
        isActive: formData.isActive,
        isAdmin: formData.isAdmin,
        categories: formData.categories,
      };

      // Add password only if provided
      if (formData.password.trim()) {
        userData.password = formData.password.trim();
      }

      await axios.patch(`/admin/users/${userId}`, userData);

      // Call success callback
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(backUrl);
      }

    } catch (err) {
      console.error('Error updating user:', err);
      setError(err.response?.data?.message || 'Kullanıcı güncellenirken bir hata oluştu.');
      if (onError) onError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md">
          {error}
        </div>
      )}

      {fetchLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center">
            <Icon icon="eos-icons:loading" className="text-4xl text-primary animate-spin" />
            <span className="mt-3 text-gray-600 dark:text-gray-400">Kullanıcı bilgileri yükleniyor...</span>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Label>İsim *</Label>
              <Input
                type="text"
                placeholder="Kullanıcı ismi"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Telefon Numarası *</Label>
              <Input
                type="text"
                placeholder="+905551234567"
                value={formData.phoneNumber}
                onChange={(e) => handleChange('phoneNumber', e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>

            <div>
              <Label>Kullanıcı Tipi *</Label>
              <Select
                options={userTypeOptions}
                defaultValue={formData.userType}
                onChange={(value) => handleChange('userType', value)}
              />
            </div>

            <div>
              <Label>Şifre (Değiştirmek için doldurun)</Label>
              <Input
                type="password"
                placeholder="Yeni şifre"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Şifreyi değiştirmek istemiyorsanız boş bırakın.
              </p>
            </div>

            <div>
              <Label>Profil Resmi URL</Label>
              <Input
                type="text"
                placeholder="https://example.com/image.jpg"
                value={formData.profileImage}
                onChange={(e) => handleChange('profileImage', e.target.value)}
              />
            </div>

            {formData.userType === 'PROVIDER' && (
              <>
                <div>
                  <Label>Firma Adı</Label>
                  <Input
                    type="text"
                    placeholder="Firma adı"
                    value={formData.companyName}
                    onChange={(e) => handleChange('companyName', e.target.value)}
                  />
                </div>

                <div>
                  <Label>Yanıt Süresi</Label>
                  <Input
                    type="text"
                    placeholder="Örn: 1-2 saat"
                    value={formData.responseTime}
                    onChange={(e) => handleChange('responseTime', e.target.value)}
                  />
                </div>
              </>
            )}

            <div>
              <Label>Adres</Label>
              <Input
                type="text"
                placeholder="Adres"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
              />
            </div>

            <div>
              <Label>Konum</Label>
              <Input
                type="text"
                placeholder="Konum"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <Label>Biyografi</Label>
              <TextArea
                rows={4}
                placeholder="Biyografi"
                value={formData.bio}
                onChange={(value) => handleChange('bio', value)}
              />
            </div>

            {formData.userType === 'PROVIDER' && (
              <div className="md:col-span-2">
                <Label>Kategoriler</Label>
                {categoriesLoading ? (
                  <div className="flex items-center space-x-2 h-10">
                    <Icon icon="eos-icons:loading" className="text-xl text-primary animate-spin" />
                    <span>Yükleniyor...</span>
                  </div>
                ) : (
                  <MultiSelect
                    options={categories}
                    placeholder="Kategoriler seçin"
                    defaultValue={selectedCategories}
                    onChange={(selected) => handleMultiSelectChange('categories', selected)}
                  />
                )}
              </div>
            )}

            <div className="md:col-span-2 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => handleChange('isActive', e.target.checked)}
                  className="w-4 h-4"
                />
                <Label htmlFor="isActive" className="mb-0">
                  Aktif
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isAdmin"
                  checked={formData.isAdmin}
                  onChange={(e) => handleChange('isAdmin', e.target.checked)}
                  className="w-4 h-4"
                />
                <Label htmlFor="isAdmin" className="mb-0">
                  Admin
                </Label>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              className="bg-primary text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Icon icon="eos-icons:loading" className="mr-2" />
                  Güncelleniyor...
                </>
              ) : (
                'Güncelle'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(backUrl)}
              disabled={loading}
            >
              İptal
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
