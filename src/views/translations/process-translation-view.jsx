"use client";
import React from 'react'
import StatusSelect from '../../components/royal-common/selects/StatusSelect'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import ComponentCard from '@/components/common/ComponentCard'
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import TextArea from '@/components/form/input/TextArea';
const ProcessTranslationView = () => {
  return (
    <div>

      <PageBreadcrumb pageTitle="Çeviri Yönetimi" onCreate={() => { }} />

      <div className='max-w-2xl space-y-6'>
        <ComponentCard title="Genel Bilgiler">

          <div>
            <Label>Başlık</Label>
            <Input type="text" />
          </div>

        </ComponentCard>

        <ComponentCard title="Çeviriler">
          <div>
            <Label>English</Label>
            <Input type="text" />
          </div>
          <div>
            <Label>Русский</Label>
            <Input type="text" />
          </div>
          <div>
            <Label>Türkçe</Label>
            <Input type="text" />
          </div>
          <div>
            <Label>Deutsch</Label>
            <Input type="text" />
          </div>
        </ComponentCard>
      </div>
    </div>
  )
}

export default ProcessTranslationView