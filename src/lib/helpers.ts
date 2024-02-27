import { v2 as cloudinary } from "cloudinary";

export const uploadImage = async (image?: Express.Multer.File) => {
  let uploadResponse;

  if (image) {
    const base64Image = image.buffer.toString("base64");
    const dataURI = `data:${image.mimetype};base64,${base64Image}`;

    uploadResponse = await cloudinary.uploader.upload(dataURI);
  }

  return uploadResponse?.url;
};
