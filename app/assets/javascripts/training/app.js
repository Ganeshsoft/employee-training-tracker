
// Declare app level module which depends on filters, and services
angular.module('training', ['training.assets', 'training.services', 'training.controllers', 'training.filters', 'training.directives', 'common.assets', 'common.services', 'common.filters', 'common.directives', 'ui']);

//Configure app routing
angular.module('training').config(['$routeProvider', '$locationProvider', 'HOME_TEMPLATE', 'COMPETENCY_TEMPLATE', 'EMPLOYEE_TEMPLATE', function($routeProvider, $locationProvider, HOME_TEMPLATE, COMPETENCY_TEMPLATE, EMPLOYEE_TEMPLATE) {
    $locationProvider.html5Mode(true);
    $routeProvider.when('/', {templateUrl: HOME_TEMPLATE, controller: 'trainingHomeController'});
    $routeProvider.when('/competencies/:competencyId', {templateUrl: COMPETENCY_TEMPLATE, controller: 'trainingCompetencyController'});
    $routeProvider.when('/employees/:employeeId', {templateUrl: EMPLOYEE_TEMPLATE, controller: 'trainingEmployeeController'});
    $routeProvider.otherwise({redirectTo: '/'});
}]);

angular.module('training').value('ui.config', {jq: {tooltip: {placement: 'right'}}});
