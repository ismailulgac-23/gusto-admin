"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from '@/components/common/ComponentCard';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import Button from '@/components/ui/button/Button';
import { Icon } from "@iconify/react";
import axios from '@/axios';

const selectClass =
  "h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:outline-none disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90";

const USER_TYPES = [
  { value: 'ALL', label: 'Tüm roller' },
  { value: 'PROVIDER', label: 'Hizmet Veren' },
  { value: 'RECEIVER', label: 'Hizmet Alan' },
];

export default function BulkNotificationsPage() {
  // Bildirim içeriği
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  // Gönderim modu: filtreye uyan herkes ('filter') veya elle seçilenler ('selected')
  const [mode, setMode] = useState('filter');

  // Filtreler
  const [userType, setUserType] = useState('ALL');
  const [cityId, setCityId] = useState('');
  const [countie, setCountie] = useState('');
  const [search, setSearch] = useState('');

  // Veri
  const [cities, setCities] = useState([]);
  const [counties, setCounties] = useState([]);
  const [audience, setAudience] = useState({ total: 0, withToken: 0, withoutToken: 0, users: [] });
  const [selectedIds, setSelectedIds] = useState([]);

  // Durum
  const [loadingAudience, setLoadingAudience] = useState(false);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const debounceRef = useRef(null);

  // İl listesi
  useEffect(() => {
    axios.get('/settings/cities')
      .then((res) => setCities(res.data.data || []))
      .catch((err) => console.error('Şehirler alınamadı:', err));
  }, []);

  // Seçili ile göre ilçeler
  useEffect(() => {
    const city = cities.find((c) => c.id === cityId);
    if (!city) {
      setCounties([]);
      return;
    }
    axios.get(`/locations/cities/${encodeURIComponent(city.name)}/counties`)
      .then((res) => setCounties(res.data.data || []))
      .catch(() => setCounties([]));
  }, [cityId, cities]);

  // Hedef kitleyi (ve alıcı sayısını) filtre değiştikçe yeniden hesapla
  const fetchAudience = useCallback(async () => {
    try {
      setLoadingAudience(true);
      const res = await axios.get('/admin/notifications/audience', {
        params: {
          userType,
          ...(cityId && { cityId }),
          ...(countie && { countie }),
          ...(search.trim() && { search: search.trim() }),
          limit: 200,
        },
      });
      setAudience(res.data.data || { total: 0, withToken: 0, withoutToken: 0, users: [] });
    } catch (err) {
      console.error('Hedef kitle alınamadı:', err);
      setFeedback({ type: 'error', text: 'Hedef kitle hesaplanamadı.' });
    } finally {
      setLoadingAudience(false);
    }
  }, [userType, cityId, countie, search]);

  // Arama yazarken her tuşta istek atmamak için 400ms bekle
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchAudience, 400);
    return () => clearTimeout(debounceRef.current);
  }, [fetchAudience]);

  const toggleUser = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectedWithToken = audience.users.filter(
    (u) => selectedIds.includes(u.id) && u.hasToken
  ).length;

  // Tek tıkla gönderimde kaç cihaza ulaşılacağı
  const recipientCount = mode === 'selected' ? selectedIds.length : audience.total;
  const deviceCount = mode === 'selected' ? selectedWithToken : audience.withToken;

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      setFeedback({ type: 'error', text: 'Başlık ve mesaj zorunludur.' });
      return;
    }
    if (recipientCount === 0) {
      setFeedback({ type: 'error', text: 'Seçili kritere uyan kullanıcı yok.' });
      return;
    }
    if (!window.confirm(`${recipientCount} kullanıcıya bildirim gönderilecek (${deviceCount} cihaza anlık push). Onaylıyor musunuz?`)) {
      return;
    }

    try {
      setSending(true);
      setFeedback(null);
      const payload = {
        title: title.trim(),
        message: message.trim(),
        ...(mode === 'selected'
          ? { userIds: selectedIds }
          : {
              filters: {
                userType,
                ...(cityId && { cityId }),
                ...(countie && { countie }),
                ...(search.trim() && { search: search.trim() }),
              },
            }),
      };

      const res = await axios.post('/admin/notifications/send-bulk', payload);
      const d = res.data.data || {};
      setFeedback({
        type: 'success',
        text: `${d.totalRecipients} kullanıcıya kaydedildi · ${d.sentToDevices} cihaza gönderildi · ${d.withoutToken} kişide cihaz kaydı yok`,
      });
      setTitle('');
      setMessage('');
      setSelectedIds([]);
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Bildirim gönderilemedi.',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Toplu Bildirim" />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Sol: içerik + filtreler */}
        <div className="space-y-6 xl:col-span-2">
          <ComponentCard title="Bildirim İçeriği" desc="Kullanıcıların cihazına düşecek metin">
            <div className="space-y-5">
              <div>
                <Label>Başlık</Label>
                <Input
                  type="text"
                  placeholder="Örn: Yeni hayır etkinliği"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <Label>Mesaj</Label>
                <TextArea
                  rows={4}
                  placeholder="Bildirim metnini yazın"
                  value={message}
                  onChange={(value) => setMessage(value)}
                />
                <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                  {message.length}/500 karakter
                </p>
              </div>
            </div>
          </ComponentCard>

          <ComponentCard title="Kime Gönderilecek?" desc="Filtreye göre toplu, ya da tek tek seçim">
            <div className="mb-5 flex gap-3">
              <button
                type="button"
                onClick={() => setMode('filter')}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  mode === 'filter'
                    ? 'bg-brand-500 text-white'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                }`}
              >
                Filtreye uyan herkes
              </button>
              <button
                type="button"
                onClick={() => setMode('selected')}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  mode === 'selected'
                    ? 'bg-brand-500 text-white'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                }`}
              >
                Seçtiğim kullanıcılar ({selectedIds.length})
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label>Rol</Label>
                <select value={userType} onChange={(e) => setUserType(e.target.value)} className={selectClass}>
                  {USER_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label>İl</Label>
                <select
                  value={cityId}
                  onChange={(e) => { setCityId(e.target.value); setCountie(''); }}
                  className={selectClass}
                >
                  <option value="">Tüm iller</option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label>İlçe</Label>
                <select
                  value={countie}
                  onChange={(e) => setCountie(e.target.value)}
                  disabled={!cityId || counties.length === 0}
                  className={selectClass}
                >
                  <option value="">{cityId ? 'Tüm ilçeler' : 'Önce il seçiniz'}</option>
                  {counties.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label>İsim / telefon / e-posta ara</Label>
                <Input
                  type="text"
                  placeholder="Aramak için yazın"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </ComponentCard>

          <ComponentCard
            title={mode === 'selected' ? 'Kullanıcı Seç' : 'Hedef Kitle Önizleme'}
            desc={mode === 'selected'
              ? 'Filtreyle daraltıp tek tek seçin'
              : 'Filtreye uyan ilk 200 kullanıcı'}
          >
            {mode === 'selected' && audience.users.length > 0 && (
              <div className="mb-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedIds(audience.users.map((u) => u.id))}
                  className="text-sm font-semibold text-brand-500 hover:underline"
                >
                  Listedekilerin tümünü seç
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedIds([])}
                  className="text-sm font-semibold text-gray-500 hover:underline"
                >
                  Seçimi temizle
                </button>
              </div>
            )}

            {loadingAudience ? (
              <p className="py-8 text-center text-sm text-gray-500">Hesaplanıyor…</p>
            ) : audience.users.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-500">
                Bu filtreye uyan kullanıcı bulunamadı.
              </p>
            ) : (
              <div className="max-h-[420px] overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-800">
                {audience.users.map((u) => (
                  <label
                    key={u.id}
                    className="flex cursor-pointer items-center gap-3 border-b border-gray-100 px-4 py-3 last:border-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
                  >
                    {mode === 'selected' && (
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(u.id)}
                        onChange={() => toggleUser(u.id)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-800 dark:text-white/90">
                        {u.name || u.companyName || 'İsimsiz'}
                        <span className="ml-2 text-xs font-normal text-gray-400">
                          {u.userType === 'PROVIDER' ? 'Hizmet Veren' : 'Hizmet Alan'}
                        </span>
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {u.phoneNumber}
                        {u.city?.name ? ` · ${u.city.name}` : ''}
                        {u.countie ? ` / ${u.countie}` : ''}
                      </p>
                    </div>
                    {u.hasToken ? (
                      <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        CİHAZ VAR
                      </span>
                    ) : (
                      <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-500 dark:bg-gray-800">
                        CİHAZ YOK
                      </span>
                    )}
                  </label>
                ))}
              </div>
            )}
          </ComponentCard>
        </div>

        {/* Sağ: özet + gönder */}
        <div className="space-y-6">
          <ComponentCard title="Gönderim Özeti">
            <div className="space-y-4">
              <div className="rounded-xl bg-brand-50 p-4 dark:bg-brand-500/10">
                <p className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  Bildirim alacak kişi
                </p>
                <p className="mt-1 text-3xl font-black text-brand-600 dark:text-brand-400">
                  {loadingAudience ? '…' : recipientCount}
                </p>
              </div>

              <div className="rounded-xl bg-green-50 p-4 dark:bg-green-500/10">
                <p className="text-xs font-bold uppercase tracking-wider text-green-700 dark:text-green-400">
                  Anlık push gidecek cihaz
                </p>
                <p className="mt-1 text-3xl font-black text-green-700 dark:text-green-400">
                  {loadingAudience ? '…' : deviceCount}
                </p>
                <p className="mt-1 text-xs text-green-700/70 dark:text-green-400/70">
                  Cihaz kaydı olmayanlar bildirimi uygulama içinde görür.
                </p>
              </div>

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

              <Button
                onClick={handleSend}
                disabled={sending || loadingAudience || recipientCount === 0}
                className="w-full"
              >
                {sending ? (
                  'Gönderiliyor…'
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Icon icon="ph:paper-plane-tilt-bold" width={18} />
                    Bildirimi Gönder
                  </span>
                )}
              </Button>
            </div>
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}
