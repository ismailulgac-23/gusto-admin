"use client";
import React, { useEffect, useState } from 'react';

const CKEditorComponent = ({ initialValue = '', onChange, placeholder = 'İçerik giriniz...' }) => {
  const [editor, setEditor] = useState(null);
  const [CKEditor, setCKEditor] = useState(null);
  const [ClassicEditor, setClassicEditor] = useState(null);

  useEffect(() => {
    // Load CKEditor dynamically to avoid SSR issues
    const loadEditor = async () => {
      try {
        const { CKEditor } = await import('@ckeditor/ckeditor5-react');
        const ClassicEditor = await import('@ckeditor/ckeditor5-build-classic');
        setCKEditor(() => CKEditor);
        setClassicEditor(() => ClassicEditor.default);
      } catch (error) {
        console.error("CKEditor load error:", error);
      }
    };
    loadEditor();
  }, []);

  if (!CKEditor || !ClassicEditor) {
    return <div className="border rounded p-4 bg-gray-50 dark:bg-gray-800 animate-pulse">CKEditor yükleniyor...</div>;
  }

  return (
    <div className="ck-editor-wrapper dark:text-black">
      <CKEditor
        editor={ClassicEditor}
        data={initialValue}
        onReady={(editor) => {
          setEditor(editor);
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          if (onChange) {
            onChange(data);
          }
        }}
        config={{
          placeholder: placeholder,
          toolbar: [
            'heading',
            '|',
            'bold',
            'italic',
            'link',
            'bulletedList',
            'numberedList',
            'blockQuote',
            '|',
            'imageUpload',
            'insertTable',
            'undo',
            'redo',
          ],
          ckfinder: {
            uploadUrl: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/admin/upload`,
          }
        }}
      />
      <style jsx global>{`
        .ck-editor__editable_inline {
          min-height: 400px;
        }
        .dark .ck-editor__editable_inline {
            background-color: #fff !important;
            color: #000 !important;
        }
        .ck.ck-editor__main>.ck-editor__editable {
            background: #fff !important;
        }
      `}</style>
    </div>
  );
};

export default CKEditorComponent;