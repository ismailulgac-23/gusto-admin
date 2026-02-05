"use client";
import React, { useState, useEffect } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TableContainer from "@/components/royal-common/Table";
import Button from "@/components/ui/button/Button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "@/axios";
import { getImage } from "@/utils";
import Link from "next/link";

export default function BlogList() {
    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBlogs = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.get('/admin/blogs');
            const data = response.data.data;
            setBlogs(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error fetching blogs:', err);
            setError('Bloglar yüklenirken bir hata oluştu.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Bu blog yazısını silmek istediğinize emin misiniz?')) {
            try {
                await axios.delete(`/admin/blogs/${id}`);
                fetchBlogs();
            } catch (err) {
                console.error('Error deleting blog:', err);
                alert('Silme işlemi sırasında bir hata oluştu.');
            }
        }
    };

    if (isLoading) {
        return (
            <div>
                <PageBreadcrumb pageTitle="Blog Yönetimi" />
                <div className="flex justify-center items-center h-64">
                    <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <PageBreadcrumb pageTitle="Blog Yönetimi" />
                <Link href="/blog/create">
                    <Button size="sm" className="flex items-center gap-2">
                        <Icon icon="mi:add" className="text-lg" />
                        Yeni Blog Ekle
                    </Button>
                </Link>
            </div>

            <div className="space-y-6">
                <TableContainer
                    data={blogs}
                    navItems={["Görsel", "Başlık", "Slug", "Etiketler", "Tarih", "İşlem"]}
                    renderItem={(blog) => {
                        return (
                            <TableRow key={blog.id}>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    <img
                                        src={getImage(blog.image)}
                                        alt={blog.title}
                                        className="w-16 h-10 object-cover rounded shadow-sm"
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                                    />
                                </TableCell>
                                <TableCell className="px-4 py-3 text-start font-medium text-gray-800 dark:text-white/90">
                                    {blog.title}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-start text-xs font-mono text-gray-500">
                                    {blog.slug}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-start">
                                    <div className="flex flex-wrap gap-1">
                                        {blog.tags && blog.tags.map((tag, idx) => (
                                            <span key={idx} className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-[10px] px-1.5 py-0.5 rounded">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell className="px-4 py-3 text-start text-xs text-gray-500">
                                    {new Date(blog.createdAt).toLocaleDateString('tr-TR')}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 flex items-center gap-3">
                                    <Link href={`/blog/${blog.id}`}>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                        >
                                            <Icon icon="mingcute:edit-line" className="text-lg" />
                                        </Button>
                                    </Link>
                                    <Button
                                        size="sm"
                                        variant="danger"
                                        onClick={() => handleDelete(blog.id)}
                                    >
                                        <Icon icon="ri:delete-bin-line" className="text-base" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )
                    }}
                    emptyMessage="Henüz blog yazısı bulunamadı"
                />
            </div>
        </div>
    );
}
