angular.module('common.services').factory('LocalSettings', ['$window', function ($window) {
    if (typeof($window.localStorage) !== "undefined") {
        return {
            getItem: function (key) {
                return $window.localStorage.getItem(key);
            },
            setItem: function (key, value) {
                $window.localStorage.setItem(key, value);
            }
        };
    } else {
        return undefined;
    }
}]);
