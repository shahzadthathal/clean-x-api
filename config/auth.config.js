module.exports = {
  secret: process.env.JWAT_SECRET || "jwt-secret-key-clean-x",
  jwatExpiresIn: 86400,
};