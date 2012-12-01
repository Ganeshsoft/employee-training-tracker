angular.module('training.controllers').controller('trainingCompetencyController', ['$scope', '$routeParams', 'Utilities', 'Security', 'Competency', 'TrainingRecord', 'LOADING_16_IMAGE',
    function ($scope, $routeParams, Utilities, Security, Competency, TrainingRecord, LOADING_16_IMAGE) {

// ----------------------------
// Initialize Locals
// ----------------------------

    $scope.editingPublishDate = false;
    $scope.invalidCompetency = false;
    $scope.trainingRecords = [];
    $scope.canEditTrainingRecord = Security.canEditTrainingRecord;
    $scope.batchTrainingRecords = {};
    $scope.batchTrainees = {};
    $scope.loadingImage = LOADING_16_IMAGE;


// ----------------------------
// Initialize Data via Services
// ----------------------------

    $scope.canEditPublishedOn = function() {
        return Security.canEditCompetency && !$scope.editingPublishDate;
    };

    function trainingRecordCompare(tr1, tr2) {
        var tr1LastName = tr1.trainee.lastName.toUpperCase(),
            tr2LastName = tr2.trainee.lastName.toUpperCase();

        if (tr1LastName > tr2LastName) {
            return 1;
        }
        if (tr1LastName < tr2LastName) {
            return -1;
        }
        return 0;
    }

    function loadScopeData() {
        if (!$routeParams.competencyId) {
            $scope.$emit('showError', {title: "Error Retrieving Competency", body: "Invalid URL", info: "competency id = " + $routeParams.competencyId});
            return;
        }

        $scope.competency = Competency.getCachedValue($routeParams.competencyId);

        if (!$scope.competency) {
            $scope.invalidCompetency = true;
            return;
        }

        $scope.trainingRecords.loading = true;

        TrainingRecord.findByCompetencyId($routeParams.competencyId).then(
            function (data) {
                $scope.trainingRecords = data;
                $scope.trainingRecords.sort(trainingRecordCompare);
                $scope.trainingRecords.loading = false;
            },
            function (data) {
                $scope.trainingRecords.loading = false;
                Utilities.showResourceError(data, {title: "Error Retrieving Training Records", body: "Error retrieving training records"});
            });
    }

    $scope.initializationPromise.then(function () {
        $scope.loading = false;
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
            if (trainingRecordCompare(existingRecord, newTrainingRecord) > 0) {
                $scope.trainingRecords.splice(i, 0, newTrainingRecord);
                return;
            }
        }
        $scope.trainingRecords.push(newTrainingRecord);
    }

    function deleteRow(deletedTrainingRecord) {
        var i, existingRecord;
        for (i = 0; i < $scope.trainingRecords.length; i += 1) {
            existingRecord = $scope.trainingRecords[i];
            if (existingRecord.id === deletedTrainingRecord.id) {
                $scope.trainingRecords.splice(i, 1);
                return;
            }
        }
    }

    $scope.$on('trainingRecordCreated', function (event, message) {
        if (message && message.competencyId === $scope.competency.id) {
            insertRow(message);
        }
    });

    $scope.$on('trainingRecordDeleted', function (event, message) {
        if (message && message.competencyId === $scope.competency.id) {
            deleteRow(message);
        }
    });

    function allSelected() {
        var i, record;
        for (i = 0; i < $scope.trainingRecords.length; i += 1) {
            record = $scope.trainingRecords[i];
            if (!record.selected) {
                return false;
            }
        }
        return true;
    }

    $scope.noneSelected = function () {
        var i, record;
        for (i = 0; i < $scope.trainingRecords.length; i += 1) {
            record = $scope.trainingRecords[i];
            if (record.selected) {
                return false;
            }
        }
        return true;
    };

    $scope.$on('trainingRecordSelectionChanged', function (event, message) {
        if (message.selected) {
            $scope.selectAllCheckbox = allSelected();
        } else {
            $scope.selectAllCheckbox = false;
        }
    });

    function recordInEditMode() {
        var i, record;
        for (i = 0; i < $scope.trainingRecords.length; i += 1) {
            record = $scope.trainingRecords[i];
            if (record.editMode) {
                return true;
            }
        }
        return false;
    }

    $scope.$on('trainingRecordEditModeChanged', function (event, message) {
        if (message.editMode) {
            $scope.disableBatchUpdate = true;
        } else {
            $scope.disableBatchUpdate = recordInEditMode();
        }
    });

// ----------------------------
// Scope Actions
// ----------------------------

    $scope.onEditPublishDate = function () {
        $scope.inputPublishedOn = Utilities.getLocalDate($scope.competency.publishedOn);
        $scope.editingPublishDate = true;
    };

    function updateCompetencyPublishedOn() {
        new Competency({id: $scope.competency.id, publishedOn: $scope.competency.publishedOn}).update().then(
            function (data) {
                // update doesn't return anything
            },
            function (data) {
                Utilities.showResourceError(data, {title: "Error Saving Competency", body: "Error saving competency"});
            });
    }

    $scope.onSavePublishDate = function () {
        $scope.competency.publishedOn = $scope.inputPublishedOn.toJSON();
        updateCompetencyPublishedOn();
        $scope.editingPublishDate = false;
    };

    $scope.onCancelPublishDate = function () {
        $scope.editingPublishDate = false;
    };

    $scope.onAddTrainingRecord = function () {
        var newTrainingRecord = {
            competencyId:  $scope.competency.id
        };

        $scope.$emit(
            'newTrainingRecord',
            {
                trainingRecord: newTrainingRecord,
                lockedFields: ['competency']
            });
    };


    function unselectAll() {
        var i, record;
        for (i = 0; i < $scope.trainingRecords.length; i += 1) {
            record = $scope.trainingRecords[i];
            record.selected = false;
        }
        $scope.selectAllCheckbox = false;
    }

    function selectAll() {
        var i, record;
        for (i = 0; i < $scope.trainingRecords.length; i += 1) {
            record = $scope.trainingRecords[i];
            record.selected = true;
        }
        $scope.selectAllCheckbox = true;
    }

    $scope.onUpdateTrainingRecords = function () {
        $scope.selectAllCheckbox = false;
        $scope.batchUpdate = true;
    };

    function clearBatchUpdate() {
        $scope.batchUpdate = false;
        var i, record;
        for (i = 0; i < $scope.trainingRecords.length; i += 1) {
            record = $scope.trainingRecords[i];
            if (record.selected !== undefined) {
                delete record.selected;
            }
        }
    }

    $scope.onCancelUpdateTrainingRecords = function () {
        clearBatchUpdate();
    };

    $scope.onUpdateSelectedRecords = function () {
        var i, record, trainee;

        $scope.batchInputCertifiedOn = new Date();
        $scope.batchInputCertifiedById = null;
        $scope.batchTrainingRecords = {};
        $scope.batchTraineeNames = '';
        for (i = 0; i < $scope.trainingRecords.length; i += 1) {
            record = $scope.trainingRecords[i];
            if (record.selected) {
                $scope.batchTrainingRecords[record.id] = record;
                if ($scope.batchTraineeNames !== '') {
                    $scope.batchTraineeNames += ', ';
                }
                $scope.batchTraineeNames += record.trainee.firstName + ' ' + record.trainee.lastName;
            }
        }

        angular.element('#modalBatchUpdateCert').modal('show');
    };



    $scope.onSaveBatchUpdate = function () {
        var batchUpdateError;
        angular.element('#modalBatchUpdateCert').modal('hide');
        clearBatchUpdate();
        $scope.$emit('showProgress', {title: "Saving Training Records", body: 'Saving training records for ' + $scope.batchTraineeNames});
        batchUpdateError = false;

        function updateSingleRecord(record) {
            record.update().then(
                function(data) {
                    delete $scope.batchTrainingRecords[record.id];
                    if (Object.keys($scope.batchTrainingRecords).length === 0) {
                        $scope.$emit('hideProgress');
                    }
                },
                function(data) {
                    $scope.$emit('hideProgress');
                    if (!batchUpdateError) {
                        batchUpdateError = true;
                        Utilities.showResourceError(data, {title: "Error Saving Training Records", body: "Error saving training record " + record.id + " for employee" + record.trainee.id});
                    }
                }
            );
        }

        angular.forEach($scope.batchTrainingRecords, function (record, id) {
            record.certifiedOn = $scope.batchInputCertifiedOn.toJSON();
            record.certifiedById = $scope.batchInputCertifiedById;
            updateSingleRecord(record);
        });
    };

    $scope.onSelectAll = function () {
        if ($scope.selectAllCheckbox) {
            selectAll();
        } else {
            unselectAll();
        }
    };
}]);

