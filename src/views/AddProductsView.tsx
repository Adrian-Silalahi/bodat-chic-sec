/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable react/react-in-jsx-scope */
"use client";

import Heading from "@/src/components/Heading";
import { useState, useEffect, useCallback } from "react";
import { type FieldValues, type SubmitHandler, useForm } from "react-hook-form";
import AddProductForm from "../components/AddProducts/addProductForm";
import AddProductCategory from "../components/AddProducts/addProductCategory";
import { type VariationRequestType } from "../types";
import AddProductImage from "../components/AddProducts/addProductImage";
import CustomButton from "../components/CustomButton";
import toast from "react-hot-toast";
import { type VariationResponseType } from "@/src/types";
import { uploadImagesToFirebase } from "../utils/UploadImageToFirebase";
import { postProductToDataBase } from "../utils/PostProductToDataBase";
import { useRouter } from "next/navigation";

const AddProductsView = (): React.ReactElement => {
  const [isLoading, setIsLoading] = useState(false);
  const [isProductCreated, setIsProductCreated] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      description: "",
      brand: "",
      category: "",
      images: [],
      price: "",
      size: "",
    },
  });

  useEffect(() => {
    if (isProductCreated) {
      reset();
      setIsProductCreated(false);
    }
  }, [isProductCreated]);

  const onSubmit: SubmitHandler<FieldValues> = async (productData) => {
    setIsLoading(true);
    const uploadedImages: VariationResponseType[] = [];
    const categoryNotSelected = !productData.category;
    const imageNotEntered =
      !productData.images || productData.images.length === 0;

    if (categoryNotSelected) {
      setIsLoading(false);
      return toast.error("Please select a category");
    }

    if (imageNotEntered) {
      setIsLoading(false);
      return toast.error("Please add at least one image");
    }

    const uploadedImageUrls = await uploadImagesToFirebase(
      productData.images,
      setIsLoading
    );
    // 2. Cek jika terjadi kegagalan (fungsi akan return array kosong)
    if (uploadedImageUrls.length === 0) {
      setIsLoading(false);
      return; // Error sudah ditangani di dalam fungsi upload
    }

    // 3. Buat data produk final dengan 'variations' yang sudah berisi URL
    const finalProductData = {
      ...productData,
      images: uploadedImageUrls,
    };
    // 4. Kirim data final ke database
    postProductToDataBase({
      currentProductData: finalProductData,
      setIsProductCreated,
      setIsLoading,
      router,
    });
  };

  const category = watch("category");
  const images = watch("images");

  const setFieldValue = (field: string, selectedLabel: any): void => {
    setValue(field, selectedLabel, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  return (
    <>
      <Heading title="Add Products" center />
      <AddProductForm
        isLoading={isLoading}
        register={register}
        errors={errors}
      />
      <AddProductCategory category={category} setFieldValue={setFieldValue} />
      <AddProductImage
        isProductCreated={isProductCreated}
        setFieldValue={setFieldValue}
        images={images}
      />
      <CustomButton
        label={isLoading ? "Loading..." : "Add Product"}
        disabled={isLoading}
        onClick={handleSubmit(onSubmit)}
      />
    </>
  );
};

export default AddProductsView;
