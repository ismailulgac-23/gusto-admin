import Link from "next/link";
import React from "react";
import Button from "../ui/button/Button";

interface BreadcrumbProps {
  pageTitle: string;
  onSave?: () => void;
  loading ?: boolean;
  create?: string;
  onCreate?: () => void;
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({ pageTitle, onSave, loading, create, onCreate }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <h2
        className="text-xl font-semibold text-gray-800 dark:text-white/90"
        x-text="pageName"
      >
        {pageTitle}
      </h2>
      <div className="flex items-center gap-2">
        {create && (
          <Link href={create}>
            <Button variant="outline">Yeni Oluştur</Button>
          </Link>
        )}
        {onSave && <Button onClick={onSave} disabled={loading}>{loading ? "Kaydediliyor..." : "Kaydet"}</Button>}
        {onCreate && <Button onClick={onCreate} disabled={loading}>{loading ? "Oluşturuluyor..." : "Oluştur"}</Button>}
      </div>
    </div>
  );
};

export default PageBreadcrumb;
