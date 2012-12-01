/* Services */

var trainingServices = angular.module('training.services', ['common.services', 'rails']);


trainingServices.factory('Competency', ['cachingRailsResourceFactory', 'Utilities', function (cachingRailsResourceFactory, Utilities) {
    var resource = cachingRailsResourceFactory({url: '/service/competencies', name: 'competency', pluralName: 'competencies'});
    resource.sort = function (elements) {
        elements.sort(Utilities.compareFactory('name'));
    };
    return resource;
}]);

trainingServices.factory('CompetencyCategory', ['cachingRailsResourceFactory', 'Utilities', function (cachingRailsResourceFactory, Utilities) {
    var resource = cachingRailsResourceFactory({url: '/service/competency_categories', name: 'competencyCategory', pluralName: 'competencyCategories'});
    resource.sort = function (elements) {
        elements.sort(Utilities.compareFactory('name'));
    };

    return resource;
}]);


trainingServices.factory('Department', ['cachingRailsResourceFactory', 'Utilities', function (cachingRailsResourceFactory, Utilities) {
    var resource = cachingRailsResourceFactory({url: '/service/departments', name: 'department'});
    resource.sort = function (elements) {
        elements.sort(Utilities.compareFactory('name'));
    };
    return resource;
}]);

trainingServices.factory('TrainingRecord', ['railsResourceFactory', function (railsResourceFactory) {
    var resource = railsResourceFactory({url: '/service/training_records', name: 'trainingRecord'});

    resource.findByCompetencyId = function (competencyId) {
        return resource.query({competency_id: competencyId});
    };

    resource.findByTraineeId = function (employeeId) {
        return resource.query({trainee_id: employeeId});
    };

    return resource;
}]);


// ----------------------------
// Utilities and Local
// ----------------------------

trainingServices.
    factory('Security', ['$window', function ($window) {
    return {
        canEditTrainingRecord: true,
        canEditCompetency: true
    };
}]);

