const mongoose = require('mongoose')
const { v1: uuidv1 } =  require('uuid')
const crypto = require('crypto')

const { Schema } = mongoose

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, trim: true, unique: true, required: true, },
    phoneNumber: { type: String, required: true, }, 
    walletAddress: { type: String, required: true, },
    privateKey: { type: String, required: true, },
    hashed_password: { type: String, required: true, minlength: 4, maxlength: 128, },
    salt: { type: String, },
    isAdmin: { type: Boolean, required: true, default: false, },
    isVerified: { type: Boolean, default: false, },
    isEmailVerified: { type: Boolean, default: false, },
}, 
{
    timestamps: true,
})

// virtual field
userSchema
  .virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = uuidv1();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  // authenticate user method
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },
   
  encryptPassword: function (password) {
    if (!password) return '';
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (err) {
      return '';
    }
  },
}

module.exports = mongoose.model('Users', userSchema)