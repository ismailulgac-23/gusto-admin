import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TableContainer from "@/components/royal-common/Table";
import Button from "@/components/ui/button/Button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Metadata } from "next";
import React from "react";

export const metadata = {
    title: "Dil Yönetimi",
    description:
        "Dil ayarlarını yönetin",
    // other metadata
};

export default function BasicTables() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Dil Yönetimi" create="/languages/create" />
            <div className="space-y-6">
                <TableContainer
                    data={Array.from({ length: 10 }, (_, index) => index + 1)}
                    navItems={["Dil Adı", "Kod", "İşlem"]}
                    renderItem={(item, index) => {
                        return (
                            <TableRow key={index}>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    English
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    EN
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
