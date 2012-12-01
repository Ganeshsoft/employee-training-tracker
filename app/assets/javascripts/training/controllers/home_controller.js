angular.module('training.controllers').controller('trainingHomeController', ['$scope', '$location', 'Utilities', 'Competency', function ($scope, $location, Utilities, Competency) {

// ----------------------------
// Initialize Locals
// ----------------------------
    $scope.dateOptions = {
        changeMonth: true,
        changeYear: true,
        showButtonPanel: true
    };

    function initFilters() {
        $scope.inputDepartment = undefined;
        $scope.inputCompetencyProcedureType = undefined;
        $scope.inputCompetencyCategory = undefined;
        $scope.inputCompetencyName = undefined;
        $scope.inputPublishedAfter = undefined;
        $scope.competencySearchResults = undefined;
    }

    $scope.inputEmployeeId = undefined;
    $scope.inputCompetencyId = undefined;
    initFilters();

    function isSubstringCaseInsensitive(inString, inSubstring) {
        return inString.toUpperCase().indexOf(inSubstring.toUpperCase()) !== -1;
    }

    function setResults() {
        var comparisonDate;

        $scope.results = [];
        comparisonDate = $scope.inputPublishedAfter ? Utilities.getLocalDate($scope.inputPublishedAfter) : null;

        angular.forEach(Competency.values, function (competency) {
            if ($scope.inputCompetencyName && !isSubstringCaseInsensitive(competency.name, $scope.inputCompetencyName)) {
                return;
            }
            if ($scope.inputDepartment && (!competency.department || $scope.inputDepartment.id !== competency.department.id)) {
                return;
            }
            if ($scope.inputCompetencyCategory && $scope.inputCompetencyCategory.id !== competency.competencyCategory.id) {
                return;
            }
            if ($scope.inputCompetencyProcedureType && $scope.inputCompetencyProcedureType !== competency.procedureType) {
                return;
            }
            if (comparisonDate && comparisonDate > Utilities.getLocalDate(competency.publishedOn)) {
                return;
            }
            $scope.results.push(competency);
        });
    }

    $scope.initializationPromise.then(function () {
        setResults();
    }, function (error) {
        $scope.loading = false;
    });

// ----------------------------
// Initialize Data via Services
// ----------------------------

    //none

// ----------------------------
// Scope Listeners
// ----------------------------

    $scope.$watch('inputCompetencyName', function () {
        setResults();
    });

    $scope.$watch('inputDepartment', function () {
        setResults();
    });

    $scope.$watch('inputCompetencyCategory', function () {
        setResults();
    });

    $scope.$watch('inputCompetencyProcedureType', function () {
        setResults();
    });

    $scope.$watch('inputPublishedAfter', function () {
        setResults();
    });

    function redirectToSingleCompetency(id) {
        $location.path('competencies/' + id);
    }

    $scope.$watch('inputCompetencyId', function () {
        if ($scope.inputCompetencyId) {
            redirectToSingleCompetency($scope.inputCompetencyId);
        }
    });

    $scope.$watch('inputEmployeeId', function () {
        if ($scope.inputEmployeeId) {
            $location.path('employees/' + $scope.inputEmployeeId);
        }
    });


// ----------------------------
// Scope Actions
// ----------------------------

    $scope.onResetFilter = function (field) {
        $scope[field] = undefined;
    };
}]);

