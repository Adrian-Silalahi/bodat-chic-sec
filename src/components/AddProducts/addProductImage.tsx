import React, { useCallback, useState } from "react";
import SelectImage from "../Inputs/selectImage";

interface AddProductImageProps {
  images?: File[];
  isProductCreated?: boolean;
  setFieldValue: (field: string, value: any) => void;
}

const AddProductImage: React.FC<AddProductImageProps> = ({
  setFieldValue,
  images,
}) => {
  const handleFileChange = useCallback(
    (value: File[]) => {
      setFieldValue("images", value);
    },
    [setFieldValue]
  );

  return (
    <div className="w-full flex flex-col flex-wrap gap-4 ">
      <SelectImage handleFileChange={handleFileChange} images={images} />
    </div>
  );
};

export default AddProductImage;
