"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "@/axios";

const questionTypes = [
    { label: "Metin", value: "text" },
    { label: "Sayı", value: "number" },
    { label: "Seçim (Tek)", value: "select" },
    { label: "Seçim (Çoklu)", value: "multiselect" },
    { label: "Tarih", value: "date" },
    { label: "Evet/Hayır", value: "boolean" },
];

export default function EditCategory() {
    const router = useRouter();
    const params = useParams();
    const id = params.id;
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [parentCategories, setParentCategories] = useState([]);
    const [loadingParents, setLoadingParents] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        icon: "",
        isActive: true,
        parentId: "",
        commissionRate: "",
    });
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        const fetchParentCategories = async () => {
            try {
                setLoadingParents(true);
                const response = await axios.get('/admin/categories', {
                    params: { isActive: true, limit: 100 }
                });
                const categories = response.data.data || response.data || [];
                // Filter out categories that already have a parent and the current category itself
                const rootCategories = categories.filter(cat => !cat.parentId && cat.id !== id);
                setParentCategories(rootCategories);
            } catch (err) {
                console.error('Error fetching parent categories:', err);
            } finally {
                setLoadingParents(false);
            }
        };

        fetchParentCategories();
    }, [id]);

    useEffect(() => {
        fetchCategory();
    }, [id]);

    const fetchCategory = async () => {
        setIsFetching(true);
        try {
            const response = await axios.get(`/admin/categories/${id}`);
            const category = response.data.data || response.data;
            setFormData({
                name: category.name || "",
                icon: category.icon || "",
                isActive: category.isActive !== undefined ? category.isActive : true,
                parentId: category.parentId || category.parent?.id || "",
                commissionRate: category.commissionRate ? category.commissionRate.toString() : "",
            });

            // Parse questions from JSON
            if (category.questions && Array.isArray(category.questions)) {
                setQuestions(category.questions.map(q => ({
                    id: q.id || `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    question: q.question || "",
                    type: q.type || "text",
                    required: q.required || false,
                    placeholder: q.placeholder || "",
                    unit: q.unit || "",
                    options: q.options || [],
                })));
            } else {
                setQuestions([]);
            }
        } catch (error) {
            console.error('Error fetching category:', error);
            alert('Kategori yüklenirken bir hata oluştu.');
            router.push('/categories');
        } finally {
            setIsFetching(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const addQuestion = () => {
        const newQuestion = {
            id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            question: "",
            type: "text",
            required: false,
            placeholder: "",
            unit: "",
            options: [],
        };
        setQuestions([...questions, newQuestion]);
    };

    const removeQuestion = (index) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const updateQuestion = (index, field, value) => {
        const updated = [...questions];
        updated[index] = { ...updated[index], [field]: value };
        setQuestions(updated);
    };

    const addOption = (questionIndex) => {
        const updated = [...questions];
        if (!updated[questionIndex].options) {
            updated[questionIndex].options = [];
        }
        updated[questionIndex].options.push({ label: "", value: "" });
        setQuestions(updated);
    };

    const removeOption = (questionIndex, optionIndex) => {
        const updated = [...questions];
        updated[questionIndex].options = updated[questionIndex].options.filter((_, i) => i !== optionIndex);
        setQuestions(updated);
    };

    const updateOption = (questionIndex, optionIndex, field, value) => {
        const updated = [...questions];
        updated[questionIndex].options[optionIndex][field] = value;
        setQuestions(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Validate questions
            const validQuestions = questions
                .filter(q => q.question.trim() !== "")
                .map(q => {
                    const question = {
                        id: q.id,
                        question: q.question.trim(),
                        type: q.type,
                        required: q.required || false,
                    };

                    if (q.placeholder) question.placeholder = q.placeholder.trim();
                    if (q.unit) question.unit = q.unit.trim();
                    if ((q.type === 'select' || q.type === 'multiselect') && q.options && q.options.length > 0) {
                        question.options = q.options
                            .filter(opt => opt.label.trim() !== "" && opt.value.trim() !== "")
                            .map(opt => ({
                                label: opt.label.trim(),
                                value: opt.value.trim()
                            }));
                    }

                    return question;
                });

            const data = {
                ...formData,
                parentId: formData.parentId || null,
                commissionRate: formData.commissionRate ? parseFloat(formData.commissionRate) : null,
                questions: validQuestions.length > 0 ? validQuestions : null,
            };

            await axios.patch(`/admin/categories/${id}`, data);
            router.push('/categories');
        } catch (error) {
            console.error('Error updating category:', error);
            alert(error.response?.data?.message || error.message || 'Kategori güncellenirken bir hata oluştu.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div>
                <PageBreadcrumb pageTitle="Kategori Düzenle" />
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <Icon icon="eos-icons:loading" className="text-4xl text-primary animate-spin" />
                        <p className="mt-2 text-gray-600 dark:text-gray-400">Kategori yükleniyor...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <PageBreadcrumb pageTitle="Kategori Düzenle" />
            <div className="space-y-6">
                <ComponentCard
                    title="Kategori Bilgileri"
                    desc="Kategori bilgilerini düzenlemek için aşağıdaki formu kullanın"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <Label htmlFor="name">Kategori Adı *</Label>
                            <Input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Örn: Lokma, Pilav, Yemek, vb."
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="icon">İkon (Iconify icon adı)</Label>
                            <Input
                                type="text"
                                id="icon"
                                name="icon"
                                value={formData.icon}
                                onChange={handleInputChange}
                                placeholder="Örn: ri:home-line, mdi:food, vb."
                            />
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Iconify icon adı girin. Örnek: ri:home-line
                            </p>
                        </div>

                        <div>
                            <Label htmlFor="parentId">Üst Kategori (Opsiyonel)</Label>
                            {loadingParents ? (
                                <div className="flex items-center gap-2 py-2">
                                    <Icon icon="eos-icons:loading" className="text-lg animate-spin" />
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Yükleniyor...</span>
                                </div>
                            ) : (
                                <select
                                    id="parentId"
                                    name="parentId"
                                    value={formData.parentId}
                                    onChange={handleInputChange}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                >
                                    <option value="">Ana Kategori (Üst kategori yok)</option>
                                    {parentCategories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Bu kategoriyi bir üst kategoriye bağlamak için üst kategori seçin. Boş bırakırsanız ana kategori olur.
                            </p>
                        </div>

                        <div>
                            <Label htmlFor="commissionRate">Komisyon Oranı (Binde)</Label>
                            <Input
                                type="number"
                                id="commissionRate"
                                name="commissionRate"
                                value={formData.commissionRate}
                                onChange={handleInputChange}
                                placeholder="Örn: 5 (binde 5), 7 (binde 7)"
                                step="0.1"
                                min="0"
                            />
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Hizmet verenden alınacak komisyon oranı (binde cinsinden). Örnek: 5 = binde 5, 7 = binde 7
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isActive"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleInputChange}
                                className="w-4 h-4"
                            />
                            <Label htmlFor="isActive" className="mb-0">
                                Aktif
                            </Label>
                        </div>

                        {/* Soru Kalıpları */}
                        <div className="border-t pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <Label>Soru Kalıpları</Label>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        Kategoriye özel soru kalıpları ekleyebilirsiniz. Bu sorular talep oluşturulurken kullanıcılara sorulacaktır.
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        addQuestion();
                                    }}
                                    className="flex items-center gap-2"
                                >
                                    <Icon icon="heroicons:plus" className="text-lg" />
                                    Soru Ekle
                                </Button>
                            </div>

                            {questions.length === 0 && (
                                <div className="text-center py-8 border border-dashed rounded-lg text-gray-500 dark:text-gray-400">
                                    <Icon icon="ri:question-line" className="text-4xl mb-2 mx-auto" />
                                    <p>Henüz soru eklenmedi. "Soru Ekle" butonuna tıklayarak soru ekleyebilirsiniz.</p>
                                </div>
                            )}

                            <div className="space-y-4">
                                {questions.map((question, qIndex) => (
                                    <div key={question.id} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                                        <div className="flex items-start justify-between mb-4">
                                            <h4 className="font-medium text-lg">Soru {qIndex + 1}</h4>
                                            <Button
                                                type="button"
                                                variant="danger"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    removeQuestion(qIndex);
                                                }}
                                            >
                                                <Icon icon="ri:delete-bin-line" />
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="md:col-span-2">
                                                <Label>Soru Metni *</Label>
                                                <Input
                                                    type="text"
                                                    value={question.question}
                                                    onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                                                    placeholder="Örn: Kaç porsiyon gerekiyor?"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <Label>Soru Tipi *</Label>
                                                <Select
                                                    options={questionTypes}
                                                    defaultValue={question.type}
                                                    onChange={(value) => updateQuestion(qIndex, 'type', value)}
                                                />
                                            </div>

                                            <div>
                                                <Label>Birim (Sadece sayı tipi için)</Label>
                                                <Input
                                                    type="text"
                                                    value={question.unit}
                                                    onChange={(e) => updateQuestion(qIndex, 'unit', e.target.value)}
                                                    placeholder="Örn: porsiyon, kg, adet"
                                                    disabled={question.type !== 'number'}
                                                />
                                            </div>

                                            {(question.type === 'text' || question.type === 'number') && (
                                                <div className="md:col-span-2">
                                                    <Label>Placeholder</Label>
                                                    <Input
                                                        type="text"
                                                        value={question.placeholder}
                                                        onChange={(e) => updateQuestion(qIndex, 'placeholder', e.target.value)}
                                                        placeholder="Örn: Örn: 500"
                                                    />
                                                </div>
                                            )}

                                            <div className="md:col-span-2 flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    id={`required-${qIndex}`}
                                                    checked={question.required}
                                                    onChange={(e) => updateQuestion(qIndex, 'required', e.target.checked)}
                                                    className="w-4 h-4"
                                                />
                                                <Label htmlFor={`required-${qIndex}`} className="mb-0">
                                                    Zorunlu
                                                </Label>
                                            </div>

                                            {(question.type === 'select' || question.type === 'multiselect') && (
                                                <div className="md:col-span-2">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <Label>Seçenekler</Label>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                addOption(qIndex);
                                                            }}
                                                            className="flex items-center gap-1"
                                                        >
                                                            <Icon icon="heroicons:plus" className="text-sm" />
                                                            Seçenek Ekle
                                                        </Button>
                                                    </div>

                                                    {(!question.options || question.options.length === 0) && (
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                                            Bu soru tipi için seçenekler eklemeniz gerekmektedir.
                                                        </p>
                                                    )}

                                                    {question.options && question.options.length > 0 && (
                                                        <div className="space-y-2">
                                                            {question.options.map((option, oIndex) => (
                                                                <div key={oIndex} className="flex gap-2">
                                                                    <Input
                                                                        type="text"
                                                                        value={option.label}
                                                                        onChange={(e) => updateOption(qIndex, oIndex, 'label', e.target.value)}
                                                                        placeholder="Görünen Metin"
                                                                        className="flex-1"
                                                                    />
                                                                    <Input
                                                                        type="text"
                                                                        value={option.value}
                                                                        onChange={(e) => updateOption(qIndex, oIndex, 'value', e.target.value)}
                                                                        placeholder="Değer"
                                                                        className="flex-1"
                                                                    />
                                                                    <Button
                                                                        type="button"
                                                                        variant="danger"
                                                                        size="sm"
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            e.stopPropagation();
                                                                            removeOption(qIndex, oIndex);
                                                                        }}
                                                                    >
                                                                        <Icon icon="ri:delete-bin-line" />
                                                                    </Button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button
                                type="submit"
                                className="bg-primary text-white"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Icon icon="eos-icons:loading" className="mr-2" />
                                        Kaydediliyor...
                                    </>
                                ) : (
                                    'Kaydet'
                                )}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    router.back();
                                }}
                            >
                                İptal
                            </Button>
                        </div>
                    </form>
                </ComponentCard>
            </div>
        </div>
    );
}
