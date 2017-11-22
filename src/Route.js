import { buildPath } from './PathBuilder';

class Route {
  constructor(path, params, requiredParams, optionalParams, opts, methods, fetchWrapper) {
    this.path = buildPath(path, params, requiredParams, optionalParams, opts);
    this.methods = methods;
    this.fetchWrapper = fetchWrapper;
  }

  get(options) {
    return this.fetch('GET', options);
  }

  post(options) {
    return this.fetch('POST', options);
  }

  put(options) {
    return this.fetch('PUT', options);
  }

  patch(options) {
    return this.fetch('PATCH', options);
  }

  delete(options) {
    return this.fetch('DELETE', options);
  }

  fetch(method, options) {
    if (this.methods.length > 0 && !this.methods.includes(method)) {
      throw new Error(`Method '${method} is not supported. Supported methods are: [${this.methods}]`);
    }
    return this.fetchWrapper(this.path, Object.assign({method}, options));
  }
}

export default Route;
