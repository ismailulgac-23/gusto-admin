"use client";
import React, { useState, useEffect } from 'react';
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from '@/components/common/ComponentCard';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';
import { Icon } from "@iconify/react";
import axios from '@/axios';

export default function AppVersionPage() {
  const [form, setForm] = useState({
    minIosVersion: '',
    minAndroidVersion: '',
    iosStoreUrl: '',
    androidStoreUrl: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    axios.get('/settings/admin/app-version')
      .then((res) => setForm(res.data.data || {}))
      .catch(() => setFeedback({ type: 'error', text: 'Ayarlar yüklenemedi.' }))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    try {
      setSaving(true);
      setFeedback(null);
      const res = await axios.put('/settings/admin/app-version', form);
      setForm(res.data.data || form);
      setFeedback({ type: 'success', text: 'Sürüm ayarları kaydedildi.' });
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Kaydedilemedi.',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Uygulama Sürümü" />
        <p className="py-10 text-center text-sm text-gray-500">Yükleniyor…</p>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Uygulama Sürümü" />

      <div className="max-w-3xl space-y-6">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
          <p className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-300">
            <Icon icon="ph:warning-bold" width={18} className="mt-0.5 shrink-0" />
            <span>
              Buradaki sürümü yükselttiğinizde, <strong>daha eski sürümdeki tüm kullanıcılar</strong>{' '}
              uygulamayı kullanamaz; karşılarına kapatılamayan bir güncelleme ekranı çıkar.
              Mağazada yeni sürüm <strong>yayına alındıktan sonra</strong> yükseltin.
            </span>
          </p>
        </div>

        <ComponentCard
          title="Zorunlu Minimum Sürüm"
          desc="Uygulamanın çalışmasına izin verilen en düşük sürüm"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <Label>iOS minimum sürüm</Label>
              <Input
                type="text"
                placeholder="1.0.2"
                value={form.minIosVersion || ''}
                onChange={(e) => handleChange('minIosVersion', e.target.value)}
              />
            </div>
            <div>
              <Label>Android minimum sürüm</Label>
              <Input
                type="text"
                placeholder="1.0.2"
                value={form.minAndroidVersion || ''}
                onChange={(e) => handleChange('minAndroidVersion', e.target.value)}
              />
            </div>
          </div>
        </ComponentCard>

        <ComponentCard title="Mağaza Adresleri" desc="Güncelle butonunun yönlendireceği adresler">
          <div className="space-y-5">
            <div>
              <Label>App Store adresi</Label>
              <Input
                type="text"
                placeholder="https://apps.apple.com/tr/app/..."
                value={form.iosStoreUrl || ''}
                onChange={(e) => handleChange('iosStoreUrl', e.target.value)}
              />
            </div>
            <div>
              <Label>Play Store adresi</Label>
              <Input
                type="text"
                placeholder="https://play.google.com/store/apps/details?id=..."
                value={form.androidStoreUrl || ''}
                onChange={(e) => handleChange('androidStoreUrl', e.target.value)}
              />
            </div>
          </div>
        </ComponentCard>

        {feedback && (
          <div
            className={`rounded-lg p-3 text-sm ${
              feedback.type === 'success'
                ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
            }`}
          >
            {feedback.text}
          </div>
        )}

        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Kaydediliyor…' : 'Kaydet'}
        </Button>
      </div>
    </div>
  );
}
