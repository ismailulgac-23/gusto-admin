"use client";
import React from 'react'
import StatusSelect from '../../components/royal-common/selects/StatusSelect'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import ComponentCard from '@/components/common/ComponentCard'
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import TextArea from '@/components/form/input/TextArea';
const ProcessLanguageView = () => {
  return (
    <div>

      <PageBreadcrumb pageTitle="Dil Yönetimi" onCreate={() => { }} />

      <div className='max-w-2xl space-y-6'>
        <ComponentCard title="Dil Bilgileri">

          <div className='grid grid-cols-2 space-x-5'>
            <div>
              <Label>Diller</Label>
              <Input type="text" />
            </div>
            <div>
              <Label>Dil Kodu</Label>
              <Input type="text" />
            </div>
          </div>

        </ComponentCard>

        <ComponentCard title="SEO Bilgileri">
          <div>
            <Label>Başlık</Label>
            <Input type="text" />
          </div>
          <div>
            <Label>Açıklama</Label>
            <TextArea rows={8} placeholder='' />
          </div>
          <div>
            <Label>Etiketler</Label>
            <TextArea rows={8} placeholder='' />
          </div>
        </ComponentCard>

        <ComponentCard title="Yayın Durumu">
          <div>
            <Label>Durum</Label>
            <StatusSelect />
          </div>
        </ComponentCard>

      </div>
    </div>
  )
}

export default ProcessLanguageView