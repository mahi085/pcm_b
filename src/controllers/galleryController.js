import Gallery from "../models/Gallery.js";
import { uploadImage } from "../config/uploadtoCloudnary.js";

export const createGallery = async (req, res) => {
  try {
    const { description } = req.body;

    // ✅ check file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    // ✅ upload to Cloudinary
    const uploadedImage = await uploadImage(
      req.file,
      process.env.FILE_UPLOAD_PATH || "gallery"
    );

    const image_url = uploadedImage.secure_url;

    // ✅ save to DB
    const gallery = await Gallery.create({
      image_url,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Gallery item created successfully",
      gallery,
    });

  } catch (error) {
    console.error("Create gallery error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get All Gallery Items
export const getGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findAll();
    res.status(200).json({
      success: true,
      data: { gallery },
    });
  } catch (error) {
    console.error('Get gallery error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get Gallery Item By ID
export const getGalleryById = async (req, res) => {
  try {
    const { id } = req.params;
    const gallery = await Gallery.findById(id);

    if (!gallery) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }

    res.status(200).json({
      success: true,
      data: { gallery },
    });
  } catch (error) {
    console.error('Get gallery item error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Update Gallery Item
export const updateGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    const gallery = await Gallery.findById(id);
    if (!gallery) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }

    const image_url = req.file ? getFileUrl(req.file.filename) : gallery.image_url;

    const updatedGallery = await Gallery.update(id, { image_url, description });

    res.status(200).json({
      success: true,
      message: 'Gallery item updated successfully',
      gallery: updatedGallery,
    });
  } catch (error) {
    console.error('Update gallery error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Delete Gallery Item
export const deleteGallery = async (req, res) => {
  try {
    const { id } = req.params;

    const gallery = await Gallery.findById(id);
    if (!gallery) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }

    await Gallery.deleteById(id);

    res.status(200).json({
      success: true,
      message: 'Gallery item deleted successfully',
    });
  } catch (error) {
    console.error('Delete gallery error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
