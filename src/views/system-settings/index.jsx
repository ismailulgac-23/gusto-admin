"use client";
import React, { useState } from 'react'
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from '@/components/common/ComponentCard';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import { ChevronDownIcon, EyeCloseIcon, EyeIcon, TimeIcon } from '@/icons';
import DatePicker from '@/components/form/date-picker';
import TextArea from '@/components/form/input/TextArea';
import LoadingContainer from '@/components/royal-common/LoadingContainer';
const SystemSettingsView = () => {
    const [saving, setSaving] = useState(false);
    const handleSelectChange = (value) => {
      console.log("Selected value:", value);
    };
    const handleSave = () => {
        console.log("Save");
        setSaving(true);
    };
  return (
    <div>
        <PageBreadcrumb pageTitle="Sistem Ayarları" onSave={handleSave} saving={saving} />

        <LoadingContainer loading={saving}>
        <div className="w-full">
        <div className="grid grid-cols-2 gap-6 w-full">
        <div className="space-y-6 w-full">
            <ComponentCard title="Fiyatlandırma Ayarları">
                <div className="space-y-6">
                    <div>
                        <Label>Son Kullanıcı Fiyat Fark (%)</Label>
                        <Select
                        options={Array.from(Array(51).keys()).map((e) => {
                            if(e === 0) return {value: "not-apply", label: "Fark Uygulanmasın"}
                            return {value: e, label: `Fiyata %${e} Fark Eklensin`}
                        })}
                        placeholder="Seçiniz"
                        onChange={handleSelectChange}
                        className="dark:bg-dark-900"
                    />
                    </div>
                </div>
            </ComponentCard>
            <ComponentCard title="Ek Kodlar">
        <div>
          <Label>Google Analytics Kodları</Label>
          <TextArea
            value=""
            placeholder=""
            onChange={(value) => {}}
            rows={6}
          />
        </div>
        <div>
          <Label>Ek Meta Kodları</Label>
          <TextArea
            value=""
            placeholder=""
            onChange={(value) => {}}
            rows={6}
          />
        </div>
        </ComponentCard>
        </div>
        <div className="space-y-6 w-full">
            <ComponentCard title="Döviz Ayarları">
                <div className="gap-6 grid grid-cols-3">
                    <div>
                        <Label>EUR Kuru</Label>
                        <Input type="text" />
                    </div>
                    <div>
                        <Label>USD Kuru</Label>
                        <Input type="text" />
                    </div>
                    <div>
                        <Label>GBP Kuru</Label>
                        <Input type="text" />
                    </div>

                    <div>
                        <Label>EUR / Ruble</Label>
                        <Input type="text" />
                    </div>
                    <div>
                        <Label>USD / Ruble</Label>
                        <Input type="text" />
                    </div>

                </div>
            </ComponentCard>
            <ComponentCard title="Güncel TCMB döviz Kurları">
            <div className="gap-6 grid grid-cols-3">
                    <div>
                        <Label>EUR Kuru</Label>
                        <Input type="text" />
                    </div>
                    <div>
                        <Label>USD Kuru</Label>
                        <Input type="text" />
                    </div>
                    <div>
                        <Label>GBP Kuru</Label>
                        <Input type="text" />
                    </div>

                </div>
        </ComponentCard>
        </div>
        </div>
      </div>
        </LoadingContainer>
    </div>
  )
}

export default SystemSettingsView