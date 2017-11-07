import { expect } from 'chai';
import routes, { errors } from './routes/lotsOfRoutes.json';

describe('complex routes', () => {
  it('has all the routes', () => {
    const expectedRoutes = [
      'starships',
      'newStarship',
      'editStarship',
      'starship',
      'starshipCrewMembers',
      'newStarshipCrewMember',
      'editStarshipCrewMember',
      'starshipCrewMember',
    ];

    expectedRoutes.forEach((route) => {
      expect(routes[route]).to.be.instanceof(Function);
    });
    expect(errors.length).to.equal(2);
    expect(errors[0].route.name).to.equal('missingpath');
    expect(errors[1].route.path).to.equal('/noName');
  });
});
