angular.module('common.services.users').factory('Employee', ['cachingRailsResourceFactory', 'Utilities', '$http', function (cachingRailsResourceFactory, Utilities, $http) {
    var resource = cachingRailsResourceFactory({url: '/service/employees', name: 'employee'});

    resource.TIME_CLOCK_ID_LENGTH = 2;

    resource.findByTimeClockId = function (timeClockId) {
        return resource.processResponse($http.get(resource.url, resource.getHttpConfig({time_clock_id: timeClockId}))).then(function (result) {
            if (angular.isArray(result)) {
                if (result.length === 1) {
                    return result[0];
                } else {
                    return null;
                }
            }

            return result;
        });
    };

    resource.sort = function (elements) {
        elements.sort(Utilities.compareFactory('lastName'));
    };

    return resource;
}]);
