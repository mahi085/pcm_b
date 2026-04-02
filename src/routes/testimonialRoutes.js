import express from 'express';
import { getTestimonials, createTestimonial } from '../controllers/testimonialController.js';

const router = express.Router();

router.get('/testimonials', getTestimonials);
router.post('/testimonials', createTestimonial);

export default router;
