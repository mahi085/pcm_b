import Blog from "../models/Blog.js";
import { uploadImage } from "../config/uploadtoCloudnary.js";

export const createBlog = async (req, res) => {
  try {
    const { title, summary, content } = req.body;

    // ✅ Validation
    if (!title || !summary || !content) {
      return res.status(400).json({
        success: false,
        message: "Title, summary, and content are required",
      });
    }

    let image_url = null;

    // ✅ Upload image if exists
    if (req.file) {
      const uploadedImage = await uploadImage(
        req.file,
        process.env.FILE_UPLOAD_PATH
      );

      image_url = uploadedImage.secure_url;
    }

    // ✅ Save blog
    const blog = await Blog.create({
      title,
      summary,
      content,
      image_url,
    });

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      blog,
    });

  } catch (error) {
    console.error("Create blog error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get All Blogs
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.findAll();
    res.status(200).json({
      success: true,
      data: { blogs },
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get Blog By ID
export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    res.status(200).json({
      success: true,
      data: { blog },
    });
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Update Blog
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, summary, content } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const image_url = req.file ? getFileUrl(req.file.filename) : blog.image_url;

    const updatedBlog = await Blog.update(id, { title, summary, content, image_url });

    res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      blog: updatedBlog,
    });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Delete Blog
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    await Blog.deleteById(id);

    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully',
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
