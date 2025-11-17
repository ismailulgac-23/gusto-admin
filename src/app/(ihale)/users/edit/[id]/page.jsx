"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import UserForm from '@/components/Users/UserForm';

export default function EditUser({ params }) {
  const router = useRouter();
  const { id } = params;

  const handleSuccess = () => {
    router.push('/users');
  };

  const handleError = (error) => {
    console.error('Error updating user:', error);
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Kullanıcı Düzenle" />
      <div className="space-y-6">
        <ComponentCard
          title="Kullanıcı Düzenle"
          desc="Kullanıcı bilgilerini düzenlemek için aşağıdaki formu kullanın"
        >
          <UserForm 
            mode="edit"
            userId={id}
            onSuccess={handleSuccess}
            onError={handleError}
            backUrl="/users"
          />
        </ComponentCard>
      </div>
    </div>
  );
} 