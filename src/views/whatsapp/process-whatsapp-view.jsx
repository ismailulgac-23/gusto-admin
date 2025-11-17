"use client";
import React, { useState } from 'react'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import ComponentCard from '@/components/common/ComponentCard'
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import TextArea from '@/components/form/input/TextArea';
import LanguageTab from '@/components/royal-common/tabs/LanguageTab';
import SendGroupSelect from '@/components/royal-common/selects/SendGroupSelect';

const ProcessWhatsappView = ({ isCreate = false }) => {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div>
      <PageBreadcrumb pageTitle={isCreate ? "Whatsapp Şablonu Oluştur" : "Whatsapp Şablonu Düzenle"} onCreate={isCreate ? () => { } : undefined} onSave={isCreate ? undefined : () => { }} />

      <div className='w-full space-y-6'>
        <ComponentCard title="Genel Bilgiler">
          <div>
            <Label>Şablon Adı</Label>
            <Input type="text" />
          </div>



          <LanguageTab activeIndex={activeIndex} setActiveIndex={setActiveIndex}>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-2 font-medium text-gray-900 dark:text-white">Kullanılabilecek ön tanımlı bilgiler:</h3>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
                <div>
                  <p>Müşteri Ad Soyad: *#ADSOYAD#* ya da *#MUSTERIADI#*</p>
                  <p>Rezervasyon No: *#REZERVASYONNO#* Ya da *#VOUCHERNO#*</p>
                  <p>Yolculuk Rotası: *#ROTA#*</p>
                  <p>Otel Adı: *#OTELADI#*</p>
                  <p>Kişi Sayısı: *#KISI#*</p>
                  <p>Araç Tipi: *#ARAC#*</p>
                  <p>Araç Plaka: *#PLAKA#*</p>
                  <p>Şoför Adı: *#SOFOR#*</p>
                  <p>Acenta Kodu: *#ACENTAKOD#*</p>
                </div>
                <div>
                  <p>Ekstra Listesi: *#EKSTRALAR#*</p>
                  <p>Uçuş No: *#UCUSNO#*</p>
                  <p>Transfer Tutarı: *#TUTAR#*</p>
                  <p>Transfer Döviz Cinsi: *#DOVIZ#*</p>
                  <p>Transfer Tarihi: *#TARIH#*</p>
                  <p>Transfer Saati: *#SAAT#*</p>
                  <p>Transfer Tarih saat birlikte: *#TARIHSAAT#*</p>
                  <p>Terminal Bilgisi: *#TERMINAL#*</p>
                  <p>Google Link: *#GOOGLE#*</p>
                  <p>Ek Bilgi (Mesaj): *#EKBILGI#*</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Mesaj içerisinde kalın görünmesini istediğiniz bölümleri * ve * arasına yazınız.
              </p>
            </div>
          </LanguageTab>
          <div className="mt-4">
            <Label>WhatsApp Mesaj İçeriği</Label>
            <TextArea
              rows={10}
              placeholder='Whatsapp içeriğini giriniz. Yukarıdaki değişkenleri kullanabilirsiniz.'
              className="mt-2"
            />
          </div>
        </ComponentCard>
      </div>
    </div>
  )
}

export default ProcessWhatsappView