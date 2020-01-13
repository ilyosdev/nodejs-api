"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "authorize", {
  enumerable: true,
  get: function get() {
    return _authorize.authorize;
  }
});
Object.defineProperty(exports, "createCan", {
  enumerable: true,
  get: function get() {
    return _authorize.createCan;
  }
});
Object.defineProperty(exports, "loadPolicies", {
  enumerable: true,
  get: function get() {
    return _policies.loadPolicies;
  }
});
Object.defineProperty(exports, "loadPermissions", {
  enumerable: true,
  get: function get() {
    return _permissions.loadPermissions;
  }
});
Object.defineProperty(exports, "parsePermissions", {
  enumerable: true,
  get: function get() {
    return _permissions.parsePermissions;
  }
});
Object.defineProperty(exports, "getPermissionsMap", {
  enumerable: true,
  get: function get() {
    return _permissions.getPermissionsMap;
  }
});
Object.defineProperty(exports, "validatePermissions", {
  enumerable: true,
  get: function get() {
    return _permissions.validatePermissions;
  }
});
Object.defineProperty(exports, "getAllPermissionsFor", {
  enumerable: true,
  get: function get() {
    return _permissions.getAllPermissionsFor;
  }
});

var _authorize = require("./authorize");

var _policies = require("./policies");

var _permissions = require("./permissions");