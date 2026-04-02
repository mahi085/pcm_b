import express from 'express';
import { upload } from '../config/upload.js';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import {
  createGallery,
  getGallery,
  getGalleryById,
  updateGallery,
  deleteGallery,
} from '../controllers/galleryController.js';
import {
  createTeamMember,
  getTeam,
  getTeamMemberById,
  updateTeamMember,
  deleteTeamMember,
} from '../controllers/teamController.js';
import {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} from '../controllers/blogController.js';
import {
  getHero,
  saveHero,
} from '../controllers/heroController.js';
import {
  createTestimonial,
  getTestimonials,
  deleteTestimonial,
} from '../controllers/testimonialController.js';

const router = express.Router();

// products
router.post('/products', upload.single('file'), createProduct);
router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.put('/products/:id', upload.single('file'), updateProduct);
router.delete('/products/:id', deleteProduct);

// gallery
router.post('/gallery', upload.single('file'), createGallery);
router.get('/gallery', getGallery);
router.get('/gallery/:id', getGalleryById);
router.put('/gallery/:id', upload.single('file'), updateGallery);
router.delete('/gallery/:id', deleteGallery);

// team
router.post('/team', upload.single('file'), createTeamMember);
router.get('/team', getTeam);
router.get('/team/:id', getTeamMemberById);
router.put('/team/:id', upload.single('file'), updateTeamMember);
router.delete('/team/:id', deleteTeamMember);

// blog
router.post('/blogs', upload.single('file'), createBlog);
router.get('/blogs', getBlogs);
router.get('/blogs/:id', getBlogById);
router.put('/blogs/:id', upload.single('file'), updateBlog);
router.delete('/blogs/:id', deleteBlog);

// hero
router.get('/hero', getHero);
router.post('/hero', upload.single('file'), saveHero);

// testimonials
router.post('/testimonials', createTestimonial);
router.get('/testimonials', getTestimonials);
router.delete('/testimonials/:id', deleteTestimonial);

export default router;
