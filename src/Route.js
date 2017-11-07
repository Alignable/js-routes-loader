import querystring from 'querystring';

class Route {
  constructor(path, params, requiredParams, opts, methods) {
    this.path = Route.buildPath(path, params, requiredParams, opts);
    this.methods = (methods && methods.map(method => method.toUpperCase()));
  }

  static buildPath(pathSpec, params, requiredParams, opts) {
    const options = opts || {};

    // error check params agasint requiredParams
    let error;
    if (!(options instanceof Object)) {
      error = 'too many parameters';
    } else {
      params.forEach((param) => {
        if (typeof param === 'undefined' || param instanceof Object) {
          error = 'too few parameters';
        }
      });
    }
    if (error) {
      throw new Error(`Required Parameters mismatch - ${error}. Required parameters are [${requiredParams}] but received [${params}].`);
    }

    // replace the required params
    let path = pathSpec;
    requiredParams.forEach((p, i) => {
      path = path.replace(`:${p}`, params[i]);
    });

    // handle format and anchor
    const { anchor, format } = options;
    delete options.anchor;
    delete options.format;

    const formatReplace = typeof format !== 'undefined' ? `.${format}` : '';
    path = path.replace('(.:format)', formatReplace);

    // handle query string
    const query = querystring.stringify(options);
    if (query.length > 0) {
      path = `${path}?${query}`;
    }
    if (typeof anchor !== 'undefined') {
      path = `${path}#${encodeURIComponent(anchor)}`;
    }

    return path;
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
    return window.fetch(this.path, Object.assign({ method }, options));
  }
}

export default Route;
