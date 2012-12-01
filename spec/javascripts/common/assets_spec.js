describe("js.common.assets", function () {
    'use strict';

    it('should be loaded', function() {
        expect(angular.module('common.assets')).toBeDefined();
        expect(angular.module('common.assets').toString()).toBe('[object Object]');
    });

});