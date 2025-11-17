import React from 'react'
import Tab from '../Tab'

const LanguageTab = ({ activeIndex, setActiveIndex, children }) => {


    return (
        <Tab
            className='w-full'
            items={[
                { label: "Türkçe", value: "tr" },
                { label: "İngilizce", value: "en" },
                { label: "Almanca", value: "de" },
                { label: "Fransızca", value: "fr" },
                { label: "İspanyolca", value: "es" },
            ]}
            activeTab={activeIndex}
            onTabChange={setActiveIndex}
        >
            {children}
        </Tab>
    )
}

export default LanguageTab