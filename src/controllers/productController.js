import Product from '../models/Product.js';
import { getFileUrl } from '../config/upload.js';
import { uploadImage } from '../config/uploadtoCloudnary.js';

// Create Product
export const createProduct = async (req, res) => {
  try {
    const { name, description } = req.body;
   // console.log("Received file: line 9", req.file); 
    const thumbnailImage = await uploadImage(
      req.file,
      process.env.FILE_UPLOAD_PATH,
    );
    //const image_url = req.file ? getFileUrl(req.file.filename) : null;
    const image_url = thumbnailImage ? thumbnailImage.secure_url : null;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Product name is required' });
    }

    const product = await Product.create({ name, description, image_url });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get All Products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json({
      success: true,
      data: { products },
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get Product By ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      data: { product },
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const image_url = req.file ? getFileUrl(req.file.filename) : product.image_url;

    const updatedProduct = await Product.update(id, { name, description, image_url });

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await Product.deleteById(id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
