"use client";
import React, { useState } from 'react'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import ComponentCard from '@/components/common/ComponentCard'
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import TextArea from '@/components/form/input/TextArea';
import LanguageTab from '@/components/royal-common/tabs/LanguageTab';
import SendGroupSelect from '@/components/royal-common/selects/SendGroupSelect';
const ProcessMailView = ({ isCreate = false }) => {
  const [activeIndex, setActiveIndex] = useState(0)


  return (
    <div>

      <PageBreadcrumb pageTitle={isCreate ? "Mail Şablonu Oluştur" : "Mail Şablonu Düzenle"} onCreate={isCreate ? () => { } : undefined} onSave={isCreate ? undefined : () => { }} />

      <div className='w-full space-y-6'>
        <ComponentCard title="Genel Bilgiler">

          <div>
            <Label>Gönderim Grubu</Label>
            <SendGroupSelect />
          </div>

          <div>
            <Label>Şablon Adı</Label>
            <Input type="text" />
          </div>


          <LanguageTab activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
          <TextArea rows={10} placeholder='Mail içeriğini giriniz' />



        </ComponentCard>
      </div>
    </div>
  )
}

export default ProcessMailView