const bcrypt = require("bcrypt");
const crypto = require("crypto");
const encryptPassword = (password) => {
  const saltRound = 10;
  const salt = bcrypt.genSaltSync(saltRound);
  const hash = bcrypt.hashSync(password, salt);

  const encrypedPassword = `${salt}:${hash}`;
  return encrypedPassword;
};

const validatePassword = (password, passwordHash, salt) => {
  const hash = bcrypt.hashSync(password, salt);
  if (hash === passwordHash) {
    return true;
  } else {
    return false;
  }
};

var obj = {
  username:"Viraj.D.Parmar",
  email:"vdparmar4177@gmail.com",
  phoneno:"+917228854182",
  password:"Parmar"
}
const data = JSON.stringify(obj);
console.log("raw data:", data);

const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: "pkcs1",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs1",
    format: "pem",
    cipher: "aes-256-cbc",
    passphrase: "",
  },
});
console.log("publicKey: ", JSON.stringify(publicKey));
console.log("privateKey: ", JSON.stringify(privateKey));

const encryptedData = crypto.publicEncrypt(
  {
    key: publicKey,
    oaepHash: "sha256",
  },
  Buffer.from(data)
);
console.log(
  "encypted data: ",
  encodeURIComponent(encryptedData.toString("base64"))
);
//const encryptData = Buffer.from(encryptedData.toString("base64"), "base64");
const decryptRequestData = (encryptedData) => {
  const decrypt = crypto.privateDecrypt(
    {
      key: privateKey,
      passphrase: "",
      oaepHash: "sha256",
    },
    Buffer.from(decodeURIComponent(encryptedData), "base64")
  );
  console.log("decrypt", decrypt);
  return JSON.parse(decrypt);
};
//console.log("end:", JSON.parse(decryptRequestData(encryptedData).toString()));
module.exports = {
  encryptPassword,
  validatePassword,
  decryptRequestData,
};
