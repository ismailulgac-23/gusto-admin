import Users from '@/components/Users'
import React from 'react'

const ProvidersPage = () => {
    return (
        <Users 
            addButton="Hizmet Sağlayıcı Ekle" 
            title="Hizmet Sağlayıcılar" 
            userType="PROVIDER" 
        />
    )
}

export default ProvidersPage

