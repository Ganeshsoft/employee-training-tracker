describe("js.common.services", function () {
    'use strict';

    beforeEach(module('rails'));
    beforeEach(module('common.services'));

    describe('cachingRailsResourceFactory', function () {
        var $httpBackend, $rootScope, factory, Test,
            config = {
                url: '/test',
                name: 'test'
            };

        beforeEach(inject(function (_$httpBackend_, _$rootScope_, cachingRailsResourceFactory) {
            $httpBackend = _$httpBackend_;
            $rootScope = _$rootScope_;
            factory = cachingRailsResourceFactory;
            Test = cachingRailsResourceFactory(config);
        }));

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('query should return resource object when response is single object', inject(function($httpBackend) {
            var promise, result;

            $httpBackend.expectGET('/test').respond(200, {test: {abc: 'xyz'}});

            expect(promise = Test.query()).toBeDefined();

            promise.then(function (response) {
                result = response;
            });

            $httpBackend.flush();

            expect(result).toBeInstanceOf(Test);
            expect(result).toEqualData({abc: 'xyz'});
        }));

        it('load should return array of values', inject(function($httpBackend) {
            var promise, result;

            $httpBackend.expectGET('/test').respond(200, {test: [{id: 123, abc: 'xyz'}, {id: 124, xyz: 'abc'}]});

            expect(promise = Test.load()).toBeDefined();

            promise.then(function (response) {
                result = response;
            });

            $httpBackend.flush();

            expect(angular.isArray(result)).toBe(true);
            expect(result[0]).toEqualData({id: 123, abc: 'xyz'});
            expect(result[1]).toEqualData({id: 124, xyz: 'abc'});
        }));

        it('load should sort values', inject(function($httpBackend, Utilities) {
            var promise, result;

            $httpBackend.expectGET('/test').respond(200, {test: [{id: 123, name: 'xyz'}, {id: 124, name: 'abc'}]});

            Test.sort = function (elements) {
                elements.sort(Utilities.compareFactory('name'));
            };

            expect(promise = Test.load()).toBeDefined();

            promise.then(function (response) {
                result = response;
            });

            $httpBackend.flush();

            Test.sort = null;

            expect(angular.isArray(result)).toBe(true);
            expect(result[0]).toEqualData({id: 124, name: 'abc'});
            expect(result[1]).toEqualData({id: 123, name: 'xyz'});
        }));

        it('get after load should hit cache', inject(function($httpBackend) {
            var promise, result;

            $httpBackend.expectGET('/test').respond(200, {test: [{id: 123, abc: 'xyz'}, {id: 124, xyz: 'abc'}]});
            Test.load();
            $httpBackend.flush();

            Test.get(123).then(function (value) {
                result = value;
            });

            $rootScope.$digest(); // make sure promises are resolved
            expect(result).toEqualData({id: 123, abc: 'xyz'});
        }));

        it('get should query on cache miss', inject(function($httpBackend) {
            var promise, result;

            $httpBackend.expectGET('/test').respond(200, {test: [{id: 123, abc: 'xyz'}, {id: 124, xyz: 'abc'}]});
            Test.load();
            $httpBackend.flush();

            $httpBackend.expectGET('/test/125').respond(200, {test: {id: 125, abc: 'xyz'}});

            Test.get(125).then(function (value) {
                result = value;
            });

            $httpBackend.flush();
            expect(result).toEqualData({id: 125, abc: 'xyz'});

            Test.get(125); // should not execute an extra get
        }));
    });


});
