// import toast from "react-hot-toast";
// import {
//   getDownloadURL,
//   getStorage,
//   ref,
//   uploadBytesResumable,
// } from "firebase/storage";
// import firebaseApp from "../libs/firebase";
// import { type FieldValues } from "react-hook-form";
// import { type VariationResponseType } from "@/src/types";

// interface uploadImageToFirebaseProps {
//   productData: FieldValues;
//   uploadedImages: VariationResponseType[];
//   setIsLoading: (isLoading: boolean) => void;
// }
// export const uploadImageToFirebase = async ({
//   productData,
//   uploadedImages,
//   setIsLoading,
// }: uploadImageToFirebaseProps): Promise<void> => {
//   toast("Creating product, please wait..");
//   try {
//     for (const info of productData.imageInfo) {
//       const image = info.image;
//       if (image) {
//         const fileName = `${new Date().getTime()} - ${image.name}`;
//         const storage = getStorage(firebaseApp);
//         const storageRef = ref(storage, `products/${fileName}`);
//         const uploadTask = uploadBytesResumable(storageRef, image);

//         await new Promise<void>((resolve, reject) => {
//           uploadTask.on(
//             "state_changed",
//             (snapshot) => {
//               const progress =
//                 (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//               console.log("Upload is " + progress + "% done");
//               switch (snapshot.state) {
//                 case "paused":
//                   console.log("Upload is paused");
//                   break;
//                 case "running":
//                   console.log("Upload is running");
//                   break;
//               }
//             },
//             (error) => {
//               console.log("Error uploading image", error);
//               reject(error);
//             },
//             () => {
//               getDownloadURL(uploadTask.snapshot.ref)
//                 .then((downloadURL) => {
//                   uploadedImages.push({
//                     ...info,
//                     image: downloadURL,
//                   });
//                   console.log("File available at", downloadURL);
//                   resolve();
//                 })
//                 .catch((error) => {
//                   console.log("Error getting the download URL", error);
//                   reject(error);
//                 });
//             }
//           );
//         });
//       }
//     }
//   } catch (error) {
//     setIsLoading(false);
//     console.log("Error handling image uploads", error);
//     toast.error("Error handling image uploads");
//   }
// };

// File: ../utils/UploadImageToFirebase.ts
// (Hapus isi file lama Anda dan ganti dengan ini)

import toast from "react-hot-toast";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import firebaseApp from "../libs/firebase";

/**
 * [HELPER] Mengunggah satu file ke Firebase Storage.
 */
const uploadSingleFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const storage = getStorage(firebaseApp);
    const fileName = `${new Date().getTime()} - ${file.name}`;
    const storageRef = ref(storage, `products/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        /* ... (opsional: log kemajuan) ... */
      },
      (error) => {
        console.log(`Error uploading ${file.name}`, error);
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => resolve(downloadURL))
          .catch((error) => reject(error));
      }
    );
  });
};

/**
 * [FUNGSI UTAMA BARU]
 * Mengunggah array file gambar secara bersamaan.
 * @param images - Array File object dari form.
 * @param setIsLoading - Fungsi untuk mengatur state loading.
 * @returns Promise yang resolve dengan array URL gambar (string[]).
 */
export const uploadImagesToFirebase = async (
  images: File[],
  setIsLoading: (isLoading: boolean) => void
): Promise<string[]> => {
  toast("Uploading images, please wait...");

  try {
    // 1. Map setiap file menjadi sebuah promise unggahan
    const imageUploadPromises = images.map((file) => uploadSingleFile(file));

    // 2. Tunggu SEMUA gambar selesai diunggah
    const downloadedImageUrls = await Promise.all(imageUploadPromises);

    toast.success("Images uploaded successfully!");
    return downloadedImageUrls;
  } catch (error) {
    setIsLoading(false); // Set loading false jika ada error
    console.error("Error handling concurrent image uploads", error);
    toast.error("Error: Could not upload images.");
    return []; // Kembalikan array kosong jika gagal
  }
};
