/* Filters */

angular.module('common.filters', ['common.services']);


/**
 * Angular date filter and JQuery UI Datepicker use local timezone
 * So, since our dates are all UTC with 0:00:00 times, they appeared
 * to be on the day before.  So we can use this to convert dates to
 * local (browser) time before using them in the filter/datepicker.
 * Note: this shouldn't be used on proper timestamps
**/
angular.module('common.filters').
    filter('commonLocalDate', ['$filter', 'Utilities', function ($filter, Utilities) {

    return function (date, format) {
        return $filter('date')(Utilities.getLocalDate(date), format);
    };
}]);

angular.module('common.filters').
    filter('employeeName', function () {

    return function (employee) {
        if (angular.isObject(employee)) {
            return employee.firstName + ' ' + employee.lastName;
        }

        return employee;
    };
});
