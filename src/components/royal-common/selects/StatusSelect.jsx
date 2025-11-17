import React from 'react'
import Select from '@/components/form/Select'
const StatusSelect = () => {
    return (
        <Select
            options={[
                { value: true, label: 'Aktif' },
                { value: false, label: 'Pasif' },
            ]}
            placeholder="Seçiniz"
            onChange={() => { }}
            className="w-full"
        />
    )
}

export default StatusSelect