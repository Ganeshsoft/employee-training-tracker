angular.module('training.controllers').controller('trainingController', ['$scope', 'Utilities','Competency', 'CompetencyCategory', 'Department', 'Employee', '$q', 'LOADING_32_IMAGE',
    function ($scope, Utilities, Competency, CompetencyCategory, Department, Employee, $q, LOADING_32_IMAGE) {
    var promises = [];

    $scope.competencyProcedureTypes = [];

    $scope.dateOptions = {
        changeMonth: true,
        changeYear: true,
        showButtonPanel: true
    };

    promises.push($scope.competencies = Competency.load());
    promises.push($scope.competencyCategories = CompetencyCategory.load());
    promises.push($scope.departments = Department.load());
    promises.push($scope.employees = Employee.load());

    $scope.loadingImage = LOADING_32_IMAGE;
    $scope.loading = true;

    $scope.initializationPromise = $q.all(promises).then(function (data) {

        angular.forEach(Competency.values, function (competency) {
            if ($scope.competencyProcedureTypes.indexOf(competency.procedureType) < 0) {
                $scope.competencyProcedureTypes.push(competency.procedureType);
            }
        });
        $scope.loading = false;
    }, function (error) {
        Utilities.showResourceError(error, {title: "Error", body: "An error occurred initializing the UI."});
    });
}]);
