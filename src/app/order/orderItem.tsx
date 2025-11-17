"use client";

import { CartProductType } from "@/src/types";
import { formatDolar } from "@/src/utils/FormatDolar";
import TruncateText from "@/src/utils/TruncateText";
import Image from "next/image";
import React from "react";

interface OrderItemProps {
  product: CartProductType;
}

const OrderItem: React.FC<OrderItemProps> = ({ product }) => {
  return (
    <div className="grid grid-cols-2 text-xs md:text-sm gap-4 border-t-[1.5px] border-slate-200 py-4 items-center">
      <div className="col-span-1 justify-self-start flex gap-2 md:gap-4">
        <div className="col-span-1 relative w-[70px] aspect-square">
          <Image
            src={product.image}
            alt={product?.name}
            fill
            className="object-contain"
          />
        </div>
        <div className="flex items-center">
          <div>{TruncateText(product?.name)}</div>
        </div>
      </div>
      <div className="justify-self-center font-semibold">
        {formatDolar(product?.price)}
      </div>
    </div>
  );
};

export default OrderItem;
