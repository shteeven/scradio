'use strict';

describe('Hosts E2E Tests:', function () {
  describe('Test hosts page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/hosts');
      expect(element.all(by.repeater('host in hosts')).count()).toEqual(0);
    });
  });
});
