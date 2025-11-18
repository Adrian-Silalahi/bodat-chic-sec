// components/AddProducts/SortableImageItem.tsx (FILE BARU)

import React, { useEffect, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableImageItemProps {
  file: File;
  id: string; // ID unik (file.name + file.lastModified)
  index: number;
  onRemove: (id: string) => void;
}

export const SortableImageItem: React.FC<SortableImageItemProps> = ({
  file,
  id,
  index,
  onRemove,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  // Style untuk efek drag
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Membuat URL preview saat komponen di-mount
  // dan menghapusnya saat di-unmount (mencegah memory leak)
  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="relative aspect-square rounded-md overflow-hidden border border-gray-300"
    >
      {/* Tombol Hapus (X) */}
      <button
        type="button"
        onClick={() => onRemove(id)}
        className="absolute top-1 right-1 z-10 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold"
        aria-label="Hapus gambar"
      >
        X
      </button>

      {/* Label "Cover" */}
      {index === 0 && (
        <span className="absolute bottom-1 left-1 z-10 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          Cover
        </span>
      )}

      {/* Gambar Preview */}
      {previewUrl && (
        <img
          src={previewUrl}
          alt={`Preview ${file.name}`}
          className="w-full h-full object-cover"
        />
      )}

      {/* Handle untuk Drag (seluruh area gambar) */}
      <div
        {...listeners}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        aria-label="Drag untuk mengurutkan"
      ></div>
    </div>
  );
};
