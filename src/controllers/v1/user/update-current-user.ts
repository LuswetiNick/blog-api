import { logger } from "@/lib/winston";
import User from "@/models/user";

import type { Request, Response } from "express";

const updateCurrentUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.userId;
  const {
    username,
    email,
    password,
    firstName,
    lastName,
    website,
    x,
    instagram,
    linkedin,
    facebook,
  } = req.body;
  try {
    const user = await User.findById(userId).select("+password").exec();
    if (!user) {
      res.status(404).json({
        code: "NOT_FOUND",
        message: "User not found",
      });
      return;
    }
    if (username && username.trim()) user.username = username;
    if (email && email.trim()) user.email = email;
    if (password && password.trim()) user.password = password;
    if (firstName && firstName.trim()) user.firstName = firstName;
    if (lastName && lastName.trim()) user.lastName = lastName;
    if (!user.socialLinks) {
      user.socialLinks = {};
    }
    if (website && website.trim()) user.socialLinks.website = website;
    if (x && x.trim()) user.socialLinks.x = x;
    if (instagram && instagram.trim()) user.socialLinks.instagram = instagram;
    if (linkedin && linkedin.trim()) user.socialLinks.linkedin = linkedin;
    if (facebook && facebook.trim()) user.socialLinks.facebook = facebook;
    await user.save();
    logger.info("User updated successfully:", user);
    res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(500).json({
      code: "SERVER_ERROR",
      message: "Internal Server Error",
      error: error,
    });
    logger.error("Failed to update current user:", error);
  }
};

export default updateCurrentUser;
