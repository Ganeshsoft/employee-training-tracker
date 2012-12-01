/* Filters */

angular.module('training.filters', ['common.services.users']);

angular.module('training.filters').filter('employeeIdName', ['Employee', function (Employee) {
    return function (employeeId) {
        var employee = Employee.getCachedValue(employeeId);

        if (employee) {
            return employee.firstName + ' ' + employee.lastName;
        } else {
            return '';
        }
    }
}]);
