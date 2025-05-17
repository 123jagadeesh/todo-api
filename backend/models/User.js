const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId; // Password only required if not using Google auth
    }
  },
  googleId: {
    type: String,
    sparse: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add method to check if user is Google authenticated
userSchema.methods.isGoogleUser = function() {
  return !!this.googleId;
};

const User = mongoose.model('User', userSchema);

module.exports = User;