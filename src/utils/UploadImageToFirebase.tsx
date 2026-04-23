import toast from "react-hot-toast";

export const uploadImagesToFirebase = async (
  images: File[],
  setIsLoading: (isLoading: boolean) => void,
): Promise<string[]> => {
  toast("Uploading images, please wait...");

  try {
    const uploadedUrls: string[] = [];

    for (const file of images) {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      uploadedUrls.push(data.url);
    }

    toast.success("Images uploaded successfully!");
    return uploadedUrls;
  } catch (error) {
    setIsLoading(false);
    toast.error("Error: Could not upload images.");
    return [];
  }
};
