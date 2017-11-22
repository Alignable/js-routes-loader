const fetchWrapper = (path, options) => fetch(path, Object.assign({ foo: 'bar' }, options));

export default fetchWrapper;
