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
import React from "react";

export const metadata = {
    title: "Whatsapp Yönetimi",
    description:
        "Whatsapp yönetimi yapın",
};

export default function WhatsappView() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Whatsapp Yönetimi" create="/whatsapp/create" />
            <div className="space-y-6">

                <TableContainer
                    data={Array.from({ length: 10 }, (_, index) => index + 1)}
                    navItems={["Şablon Adı", "Tipi ", "İşlem"]}
                    renderItem={(item, index) => {
                        return (
                            <TableRow key={index}>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    Transfer Hatırlatma Bildirimi
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
