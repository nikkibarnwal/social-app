import mongoose from "mongoose";
import { USER_COLLECTION } from "../../config/collection.js";
import bcrypt from "bcrypt";

/**
// Test cases
"Aa1@abc" // ✅ true (Valid)
"A1@xyz"  // ✅ true (Valid)
"abc123"  // ❌ false (No uppercase, no special character)
"ABC123@" // ❌ false (No lowercase)
"a1@B"    // ❌ false (Less than 6 characters)
"Aa1@abcdefghij"// ❌ false (More than 12 characters)
"Aa1+xyz" // ❌ false (Invalid special character `+`)

 */

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minLenght: [3, "Name minimum 3 characters"],
      maxLength: [25, "Name can't be greater than 25 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/.+\@.+\..+/, "Please enter valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLenght: [6, "Password minimum 6 characters"],
      maxLenght: [12, "Password maximum 12 characters"],
      // custom validation
      validate: {
        validator: function (v) {
          return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$&*])[A-Za-z\d@#$&*]{6,12}$/.test(
            v
          );
        },
        message: (props) =>
          `${props.value} is not a valid password. Password must contain 6 to 12 character, at least one uppercase letter, one lowercase letter, one number, one special character @#$&*.`,
      },
    },
    avtar: {
      type: String,
      required: false,
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: {
        values: ["M", "F"], //M - male, F - female,
        message: "Gender must be one of: F, M",
      },
    },
    loginToken: [{ type: String }],
  },
  { timestamps: true }
);

// here we are encrypting the password before saving to the collection
userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (err) {
      next(err);
    }
  } else {
    return next();
  }
});
const User = mongoose.model(USER_COLLECTION, userSchema);

export default User;
