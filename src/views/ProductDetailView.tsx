"use client";

import React, { useEffect, useState } from "react";
import Hr from "../components/Hr";
import { type CartProductType } from "@/src/types";
import CustomButton from "../components/CustomButton";
import ProductImage from "../components/Products/productImage";
import { useCart } from "../hooks/useCart";
import { MdArrowBack, MdCheckCircle } from "react-icons/md";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import { formatRupiah } from "../utils/FormatRupiah";

interface TypeProps {
  product: any;
  user: User;
}

const ProductDetailView: React.FC<TypeProps> = ({ product, user }) => {
  const router = useRouter();
  const { handleAddProductToCart, cartProducts } = useCart();
  const [isProductInCart, setIsProductInCart] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<CartProductType>({
    id: uuidv4(),
    productId: product.id,
    userId: user?.id,
    name: product.name,
    description: product.description,
    category: product.category,
    brand: product.brand,
    image: product.images[0],
    size: product.size,
    price: product.price,
  });

  const MIN_LENGTH_FOR_BUTTON = 200;

  useEffect(() => {
    if (cartProducts !== null && cartProducts.length) {
      const isInCart = cartProducts.some(
        (cartProduct) => cartProduct.productId === selectedProduct.productId
      );
      setIsProductInCart(isInCart);
    } else {
      setIsProductInCart(false);
    }
  }, [cartProducts, selectedProduct]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-screen md:min-h-fit px-4 md:px-10 md:gap-8 lg:gap-12 items-start ">
      {/* Gambar Produk */}
      <ProductImage selectedProduct={selectedProduct} product={product} />
      {/* Detail Produk */}
      <div className="flex flex-col py-4  md:py-0 ">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg md:text-2xl font-bold text-slate-800">
            {product.name}
          </h2>
          <div className="flex flex-col text-md  text-slate-500 font-thin">
            <div>
              SIZE :<span className="ml-2">{product.size}</span>
            </div>
          </div>
          <div className="text-md md:text-lg font-extrabold text-slate-900">
            {formatRupiah(product.price)}
          </div>
        </div>
        <hr className="my-2 mb-4" /> {/* Pemisah tipis */}
        {/* DETAIL PRODUK - Menggunakan grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-y-2 gap-x-4 ">
          <div className="flex flex-col ">
            <span className="text-sm font-semibold text-slate-500">
              CATEGORY
            </span>
            <span className="text-base text-slate-800">{product.category}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-500">BRAND</span>
            <span className="text-base text-slate-800">{product.brand}</span>
          </div>
        </div>
        <hr className="my-2 mb-4" /> {/* Pemisah tipis */}
        {/* LOGIKA TOMBOL & LOGIN */}
        {/* Bagian ini tidak diubah logikanya, hanya penempatannya */}
        {!user ? (
          <div className="flex flex-col items-center p-4 bg-slate-100 rounded-lg">
            <div className="text-xl font-semibold text-slate-700">
              Please login first
            </div>
            <Link
              href={"/login"}
              className="text-slate-600 flex items-center gap-1 mt-2 hover:text-slate-800 transition"
            >
              <MdArrowBack />
              <span>Login</span>
            </Link>
          </div>
        ) : isProductInCart ? (
          <div className="flex flex-col lg:flex-row gap-y-1 gap-2 lg:gap-4 sm:py-4">
            <div className="w-full md:max-w-[200px]">
              <CustomButton
                label="View Cart"
                outline
                onClick={() => {
                  router.push("/cart");
                }}
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-teal-600 font-medium">
              <MdCheckCircle size={20} />
              <span>Product added to cart</span>
            </div>
          </div>
        ) : (
          <>
            <div className="w-full md:max-w-[300px]">
              <CustomButton
                label="Add to cart"
                onClick={() => {
                  handleAddProductToCart(selectedProduct);
                }}
              />
            </div>
          </>
        )}
        <div className="mt-6 lg:mt-4">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            Description
          </h3>

          {/* Cek apakah deskripsi perlu dipotong */}
          {product.description.length <= MIN_LENGTH_FOR_BUTTON ? (
            // KASUS 1: Teks pendek, tampilkan semua.
            <div
              className="text-base text-slate-600 leading-relaxed"
              style={{ whiteSpace: "pre-wrap" }} // 'pre-wrap' penting untuk format
            >
              {product.description}
            </div>
          ) : (
            // KASUS 2: Teks panjang, tampilkan dengan tombol "Read More".
            <div>
              <div
                className={`text-base text-slate-600 leading-relaxed transition-all duration-300 
                  ${
                    isExpanded
                      ? "" // 'isExpanded' = true: Hapus line-clamp
                      : "line-clamp-5 md:line-clamp-2 lg:line-clamp-5 xl:line-clamp-6 " // 'isExpanded' = false: Terapkan line-clamp
                  }`}
                style={{ whiteSpace: "pre-wrap" }} // 'pre-wrap' penting untuk format
              >
                {product.description}
              </div>

              {/* Tombol untuk toggle */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-blue-600 hover:text-blue-800 font-semibold mt-2"
              >
                {isExpanded ? "Sembunyikan" : "Lihat semua"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailView;
