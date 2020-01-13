"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCan = exports.authorize = exports.authorizeActionAgainstPolicy = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _permissions = require("./permissions");

var _utils = require("./utils");

/**
 * Credit - https://stackoverflow.com/questions/55240828
 *
 * @param userPermissions
 * @param actionPolicy
 * @param req
 * @returns {*|*|*}
 */
var authorizeActionAgainstPolicy = function authorizeActionAgainstPolicy(userPermissions, actionPolicy, req) {
  var callCount = 0;

  var authorize = function authorize(policy) {
    callCount += 1;
    var operators = {
      $or: 'some',
      $and: 'every'
    };
    var fns = {
      any: function any(permissions) {
        return (0, _permissions.hasAnyPermission)(userPermissions, permissions);
      },
      all: function all(permissions) {
        return (0, _permissions.hasAllPermissions)(userPermissions, permissions);
      }
    };
    if (typeof policy === 'string') return (0, _permissions.hasAllPermissions)(userPermissions, [policy]);

    if (typeof policy === 'function') {
      var result = policy(req);

      if (result instanceof Promise) {
        if (callCount > 1) {
          throw (0, _utils.createException)('Unexpected nested promise callback.');
        }
      } else {
        var resultType = (0, _typeof2["default"])(result);

        if (resultType !== 'boolean') {
          throw (0, _utils.createException)("Unexpected return type [".concat(resultType, "] from a callback."));
        }
      }

      return result;
    }

    if (!policy || (0, _typeof2["default"])(policy) !== 'object') return false;

    var _Object$entries$ = (0, _slicedToArray2["default"])(Object.entries(policy)[0], 2),
        key = _Object$entries$[0],
        value = _Object$entries$[1];

    if (key in operators) return value[operators[key]](authorize);
    if (key in fns) return fns[key](value);
    return false;
  };

  return authorize(actionPolicy);
};
/**
 * Authorize a user action on an entity based on the user permissions and
 * system policies. All occurrences of the callback rule are called with
 * the req object. This allows the user to authorize based on req
 * parameters.
 *
 * @param action
 * @param entity
 * @param userPermissions
 * @param policies
 * @param req
 * @returns {*}
 */


exports.authorizeActionAgainstPolicy = authorizeActionAgainstPolicy;

var authorize = function authorize(action, entity, userPermissions, policies) {
  var req = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  var policy = policies[entity];

  if (policy) {
    var actionPolicy = policy[action];

    if (actionPolicy) {
      try {
        return authorizeActionAgainstPolicy(userPermissions, actionPolicy, req);
      } catch (e) {
        // an exception is thrown when:
        // - a nested promise callback is encountered
        // - a callback returns a non-boolean value - does not apply to promise callbacks
        throw e;
      }
    }

    throw (0, _utils.createException)("The [".concat(entity, "] policy does not define action [").concat(action, "]."));
  }

  throw (0, _utils.createException)("The [".concat(entity, "] policy is not defined."));
};
/**
 * Create a 'can' function for your app based on system policies. The can function
 * is used to create authorization middleware for a specific action on a specific
 * entity. createCan expects the following arguments:
 *
 * - policies - the system policies definition.
 * - userPermissionsResolver - an handler that is triggered to get user permissions.
 * - unauthorizedRequestHandler - an handler that is triggered if the user is not
 *   authorized to make the request.
 * - authorizationExceptionHandler - an handler that is triggered if an exception
 *   occurs when trying to get user permissions, check authorization or when
 *   triggering unauthorizedRequestHandler.
 *
 * @param policies
 * @param userPermissionsResolver
 * @param unauthorizedRequestHandler
 * @param authorizationExceptionHandler
 * @returns {function(*=, *=): Function}
 */


exports.authorize = authorize;

var createCan = function createCan(policies, userPermissionsResolver, unauthorizedRequestHandler, authorizationExceptionHandler) {
  return function (action, entity) {
    return function _callee(req, res, next) {
      return _regenerator["default"].async(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.t0 = _regenerator["default"];
              _context.t1 = authorize;
              _context.t2 = action;
              _context.t3 = entity;
              _context.next = 7;
              return _regenerator["default"].awrap(userPermissionsResolver(req));

            case 7:
              _context.t4 = _context.sent;
              _context.t5 = policies;
              _context.t6 = req;
              _context.t7 = (0, _context.t1)(_context.t2, _context.t3, _context.t4, _context.t5, _context.t6);
              _context.next = 13;
              return _context.t0.awrap.call(_context.t0, _context.t7);

            case 13:
              _context.t8 = _context.sent;

              if (!(_context.t8 !== true)) {
                _context.next = 16;
                break;
              }

              return _context.abrupt("return", unauthorizedRequestHandler(req, res, next));

            case 16:
              return _context.abrupt("return", next());

            case 19:
              _context.prev = 19;
              _context.t9 = _context["catch"](0);
              return _context.abrupt("return", authorizationExceptionHandler(req, res, next, _context.t9));

            case 22:
            case "end":
              return _context.stop();
          }
        }
      }, null, null, [[0, 19]]);
    };
  };
};

exports.createCan = createCan;