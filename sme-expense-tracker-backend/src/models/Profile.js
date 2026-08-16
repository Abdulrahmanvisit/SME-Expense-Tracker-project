import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      default: "SME Business",
      trim: true,
    },
    displayName: {
      type: String,
      default: "Business Owner",
      trim: true,
    },
    accentColor: {
      type: String,
      default: "#4f46e5",
      match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    },
    currency: {
      type: String,
      default: "NGN",
      uppercase: true,
    },
  },
  {
    timestamps: true,
  },
);

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
