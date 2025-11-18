import { ProductImage } from "@prisma/client";
import axios from "axios";
import { type FirebaseStorage, deleteObject, ref } from "firebase/storage";
import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import toast from "react-hot-toast";

interface deleteProductProps {
  id: string;
  images: ProductImage[];
  storage: FirebaseStorage;
  router: AppRouterInstance;
}

export const deleteProduct = async ({
  id,
  images,
  storage,
  router,
}: deleteProductProps): Promise<void> => {
  const deleteImageFromFirebase = async (): Promise<void> => {
    try {
      for (const image of images) {
        if (image) {
          const imageRef = ref(storage, image.url);
          await deleteObject(imageRef);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProductFromDatabase = (): void => {
    axios
      .delete(`/api/product/${id}`)
      .then((response) => {
        toast.success("Product deleted");
        router.refresh();
      })
      .catch((error) => {
        toast.error("Failed to delete product");
        console.log(error);
      });
  };

  toast("Deleting product, please wait");
  await deleteImageFromFirebase();
  deleteProductFromDatabase();
};
