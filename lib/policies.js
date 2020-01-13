"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadPolicies = void 0;

var _requireAll = _interopRequireDefault(require("require-all"));

/**
 * Loads the policies defined on the specified path. When loading, the policy
 * objects are added to an object.
 *
 * @param pathName
 */
var loadPolicies = function loadPolicies(pathName) {
  var policies = {};
  var policiesObj = (0, _requireAll["default"])(pathName);
  Object.keys(policiesObj).forEach(function (policy) {
    policies[policy] = policiesObj[policy]["default"] ? policiesObj[policy]["default"] : policiesObj[policy];
  });
  return policies;
};

exports.loadPolicies = loadPolicies;