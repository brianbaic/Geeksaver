import { useState } from 'react';

export default function UploadArea({ image, onUpload, fileInputRef, onFileInput }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files[0]) onUpload(files[0]);
  };

  return (
    <>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all mb-4 ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-outline-variant hover:border-primary hover:bg-primary/5 bg-surface-lowest'
        }`}
      >
        <div className="text-5xl mb-3">📤</div>
        <p className="text-sm text-on-surface-variant mb-2">Drag and drop file here</p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          className="text-primary font-semibold text-sm hover:underline"
        >
          Select Image
        </button>
        <div className="text-xs text-outline-variant mt-3 uppercase tracking-wider">
          PNG, JPEG, WebP, GIF
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={onFileInput}
        className="hidden"
      />
    </>
  );
}
