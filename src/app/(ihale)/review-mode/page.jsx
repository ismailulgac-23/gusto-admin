"use client";
import React, { useState, useEffect } from 'react';
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from '@/components/common/ComponentCard';
import LoadingContainer from '@/components/royal-common/LoadingContainer';
import { Icon } from "@iconify/react";
import axios from '@/axios';

const ReviewModePage = () => {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/settings/admin/review-mode');
      setEnabled(res.data?.data?.isEnabled === true);
    } catch (error) {
      console.error('Review modu okunamadı:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggle = async () => {
    const next = !enabled;
    try {
      setSaving(true);
      const res = await axios.put('/settings/admin/review-mode', { isEnabled: next });
      setEnabled(res.data?.data?.isEnabled === true);
    } catch (error) {
      alert(error?.response?.data?.message || 'Güncellenemedi');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Review / DEMO Modu" />
      <LoadingContainer loading={loading}>
        <div className="w-full space-y-6">
          <ComponentCard title="App Store İnceleme / Demo Modu">
            <div className="space-y-6">
              {/* Durum + toggle */}
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${enabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                    <Icon icon={enabled ? 'ri:play-circle-fill' : 'ri:pause-circle-line'} className="text-3xl" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-gray-800 dark:text-white/90">
                      Durum: {enabled
                        ? <span className="text-green-600">AÇIK</span>
                        : <span className="text-gray-500">KAPALI</span>}
                    </p>
                    <p className="text-sm text-gray-500">
                      {enabled
                        ? 'Demo/inceleme hesapları ve uygulama içi demo giriş butonları aktif.'
                        : 'Demo/inceleme hesapları kapalı. Uygulamada demo giriş butonları görünmez.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={toggle}
                  disabled={saving}
                  className={`relative inline-flex h-8 w-16 shrink-0 cursor-pointer items-center rounded-full transition-colors ${enabled ? 'bg-green-500' : 'bg-gray-300'} ${saving ? 'opacity-60' : ''}`}
                  aria-pressed={enabled}
                >
                  <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-9' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Açıklama */}
              <div className="rounded-2xl bg-gray-50 dark:bg-white/5 p-5 text-sm text-gray-600 dark:text-gray-300 leading-6 space-y-3">
                <p className="font-semibold text-gray-800 dark:text-white/90">Bu ne işe yarar?</p>
                <p>
                  <b>Review/DEMO Modu</b> açıkken, App Store inceleme ekibinin (ve demo göstermek istediğinde senin) kullanabileceği
                  iki sabit-OTP hesabı aktif olur ve mobil uygulamanın giriş ekranında “Demo / İnceleme Girişi” butonları görünür.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><b>Hizmet Alan:</b> telefon <code>5555555555</code> — kod <code>123456</code></li>
                  <li><b>Hizmet Veren:</b> telefon <code>6666666666</code> — kod <code>123456</code></li>
                </ul>
                <p className="text-gray-500">
                  Kapalıyken bu hesaplarla giriş yapılamaz ve demo butonları gizlenir. <b>Öneri:</b> Apple’a build gönderip
                  inceleme başlamadan önce AÇ, onay geldikten sonra KAPAT.
                </p>
              </div>
            </div>
          </ComponentCard>
        </div>
      </LoadingContainer>
    </div>
  );
};

export default ReviewModePage;
