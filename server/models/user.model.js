import mongoose from "mongoose";
import crypto from "crypto"; // Node module used to encrypt the user-provided password string into  a
// hashed_password with a randomy generated salt value.

// The mongoose.Schema() function takes a schema definition object as a parameter to generate
// a new Mongoose schema object that can be used in the rest of the backend code.
const UserSchema = new mongoose.Schema({
  /* declare all the user data fields and associated properties */

  name: {
    type: String,
    trim: true,
    required: "Name is required!",
  },

  email: {
    type: String,
    trim: true,
    // must be unique in the user collection
    unique: "Email already exists",
    // match a valid email format
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
    required: "Email is required",
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: Date,

  // the actual password string is not stored directly in the database for security purposes and
  // is handled seperatley

  /* Both the hashed_password and salt values are required in order to match 
    and authenticate a password string provided during user sign-in, using the authenticate 
    method defined previously */

  hashedPassword: {
    type: String,
    required: "Password is required",
  },
  salt: String,
});

// the password string provided by the user is not stored directly in the user
// doucment. Instead, it is handled as 'virtual' field.

UserSchema.virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptedPassword(password);
    // when the password value is received on user creation or update
    // it is encrypted into a new hashed value and set to the hashed_password filed, along
    // with the salt value in the salt field
  })
  .get(function () {
    return this._password;
  });

// the encrytion logic and salt generattion logic, which are used to genearate the hashed_password and salt values representiong the
// password value, are defined as UserSchema methods

UserSchema.methods = {
  authenticate: function (plainText) {
    return String(this.encryptedPassword(plainText)) === this.hashedPassword;
  },

  encryptedPassword: function (password) {
    if (!password) return "";
    try {
      return crypto.createHmac("sha", this.salt).update(password).digest("hex");
    } catch (error) {
      return error;
    }
  },

  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  },
};

UserSchema.path("hashedPassword").validate(function (v) {
  if (this._password && this.password.length < 6) {
    this.invalidate("password", "Password must be at least 6 characters.");
  }
  // When new user is created for existing password is updated, custom  validation is added to check
  // the password value before Mongoose attempts to store the 'hashedPassword'
  if (this.isNew && !this._password) {
    this.invalidate("password", "Password is required");
  }
}, null);

// export the schema in order to use it in other parts of the backend code.
export default mongoose.model("User", UserSchema);
