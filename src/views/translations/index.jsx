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
    title: "Çeviriler",
    description:
        "Çevirileri yönetin",
};

export default function TranslationsView() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Çeviriler" create="/translations/create" />
            <div className="space-y-6">

                <ComponentCard title="Filtrele" titleRightRenderer={
                    <Button size="sm" variant="primary">
                        Sorgula
                    </Button>
                }>
                    <div className="grid grid-cols-3 gap-6">
                        <div>
                            <Label>Çeviri Tipi</Label>
                            <Select
                                placeholder="Seçiniz"
                                options={[
                                    { label: "Tüm Çeviriler", value: "all" },
                                    { label: "Acenta Paneli", value: "acenta" },
                                    { label: "Web Sitesi", value: "website" },
                                ]}
                                onChange={() => { }}
                            />
                        </div>
                        <div>
                            <Label>ID</Label>
                            <Input type="text" />
                        </div>
                        <div>
                            <Label>Başlık</Label>
                            <Input type="text" />
                        </div>
                    </div>
                </ComponentCard>

                <TableContainer
                    data={Array.from({ length: 10 }, (_, index) => index + 1)}
                    navItems={["Başlık", "İşlem"]}
                    renderItem={(item, index) => {
                        return (
                            <TableRow key={index}>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    Blog Url (değiştirmeyiniz)
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
