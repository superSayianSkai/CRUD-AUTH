const { hash, compare } = require("bcryptjs");
const { createHmac } = require("crypto");

exports.doHash = async (value, saltValue) => {
  const result = await hash(value, saltValue);
  return result;
};

exports.comparePassword = async (password, hashedPassword) => {
  const isMatch = await compare(password, hashedPassword);
  return isMatch;
};

exports.HmacProcess = (value, key) => {
  const result = createHmac("sha256", key).update(value).digest("hex");
  return result;
};
