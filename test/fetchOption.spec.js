/* eslint-disable import/no-unresolved,import/no-webpack-loader-syntax */
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import routes from '!!js-routes-loader?fetch=../test/extraWrapper!./routes/fetchMethods.json';

chai.use(sinonChai);
const { expect } = chai;

describe('fetch wrapper', () => {
  let fetchSpy;

  beforeEach(() => {
    fetchSpy = sinon.spy();
    global.fetch = fetchSpy;
  });

  describe('get', () => {
    it('calls fetch with GET method and extra params', () => {
      routes.getMe(12).get({ fizz: 'buzz' });
      expect(fetchSpy).to.have.been.calledWith('/get/12/me', { method: 'GET', fizz: 'buzz', foo: 'bar' });
    });
  });

  describe('post', () => {
    it('calls fetch with POST method and extra params', () => {
      routes.postMe(12).post({ fizz: 'buzz' });
      expect(fetchSpy).to.have.been.calledWith('/post/12/me', { method: 'POST', fizz: 'buzz', foo: 'bar' });
    });
  });

  describe('put', () => {
    it('calls fetch with PUT method and extra params', () => {
      routes.putMe(12).put({ fizz: 'buzz' });
      expect(fetchSpy).to.have.been.calledWith('/put/12/me', { method: 'PUT', fizz: 'buzz', foo: 'bar' });
    });
  });

  describe('patch', () => {
    it('calls fetch with PATCH method and extra params', () => {
      routes.patchMe(12).patch({ fizz: 'buzz' });
      expect(fetchSpy).to.have.been.calledWith('/patch/12/me', { method: 'PATCH', fizz: 'buzz', foo: 'bar' });
    });
  });

  describe('delete', () => {
    it('calls fetch with DELETE method and extra params', () => {
      routes.deleteMe(12).delete({ fizz: 'buzz' });
      expect(fetchSpy).to.have.been.calledWith('/delete/12/me', { method: 'DELETE', fizz: 'buzz', foo: 'bar' });
    });
  });
});
