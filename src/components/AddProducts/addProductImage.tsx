// import React, { useCallback, useState } from "react";
// import SelectImage from "../Inputs/selectImage";

// interface AddProductImageProps {
//   images?: File[];
//   isProductCreated?: boolean;
//   setFieldValue: (field: string, value: any) => void;
// }

// const AddProductImage: React.FC<AddProductImageProps> = ({
//   setFieldValue,
//   images,
// }) => {
//   const handleFileChange = useCallback(
//     (value: File[]) => {
//       setFieldValue("images", value);
//     },
//     [setFieldValue]
//   );

//   return (
//     <div className="w-full flex flex-col flex-wrap gap-4 ">
//       <SelectImage handleFileChange={handleFileChange} images={images} />
//     </div>
//   );
// };

// export default AddProductImage;

import React, { useCallback } from "react";
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableImageItem } from "../Products/SortableImage"; // Komponen baru yang akan kita buat

interface AddProductImageProps {
  images: File[]; // Ini didapat dari watch("images")
  isProductCreated?: boolean; // Anda sudah punya ini
  setFieldValue: (field: string, value: any) => void;
}

const AddProductImage: React.FC<AddProductImageProps> = ({
  images,
  setFieldValue,
}) => {
  // Sensor untuk mendeteksi mouse atau touch
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10, // Butuh drag 10px sebelum aktif
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250, // Tahan 250ms untuk mulai drag di HP
        tolerance: 5,
      },
    })
  );

  // Fungsi ini dipanggil saat file baru dipilih
  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        const newFiles = Array.from(event.target.files);
        // Menambahkan file baru ke array yang sudah ada
        setFieldValue("images", [...(images || []), ...newFiles]);
      }
    },
    [images, setFieldValue]
  );

  // Fungsi ini dipanggil saat drag-and-drop selesai
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        // 'id' yang kita gunakan di sini adalah (file.name + file.lastModified)
        // Ini adalah cara unik untuk mengidentifikasi file
        const oldIndex = images.findIndex(
          (f) => f.name + f.lastModified === active.id
        );
        const newIndex = images.findIndex(
          (f) => f.name + f.lastModified === over.id
        );

        // Menggunakan arrayMove untuk membuat array baru yang sudah terurut
        const newSortedImages = arrayMove(images, oldIndex, newIndex);

        // Update state react-hook-form dengan urutan baru
        setFieldValue("images", newSortedImages);
      }
    },
    [images, setFieldValue]
  );

  // Fungsi untuk menghapus gambar
  const handleRemoveImage = useCallback(
    (idToRemove: string) => {
      const newImages = images.filter(
        (f) => f.name + f.lastModified !== idToRemove
      );
      setFieldValue("images", newImages);
    },
    [images, setFieldValue]
  );

  // Kita butuh array ID yang stabil untuk SortableContext
  const imageIds = images ? images.map((f) => f.name + f.lastModified) : [];

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="file-upload"
          className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md text-center hover:bg-blue-600 transition"
        >
          Pilih Gambar
        </label>
        <input
          id="file-upload"
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden" // Sembunyikan input aslinya
        />
        <p className="text-sm text-gray-500">
          Gambar pertama akan menjadi **Cover**. Anda bisa drag-and-drop untuk
          mengubah urutan.
        </p>
      </div>

      {/* Area Drag-and-Drop */}
      {images && images.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={imageIds} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {images.map((file, index) => (
                <SortableImageItem
                  key={file.name + file.lastModified} // Key unik
                  file={file}
                  id={file.name + file.lastModified} // ID unik untuk dnd-kit
                  index={index}
                  onRemove={handleRemoveImage}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default AddProductImage;
