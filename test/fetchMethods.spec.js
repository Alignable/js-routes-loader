/* eslint-disable no-unused-expressions */
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import routes from './routes/fetchMethods.json';

chai.use(sinonChai);
const { expect } = chai;

describe('fetch methods', () => {
  let fetchSpy;

  beforeEach(() => {
    fetchSpy = sinon.spy();
    global.window = { fetch: fetchSpy };
  });

  describe('get', () => {
    it('calls fetch with GET method', () => {
      routes.getMe(12).get({ fizz: 'buzz' });
      expect(fetchSpy).to.have.been.calledWith('/get/12/me', { method: 'GET', fizz: 'buzz' });
    });

    it('supported if route provides no methods', () => {
      expect(() => routes.allMethods(12).get()).not.to.throw();
    });

    it('throws if called on route that does not support GET', () => {
      expect(() => routes.deleteMe(12).get()).to.throw();
      expect(fetchSpy).not.to.have.been.called;
    });
  });

  describe('post', () => {
    it('calls fetch with POST method', () => {
      routes.postMe(12).post({ fizz: 'buzz' });
      expect(fetchSpy).to.have.been.calledWith('/post/12/me', { method: 'POST', fizz: 'buzz' });
    });

    it('supported if route provides no methods', () => {
      expect(() => routes.allMethods(12).post()).not.to.throw();
    });

    it('throws if called on route that does not support POST', () => {
      expect(() => routes.getMe(12).post()).to.throw();
      expect(fetchSpy).not.to.have.been.called;
    });
  });

  describe('put', () => {
    it('calls fetch with PUT method', () => {
      routes.putMe(12).put({ fizz: 'buzz' });
      expect(fetchSpy).to.have.been.calledWith('/put/12/me', { method: 'PUT', fizz: 'buzz' });
    });

    it('supported if route provides no methods', () => {
      expect(() => routes.allMethods(12).put()).not.to.throw();
    });

    it('throws if called on route that does not support PUT', () => {
      expect(() => routes.getMe(12).put()).to.throw();
      expect(fetchSpy).not.to.have.been.called;
    });
  });

  describe('patch', () => {
    it('calls fetch with PATCH method', () => {
      routes.patchMe(12).patch({ fizz: 'buzz' });
      expect(fetchSpy).to.have.been.calledWith('/patch/12/me', { method: 'PATCH', fizz: 'buzz' });
    });

    it('supported if route provides no methods', () => {
      expect(() => routes.allMethods(12).patch()).not.to.throw();
    });

    it('throws if called on route that does not support PATCH', () => {
      expect(() => routes.getMe(12).patch()).to.throw();
      expect(fetchSpy).not.to.have.been.called;
    });
  });

  describe('delete', () => {
    it('calls fetch with DELETE method', () => {
      routes.deleteMe(12).delete({ fizz: 'buzz' });
      expect(fetchSpy).to.have.been.calledWith('/delete/12/me', { method: 'DELETE', fizz: 'buzz' });
    });

    it('supported if route provides no methods', () => {
      expect(() => routes.allMethods(12).delete()).not.to.throw();
    });

    it('throws if called on route that does not support DELETE', () => {
      expect(() => routes.getMe(12).delete()).to.throw();
      expect(fetchSpy).not.to.have.been.called;
    });
  });
});
