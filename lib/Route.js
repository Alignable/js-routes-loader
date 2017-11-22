'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _PathBuilder = require('./PathBuilder');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Route = function () {
  function Route(path, params, requiredParams, optionalParams, opts, methods, fetchWrapper) {
    _classCallCheck(this, Route);

    this.path = (0, _PathBuilder.buildPath)(path, params, requiredParams, optionalParams, opts);
    this.methods = methods;
    this.fetchWrapper = fetchWrapper;
  }

  _createClass(Route, [{
    key: 'get',
    value: function get(options) {
      return this.fetch('GET', options);
    }
  }, {
    key: 'post',
    value: function post(options) {
      return this.fetch('POST', options);
    }
  }, {
    key: 'put',
    value: function put(options) {
      return this.fetch('PUT', options);
    }
  }, {
    key: 'patch',
    value: function patch(options) {
      return this.fetch('PATCH', options);
    }
  }, {
    key: 'delete',
    value: function _delete(options) {
      return this.fetch('DELETE', options);
    }
  }, {
    key: 'fetch',
    value: function fetch(method, options) {
      if (this.methods.length > 0 && !this.methods.includes(method)) {
        throw new Error('Method \'' + method + ' is not supported. Supported methods are: [' + this.methods + ']');
      }
      return this.fetchWrapper(this.path, Object.assign({ method: method }, options));
    }
  }]);

  return Route;
}();

exports.default = Route;
module.exports = exports['default'];
//# sourceMappingURL=Route.js.map