import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser {
  firstName?: string;
  lastName?: string;
  username: string;
  email: string;
  password: string;
  role: "admin" | "user";
  socialLinks?: {
    website?: string;
    facebook?: string;
    x?: string;
    instagram?: string;
    linkedin?: string;
  };
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      maxlength: [20, "Username can not be more than 20 characters"],
      unique: [true, "Username already exists"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already exists"],
      maxlength: [100, "Email can not be more than 100 characters"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: { values: ["admin", "user"], message: "Invalid role" },
      default: "user",
    },
    firstName: {
      type: String,
      maxlength: [20, "First name can not be more than 20 characters"],
    },
    lastName: {
      type: String,
      maxlength: [20, "Last name can not be more than 20 characters"],
    },
    socialLinks: {
      website: {
        type: String,
        maxlength: [100, "Website address can not be more than 100 characters"],
      },
      facebook: {
        type: String,
        maxlength: [
          100,
          "Facebook profile URL can not be more than 100 characters",
        ],
      },
      x: {
        type: String,
        maxlength: [100, "X profile URL can not be more than 100 characters"],
      },
      instagram: {
        type: String,
        maxlength: [
          100,
          "Instagram profile URL can not be more than 100 characters",
        ],
      },
      linkedin: {
        type: String,
        maxlength: [
          100,
          "LinkedIn profile URL can not be more than 100 characters",
        ],
      },
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
    return;
  }
  // Hash Password
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default model<IUser>("User", userSchema);
