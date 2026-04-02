import Testimonial from '../models/Testimonial.js';

// Create Testimonial
export const createTestimonial = async (req, res) => {
  try {
    const { name, text, rating } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, message: 'Testimonial text is required' });
    }

    const testimonial = await Testimonial.create({ name, text, rating });

    res.status(201).json({
      success: true,
      message: 'Testimonial created successfully',
      testimonial,
    });
  } catch (error) {
    console.error('Create testimonial error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get All Testimonials
export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.getAll();
    res.status(200).json({
      success: true,
      data: { testimonials },
    });
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Delete Testimonial
export const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    await Testimonial.deleteById(id);

    res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully',
    });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
