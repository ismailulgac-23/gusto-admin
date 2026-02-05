"use client";
import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "@/axios";
import { useRouter } from "next/navigation";
import CKEditor from "@/components/editor/CKEditor";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";

export default function CreateBlog() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content || !image) {
      alert("Lütfen tüm zorunlu alanları doldurun (Başlık, İçerik ve Görsel)");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("slug", slug);
      formData.append("content", content);
      formData.append("tags", tags);
      formData.append("image", image);

      await axios.post("/admin/blogs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      router.push("/blog");
    } catch (error) {
      console.error("Error creating blog:", error);
      alert("Blog oluşturulurken bir hata oluştu: " + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <PageBreadcrumb pageTitle="Yeni Blog Yazısı Oluştur" />

      <form onSubmit={handleSubmit} className="space-y-6">
        <ComponentCard title="Blog Bilgileri">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Başlık *</Label>
              <Input
                id="title"
                type="text"
                placeholder="Blog başlığını giriniz..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="slug">SEO URL (Slug - Opsiyonel)</Label>
              <Input
                id="slug"
                type="text"
                placeholder="blog-yazisi-url (Boş bırakılırsa başlıktan üretilir)"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="tags">Etiketler (Virgülle ayırın)</Label>
              <Input
                id="tags"
                type="text"
                placeholder="Örn: teknoloji, yazılım, güncel"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>

            <div>
              <Label>Kapak Görseli *</Label>
              <div className="mt-1 flex flex-col space-y-4">
                {imagePreview && (
                  <div className="relative w-full h-64 rounded-lg overflow-hidden border">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { setImage(null); setImagePreview(null); }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600"
                    >
                      <Icon icon="mi:close" />
                    </button>
                  </div>
                )}
                <div className="flex items-center justify-center w-full">
                  <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 ${imagePreview ? 'hidden' : ''}`}>
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Icon icon="ph:cloud-arrow-up" className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or WEBP</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                </div>
              </div>
            </div>

            <div>
              <Label>İçerik *</Label>
              <div className="mt-1">
                <CKEditor
                  initialValue={content}
                  onChange={(data) => setContent(data)}
                />
              </div>
            </div>
          </div>
        </ComponentCard>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/blog")}
            disabled={isLoading}
          >
            İptal
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading && <Icon icon="eos-icons:loading" />}
            {isLoading ? "Kaydediliyor..." : "Blogu Yayınla"}
          </Button>
        </div>
      </form>
    </div>
  );
}