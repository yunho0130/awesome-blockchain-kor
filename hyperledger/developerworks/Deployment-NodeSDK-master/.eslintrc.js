module.exports = {
  "env": {
    "es6": true,
    "node": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 2017,
    "sourceType": "module"
  },
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "semi": [
      "error",
      "always"
    ],
    "no-console" : "off",
    "guard-for-in": 0,
    "prefer-promise-reject-errors": 2,
    "no-invalid-this": 0,
  },
  "globals": {
    "jasmine": true
  }
};
