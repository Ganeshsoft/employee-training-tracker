angular.module('training.controllers').controller('trainingEmployeeController', ['$scope', '$routeParams', 'Utilities', 'Security', 'Employee', 'TrainingRecord', 'Competency', 'LOADING_16_IMAGE',
    function ($scope, $routeParams, Utilities, Security, Employee, TrainingRecord, Competency, LOADING_16_IMAGE) {

// ----------------------------
// Initialize Locals
// ----------------------------

    $scope.canEditTrainingRecord = Security.canEditTrainingRecord;
    $scope.loadingImage =  LOADING_16_IMAGE;
    $scope.invalidEmployee = false;
    $scope.trainingRecords = [];


// ----------------------------
// Initialize Data via Services
// ----------------------------

    function trainingRecordCompare(tr1, tr2) {
        var tr1Name = tr1.competency.name.toUpperCase(),
            tr2Name = tr2.competency.name.toUpperCase();

        if (tr1Name > tr2Name) {
            return 1;
        }
        if (tr1Name < tr2Name) {
            return -1;
        }
        return 0;
    }

    function loadScopeData() {
        if (!$routeParams.employeeId) {
            $scope.$emit('showError', {"title": "Error Retrieving Employee", "body": "Invalid URL", "info": "employee id = " + $routeParams.employeeId});
            return;
        }

        $scope.employee = Employee.getCachedValue($routeParams.employeeId);
        if (!$scope.employee) {
            $scope.invalidEmployee = true;
            return;
        }

        $scope.trainingRecords.loading = true;
        TrainingRecord.findByTraineeId($routeParams.employeeId).then(
            function (data) {
                $scope.trainingRecords = data;
                $scope.trainingRecords.sort(trainingRecordCompare);
                $scope.trainingRecords.loading = false;
            },
            function (data) {
                $scope.trainingRecords.loading = false;
                Utilities.showResourceError(data, {title: "Error Retrieving Training records", body: "Error retrieving training records"});
            });
    }

    $scope.initializationPromise.then(function () {
        loadScopeData();
    }, function (error) {
        $scope.loading = false;
    });


// ----------------------------
// Scope Listeners
// ----------------------------

    function insertRow(newTrainingRecord) {
        var i, existingRecord;
        for (i = 0; i < $scope.trainingRecords.length; i += 1) {
            existingRecord = $scope.trainingRecords[i];

            if (!existingRecord.id || trainingRecordCompare(existingRecord, newTrainingRecord) > 0) {
                $scope.trainingRecords.splice(i, 0, newTrainingRecord);
                return;
            }
        }
        $scope.trainingRecords.push(newTrainingRecord);
    }

    function deleteBlankTrainingRecordRow(competencyId) {
        var i, existingRecord;
        for (i = $scope.trainingRecords.length - 1; i >= 0; i-=1) {
            existingRecord = $scope.trainingRecords[i];

            if (existingRecord.id) {
                return;
            }

            if (existingRecord.competencyId === competencyId) {
                $scope.trainingRecords.splice(i, 1);
                return;
            }
        }
    }

    function deleteRow(deletedTrainingRecord) {
        var i, existingRecord;
        for (i = 0; i < $scope.trainingRecords.length; i += 1) {
            existingRecord = $scope.trainingRecords[i];

            if (!existingRecord.id) {
                return;
            }

            if (existingRecord.id === deletedTrainingRecord.id) {
                $scope.trainingRecords.splice(i, 1);
                return;
            }
        }
    }

    $scope.$on('trainingRecordCreated', function (event, message) {
        if (message && message.traineeId === $scope.employee.id) {
            insertRow(message);
            deleteBlankTrainingRecordRow(message.competencyId);
        }
    });

    $scope.$on('trainingRecordDeleted', function (event, message) {
        if (message && message.traineeId === $scope.employee.id) {
            deleteRow(message);
        }
    });


// ----------------------------
// Scope Actions
// ----------------------------

    $scope.onAddTrainingRecord = function () {
        var newTrainingRecord, lockedFields = ['trainee'];

        newTrainingRecord = {
            traineeId:  $scope.employee.id
        };

        $scope.$emit(
            'newTrainingRecord',
            {
                trainingRecord: newTrainingRecord,
                lockedFields: lockedFields
            });
    };

    function addBlankTrainingRecords() {
        var listedRecords = {},
            generalCompetencies = [];

        function addSingleBlankRecord(competency) {
            $scope.trainingRecords.push(
                new TrainingRecord({
                    traineeId: $scope.employee.id,
                    trainee: $scope.employee,
                    competencyId: competency.id,
                    competency: competency
                })
            );
        }

        if (!$scope.employee || !$scope.trainingRecords) {
            return;
        }

        angular.forEach($scope.trainingRecords, function (record) {
            listedRecords[record.competency.id] = true;
        });

        angular.forEach(Competency.values, function (competency) {
            if (!listedRecords[competency.id] && competency.department === null) {
                generalCompetencies.push(competency);
            } else if (!listedRecords[competency.id] && competency.department && competency.department.id === $scope.employee.departmentId) {
                addSingleBlankRecord(competency);
                listedRecords[competency.id] = true;
            }
        });

        angular.forEach(generalCompetencies, function (competency) {
            addSingleBlankRecord(competency);
            listedRecords[competency.id] = true;
        });
    }

    function removeBlankTrainingRecords() {
        var i, record;
        for (i = $scope.trainingRecords.length - 1; i >= 0; i-=1) {
            record = $scope.trainingRecords[i];
            if (!record.id) {
                $scope.trainingRecords.splice(i, 1);
            }
        }
    }

    $scope.onShowAvailableCompetencies = function () {
        addBlankTrainingRecords();
        $scope.showAvailableCompetencies = true;
    };

    $scope.onHideAvailableCompetencies = function () {
        removeBlankTrainingRecords();
        $scope.showAvailableCompetencies = false;
    };
}]);

