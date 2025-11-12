"use client";
import React from "react";
import Link from "next/link";
import TruncateText from "@/src/utils/TruncateText";
import Image from "next/image";
import Counter from "@/src/components/Counter/counter";
import { useCart } from "@/src/hooks/useCart";
import { CartProductType } from "@/src/types";

interface CartItemProps {
  product: CartProductType;
}

const CartItem: React.FC<CartItemProps> = ({ product }) => {
  const { handleRemoveProductFromCart } = useCart();

  return (
    <div className="grid grid-cols-4 text-xs md:text-sm gap-4 border-t-[1.5px] border-slate-200 py-4 items-center w-full">
      <div className="col-span-2 justify-self-start flex gap-2 md:gap-4">
        <Link href={`/productDetail/${product?.productId}`}>
          <div className="relative w-[70px] aspect-square">
            <Image
              src={product?.image}
              alt={product?.name}
              fill
              className="object-contain"
            />
          </div>
        </Link>
        <div className="flex flex-col justify-between">
          <Link href={`/productDetail/${product.productId}`}>
            {TruncateText(product?.name)}
          </Link>
          <div className="text-sm text-slate-500">Size: {product?.size}</div>
          <div className="w-[70px]">
            <button
              className="text-slate-500 underline"
              onClick={() => {
                handleRemoveProductFromCart(product);
              }}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
      <div className="justify-self-center hover:cursor-pointer">
        Rp {product?.price}
      </div>
      <div className="justify-self-end font-semibold">Rp {product?.price}</div>
    </div>
  );
};

export default CartItem;
