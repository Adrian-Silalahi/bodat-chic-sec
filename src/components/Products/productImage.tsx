"use client";

import { type CartProductType, type VariationResponseType } from "@/src/types";
import { type ProductImage } from "@prisma/client";
import Image from "next/image";
import React from "react";

interface ProductImageProps {
  selectedProduct: CartProductType;
  product: any;
}

const ProductImage: React.FC<ProductImageProps> = ({
  selectedProduct,
  product,
}) => {
  const [selectedImage, setSelectedImage] = React.useState(
    selectedProduct.image //Type images masih array string di type.ts
  );

  return (
    <div className="flex flex-col gap-4 ">
      {/* Gambar Besar */}
      <div className="relative aspect-square w-full max-h-[70vh] rounded-lg overflow-hidden ">
        <Image
          fill
          src={selectedImage}
          alt={selectedProduct.name}
          className="=object-contain "
        />
      </div>

      {/* Pilihan Gambar */}
      <div className="flex flex-row flex-wrap justify-center gap-4 cursor-pointer  ">
        {product?.images.map((image: ProductImage, index: number) => {
          // Kita perlu key yang unik untuk setiap gambar
          const uniqueKey = `${image.url}-${index}`;

          return (
            <div
              key={uniqueKey}
              onClick={() => {
                setSelectedImage(image.url);
              }}
              className={`relative w-20 aspect-square rounded-md overflow-hidden cursor-pointer 
            ring-2 transition-all
            ${
              selectedImage === image.url
                ? "ring-teal-500" // Aktif
                : "ring-transparent hover:ring-slate-300" // Tidak aktif
            }`}
            >
              <Image
                src={image.url}
                alt={`Image ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductImage;
