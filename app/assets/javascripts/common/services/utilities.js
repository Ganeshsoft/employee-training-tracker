angular.module('common.services').factory('Utilities', ['$rootScope', function ($rootScope) {
    var service = {};

    function getErrorMessage(error) {
        if (error.hasOwnProperty('message')) {
            return error.message;
        }

        return undefined;
    }

    function buildErrorMessage(data, status, config, defaultFields, timeout) {
        var message = {
            title: defaultFields.title || "Communication Error",
            body: [defaultFields.message || "There was an error communicating with the server"],
            details: [],
            showDetails: false,
            timeout: timeout
        };

        if (status) {
            message.details.push("Status: " + status);
        }

        if (config) {
            message.details.push((config.method || "") + " " + (config.url || ""));

            if (config.data) {
                message.details.push(JSON.stringify(config.data));
            }
        }

        if (data) {
            service.processErrors(data, message.body, message.details);
        }

        return message;
    }

    service.compareFactory = function (field) {
        return function (x, y) {
            if (x[field] > y[field]) {
                return 1;
            }
            if (x[field] < y[field]) {
                return -1;
            }
            return 0;
        };
    };

    service.multiCompareFactory = function (fieldArray) {
        return function (x, y) {
            var i, field;
            for (i = 0; i < fieldArray.length; i += 1) {
                field = fieldArray[i];
                if (x[field] > y[field]) {
                    return 1;
                }
                if (x[field] < y[field]) {
                    return -1;
                }
            }
            return 0;
        };
    };

    service.getLocalDate = function (obj) {
        var NUMBER_STRING = /^\d+$/,
            R_ISO8601_STR = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d{3}))?)?)?(Z|([+-])(\d\d):?(\d\d)))?$/,
            new_date = obj;

        function jsonStringToDateNoTime(string) {
            var match = string.match(R_ISO8601_STR);
            if (match) {
                return new Date(parseInt(match[1], 10), parseInt(match[2], 10) - 1, parseInt(match[3], 10));
            }
            return new Date();
        }

        if (!obj) {
            return obj;
        } else if (angular.isString(obj)) {
            if (NUMBER_STRING.test(obj)) {
                new_date = new Date(parseInt(new_date, 10));
            } else {
                new_date = jsonStringToDateNoTime(new_date);
            }
        } else if (angular.isNumber(obj)) {
            new_date = new Date(obj);
        } else if (angular.isDate(obj)) {
            new_date = new Date(obj.getFullYear(), obj.getMonth(), obj.getDate());
        } else {
            new_date = new Date();
        }

        new_date.setHours(0, 0, 0, 0);
        return new_date;
    };

    service.processErrors = function (data, message, errorDetails) {
        if (angular.isString(data)) {
            message.push(data);
        } else if (data instanceof Error) {
            message.push(data.message);
            errorDetails.push(data.stack);
        } else if (data.hasOwnProperty('error_data')) {
            errorDetails.push(data.error_data.type + ': ' + data.error_data.message);
            errorDetails.push(data.error_data.trace);
        } else if (data.hasOwnProperty('error')) {
            errorDetails.push(data.error);
        } else if (data.hasOwnProperty('errors')) {
            // handles normal server errors with expected data fields sent by
            // the ruby services and puts them in the body of the error
            angular.forEach(data.errors, function (value, key) {

                if (angular.isArray(value)) { //expecting array of error messages
                    angular.forEach(value, function (item_value) {
                        message.push(key + ": " + item_value);
                    });

                } else if (angular.isObject(value)) {
                    message.push(key + ": " + JSON.stringify(value));
                } else {
                    message.push(key + ": " + value);
                }

            });
        }
        else {
            errorDetails.push(JSON.stringify(data));
        }
    };

    service.showHttpError = function (data, status, config, defaultFields, timeout) {
        // make sure no progress is showing
        $rootScope.$emit('hideProgress');
        $rootScope.$emit('showError', buildErrorMessage(data, status, config, defaultFields, timeout));
    };

    service.showResourceError = function (data, defaultFields, timeout) {
        $rootScope.$emit('showError', buildErrorMessage(data.data, data.status, data.config, defaultFields, timeout));
    };

    service.showError = function (title, message, details, timeout) {
        $rootScope.$emit('showError', buildErrorMessage(details, null, null, {title: title || 'Error', message: message}, timeout));
    };

    return service;
}]);