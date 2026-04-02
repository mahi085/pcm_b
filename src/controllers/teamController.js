import TeamMember from "../models/TeamMember.js";
import { uploadImage } from "../config/uploadtoCloudnary.js"; // ✅ ADD THIS

export const createTeamMember = async (req, res) => {
  try {
    const { name, role, bio } = req.body;

    if (!name || !role) {
      return res.status(400).json({
        success: false,
        message: "Name and role are required",
      });
    }

    let photo_url = null;

    if (req.file) {
      const uploadedImage = await uploadImage(
        req.file,
        process.env.FILE_UPLOAD_PATH || "team"
      );

      photo_url = uploadedImage.secure_url;
    }

    const teamMember = await TeamMember.create({
      name,
      role,
      bio,
      photo_url,
    });

    res.status(201).json({
      success: true,
      message: "Team member created successfully",
      teamMember,
    });

  } catch (error) {
    console.error("Create team member error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get All Team Members
export const getTeam = async (req, res) => {
  try {
    const team = await TeamMember.findAll();
    res.status(200).json({
      success: true,
      data: { team },
    });
  } catch (error) {
    console.error('Get team error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get Team Member By ID
export const getTeamMemberById = async (req, res) => {
  try {
    const { id } = req.params;
    const teamMember = await TeamMember.findById(id);

    if (!teamMember) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }

    res.status(200).json({
      success: true,
      data: { teamMember },
    });
  } catch (error) {
    console.error('Get team member error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Update Team Member
export const updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, bio } = req.body;

    const teamMember = await TeamMember.findById(id);
    if (!teamMember) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }

    const photo_url = req.file ? getFileUrl(req.file.filename) : teamMember.photo_url;

    const updatedTeamMember = await TeamMember.update(id, { name, role, bio, photo_url });

    res.status(200).json({
      success: true,
      message: 'Team member updated successfully',
      teamMember: updatedTeamMember,
    });
  } catch (error) {
    console.error('Update team member error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Delete Team Member
export const deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;

    const teamMember = await TeamMember.findById(id);
    if (!teamMember) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }

    await TeamMember.deleteById(id);

    res.status(200).json({
      success: true,
      message: 'Team member deleted successfully',
    });
  } catch (error) {
    console.error('Delete team member error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
