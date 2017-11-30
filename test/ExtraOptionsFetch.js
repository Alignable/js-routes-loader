import FetchWrapper from '../src/FetchWrapper';

class ExtraOptionsFetch extends FetchWrapper {
  get(options) {
    return this.fetch('GET', options);
  }

  post(options) {
    return this.fetch('POST', options);
  }

  patch(options) {
    return this.fetch('PATCH', options);
  }

  put(options) {
    return this.fetch('PUT', options);
  }

  delete(options) {
    return this.fetch('DELETE', options);
  }

  fetch(method, options) {
    this.checkMethod(method);
    return fetch(this.path, Object.assign({ method, foo: 'bar' }, options));
  }
}

export default (path, methods) => new ExtraOptionsFetch(path, methods);
