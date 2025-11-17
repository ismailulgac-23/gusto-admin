import React from 'react'
import Select from '@/components/form/Select'
const SendGroupSelect = () => {
    return (
        <Select
            options={[
                { value: "YONETIM", label: 'Yönetime' },
                { value: "ACENTA", label: 'Acentaya' },
                { value: "TASIMACI", label: 'Taşımacıya' },
                { value: "SURUCU", label: 'Sürücüye' },
                { value: "MISAFIR", label: 'Misafire' },
            ]}
            placeholder="Seçiniz"
            onChange={() => { }}
            className="w-full"
        />
    )
}

export default SendGroupSelect