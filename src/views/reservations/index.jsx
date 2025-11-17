"use client";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import CarTypeSelect from "@/components/royal-common/selects/CarTypeSelect";
import TableContainer from "@/components/royal-common/Table";
import Badge from "@/components/ui/badge/Badge";
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

export default function ReservationsView() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Rezervasyonlar" />
            <div className="space-y-6">

                <ComponentCard title="Filtrele" titleRightRenderer={
                    <Button size="sm" variant="primary">
                        Sorgula
                    </Button>
                }>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                        <div>
                            <Label>Araç Tipi</Label>
                            <CarTypeSelect />
                        </div>
                        <div>
                            <Label>Voucher Kodu</Label>
                            <Input />
                        </div>
                        <div>
                            <Label>Misafir Adı</Label>
                            <Input />
                        </div>
                        <div>
                            <Label>Alış - Varış Yeri</Label>
                            <Input />
                        </div>
                        <div>
                            <Label>Operasyon</Label>
                            <Select
                                placeholder="Seçiniz"
                                options={[
                                    { label: "Tümü", value: "all" },
                                    { label: "İşlem Yapılmamış Olanlar", value: "not_processed" },
                                    { label: "İptal Bekleyenler", value: "cancel_pending" },
                                    { label: "İptal Edilmiş Olanlar", value: "canceled" },
                                    { label: "Düzenlenmiş Olanlar", value: "edited" },
                                    { label: "Tamamlanmış Olanlar", value: "completed" },
                                    { label: "Arşivde Olanlar", value: "archived" },
                                ]}
                                onChange={() => { }}
                            />
                        </div>
                    </div>
                </ComponentCard>

                <TableContainer
                    data={Array.from({ length: 10 }, (_, index) => index + 1)}
                    navItems={["Kod", "Tarih", "Acenta", "Uçuş", "Rezervasyon Sahibi", "Rota", "Otel", "Araç", "Ücret", "Şoför", "Durum", "Ödeme Durum"]}
                    renderItem={(item, index) => {
                        return (
                            <TableRow key={index}>
                                <TableCell className="text-sm px-5 py-4 sm:px-6 text-start">
                                    <Badge>TST942930203</Badge>
                                </TableCell>
                                <TableCell className="text-sm px-5 py-4 sm:px-6 text-start">
                                    <span>20 Şubat 2025 10:00</span>
                                </TableCell>
                                <TableCell className="text-sm px-5 py-4 sm:px-6 text-start">
                                    <span>TST - Acenta Fiyat yok!</span>
                                </TableCell>
                                <TableCell className="text-sm px-5 py-4 sm:px-6 text-start">
                                    <span>TK</span>
                                </TableCell>
                                <TableCell className="text-sm px-5 py-4 sm:px-6 text-start">
                                    <p>denem deneme</p>
                                    <p>+905321234567</p>
                                </TableCell>
                                <TableCell className="text-sm px-5 py-4 sm:px-6 text-start">
                                    AYT - Manavgat
                                </TableCell>
                                <TableCell className="text-sm px-5 py-4 sm:px-6 text-start">
                                    Parus Hotel
                                </TableCell>
                                <TableCell className="text-sm px-5 py-4 sm:px-6 text-start">
                                    <p>Transfer: 0 USD</p>
                                    <p>Toplam: <span className="text-red-500 font-bold">0 USD</span></p>
                                </TableCell>
                                <TableCell className="text-sm px-5 py-4 sm:px-6 text-start">
                                    Şoför Atanmamış
                                </TableCell>
                                <TableCell className="text-sm px-5 py-4 sm:px-6 text-start flex items-center gap-2">
                                    <Button className="flex-shrink-0" style={{ padding: "0.5rem 1rem" }}>Onayla</Button>
                                    <Button className="flex-shrink-0" style={{ padding: "0.5rem 1rem" }}>İptal Et</Button>
                                </TableCell>
                                <TableCell className="text-sm px-5 py-4 sm:px-6 text-start flex items-center gap-2">
                                    Kredi Kartı - Tamam
                                </TableCell>
                                <TableCell className="text-sm px-5 py-4 sm:px-6 text-start flex items-center gap-3">
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
