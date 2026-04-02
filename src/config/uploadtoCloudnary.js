

import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

export const uploadImage = (file, folder, height, quality) => {
  const options = {
    folder,
    resource_type: "auto",
  };

  if (height) options.height = height;
  if (quality) options.quality = quality;

  return new Promise((resolve, reject) => {
   // console.log("Buffer exists:", !!file.buffer); // debug

    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          console.error("Cloudinary error:", error);
          return reject(error);
        }
        //console.log("Upload successful:", result);
        resolve(result);
      }
    );

    // 🔥 THIS IS THE KEY LINE
    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};