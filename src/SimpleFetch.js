import FetchWrapper from './FetchWrapper';

class SimpleFetch extends FetchWrapper {
  fetch(options) {
    this.checkMethod(options.method);
    return fetch(this.path, options);
  }
}

export default (path, methods) => new SimpleFetch(path, methods);
