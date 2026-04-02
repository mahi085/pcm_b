import Hero from '../models/Hero.js';
import { getFileUrl } from '../config/upload.js';

// Get Hero Section
export const getHero = async (req, res) => {
  try {
    const hero = await Hero.get();
    res.status(200).json({
      success: true,
      data: { hero },
    });
  } catch (error) {
    console.error('Get hero error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Save/Update Hero Section
export const saveHero = async (req, res) => {
  try {
    const { title, description, button1_text, button2_text } = req.body;
    const image_url = req.file ? getFileUrl(req.file.filename) : null;

    const currentHero = await Hero.get();

    const heroData = {
      title: title || currentHero?.title,
      description: description || currentHero?.description,
      button1_text: button1_text || currentHero?.button1_text,
      button2_text: button2_text || currentHero?.button2_text,
      image_url: image_url || currentHero?.image_url,
    };

    const hero = await Hero.upsert(heroData);

    res.status(200).json({
      success: true,
      message: 'Hero section updated successfully',
      hero,
    });
  } catch (error) {
    console.error('Save hero error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
