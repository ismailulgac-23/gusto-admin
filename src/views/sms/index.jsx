"use client";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import TableContainer from "@/components/royal-common/Table";
import Button from "@/components/ui/button/Button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Metadata } from "next";
import React from "react";

export const metadata = {
    title: "SMS Şablonları",
    description:
        "SMS şablonları yönetimi yapın",
};

export default function SmsView() {
    return (
        <div>
            <PageBreadcrumb pageTitle="SMS Şablonları" create="/sms/create" />
            <div className="space-y-6">

                <ComponentCard title="Filtrele" titleRightRenderer={
                    <Button size="sm" variant="primary">
                        Sorgula
                    </Button>
                }>
                    <div className="grid grid-cols-3 gap-6">
                        <div>
                            <Label>Mail Tipi</Label>
                            <Select
                                placeholder="Seçiniz"
                                options={[
                                    { label: "Tüm Şablonlar", value: "all" },
                                    { label: "Yönetime", value: "management" },
                                    { label: "Acentaya", value: "acenta" },
                                    { label: "Taşımacıya", value: "transport" },
                                    { label: "Şoföre", value: "driver" },
                                    { label: "Misafirlere", value: "guest" },
                                ]}
                                onChange={() => { }}
                            />
                        </div>
                    </div>
                </ComponentCard>

                <TableContainer
                    data={Array.from({ length: 10 }, (_, index) => index + 1)}
                    navItems={["Şablon Adı", "Tipi ", "İşlem"]}
                    renderItem={(item, index) => {
                        return (
                            <TableRow key={index}>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    Sürücü Yeni ödeme talebi oluşturulduğunda gönderilir
                                </TableCell>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    Yönetime
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 flex items-center gap-3">
                                    <Button size="sm" variant="outline">
                                        <Icon icon="mingcute:edit-line" className="text-lg" />
                                    </Button>
                                    <Button size="sm" variant="danger">
                                        <Icon icon="ri:delete-bin-line" className="text-base" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )
                    }}
                />
            </div>
        </div>
    );
}
