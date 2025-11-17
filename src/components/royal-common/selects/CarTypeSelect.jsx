import React from 'react'
import Select from '@/components/form/Select'
const CarTypeSelect = () => {
    return (
        <Select
            options={[
                { value: "Tümü", label: 'Tümü' },
                { value: "SEDAN", label: 'Sedan' },
                { value: "SUV", label: 'SUV' },
                { value: "MINI_BUS", label: 'Mini Bus' },
                { value: "LUXURY", label: 'Luxury' },
            ]}
            placeholder="Seçiniz"
            onChange={() => { }}
            className="w-full"
        />
    )
}

export default CarTypeSelect