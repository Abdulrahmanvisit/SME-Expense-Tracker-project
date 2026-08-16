import Profile from "../models/Profile.js";
import asyncHandler from "../utils/asyncHandler.js";

const defaultProfile = {
  businessName: "SME Business",
  displayName: "Business Owner",
  accentColor: "#4f46e5",
  currency: "NGN",
};

export const getProfile = asyncHandler(async (req, res) => {
  let profile = await Profile.findOne();

  if (!profile) {
    profile = await Profile.create(defaultProfile);
  }

  res.status(200).json({ success: true, data: profile });
});

export const updateProfile = asyncHandler(async (req, res) => {
  let profile = await Profile.findOne();

  if (!profile) {
    profile = await Profile.create(defaultProfile);
  }

  Object.assign(profile, req.body);
  await profile.save();

  res.status(200).json({ success: true, data: profile });
});
