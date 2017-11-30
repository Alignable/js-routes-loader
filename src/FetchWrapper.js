import { checkMethod } from './PathBuilder';

class FetchWrapper {
  constructor(path, methods) {
    this.path = path;
    this.methods = methods;
  }

  checkMethod(method) {
    checkMethod(method, this.methods);
  }
}

export default FetchWrapper;
