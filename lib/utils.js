"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createException = void 0;

var createException = function createException(message) {
  return Error("[rbactl]: ".concat(message));
};

exports.createException = createException;