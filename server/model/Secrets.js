const mongoose = require('mongoose');
const _crypto = require('crypto');

const saltRounds = 10;

const SecretSchema = new mongoose.Schema({
	urlHash: { type: String, required: true, unique : true },
	message: { type: String, required: true },
	salt: { type: String, required: false },
	expTime: { type: Date, required: true }
});

SecretSchema.pre( 'save', function( next ) {
	if ( this.isNew ) { 
		const document = this;
		let masterkey = document.salt;

		const iv = _crypto.randomBytes(16);

		// random salt
		const salt = _crypto.randomBytes(64);

		// derive encryption key: 32 byte key length
		// in assumption the masterkey is a cryptographic and NOT a password there is no need for
		// a large number of iterations. It may can replaced by HKDF
		// the value of 2145 is randomly chosen!
		const key = _crypto.pbkdf2Sync(masterkey, salt, 2145, 32, 'sha512');

		// AES 256 GCM Mode
		const cipher = _crypto.createCipheriv('aes-256-gcm', key, iv);

		// encrypt the given text
		const encrypted = Buffer.concat([cipher.update(document.message, 'utf8'), cipher.final()]);

		// extract the auth tag
		const tag = cipher.getAuthTag();

		// generate output
		document.message = Buffer.concat([salt, iv, tag, encrypted]).toString('base64');
		next();
	} else {
		next();
	}
} );

SecretSchema.methods.decrypt = function( message, secret ) {
	// base64 decoding
  const bData = Buffer.from(message, 'base64');

  // convert data to buffers
  const salt = bData.slice(0, 64);
  const iv = bData.slice(64, 80);
  const tag = bData.slice(80, 96);
  const text = bData.slice(96);

  // derive key using; 32 byte key length
  const key = _crypto.pbkdf2Sync(secret, salt , 2145, 32, 'sha512');

  // AES 256 GCM Mode
  const decipher = _crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);

  // encrypt the given text
  const decrypted = decipher.update(text, 'binary', 'utf8') + decipher.final('utf8');
  
  return decrypted;
}

// UserSchema.pre('save', function(next) {
//   if (this.isNew || this.isModified('password')) {
//     const document = this;
//     bcrypt.hash(this.password, saltRounds, function(err, hashedPassword) {
//       if (err) {
//         next(err);
//       } else {
//         document.password = hashedPassword;
//         next();
//       }
//     });
//   } else {
//     next();
//   }
// });

// UserSchema.methods.isCorrectPassword = function(password, callback) {
//   bcrypt.compare(password, this.password, function(err, same) {
//     if (err) {
//       callback(err);
//     } else {
//       callback(err, same);
//     }
//   });
// }

module.exports = mongoose.model('Secrets', SecretSchema);