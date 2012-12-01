describe("js.common.filters", function () {
    'use strict';

    beforeEach(module('common.filters'));

    describe('commonLocalDate', function() {
        it('should convert a GMT timestamp to a timestamp with the local date',
            inject(function(commonLocalDateFilter) {
                expect(commonLocalDateFilter('2011-04-21T00:00:00.000Z')).toBe('Apr 21, 2011');
            }));
    });

});