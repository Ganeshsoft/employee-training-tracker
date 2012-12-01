/* Directives */

var trainingDirectives = angular.module('training.directives', ['training.assets', 'common.services', 'common.directives']);

trainingDirectives.directive('commonModalNewTrainingRecord', ['$rootScope', 'Utilities', 'Employee', 'Competency', 'TrainingRecord', 'TRAINING_RECORD_DIALOG_TEMPLATE', function ($rootScope, Utilities, Employee, Competency, TrainingRecord, TRAINING_RECORD_DIALOG_TEMPLATE) {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        templateUrl: TRAINING_RECORD_DIALOG_TEMPLATE,
        compile: function compile(tElement, tAttrs, transclude) {
            return {
                pre: function preLink(scope, iElement, iAttrs, controller) {
                    scope.dateOptions = {
                        changeMonth: true,
                        changeYear: true,
                        showButtonPanel: true
                    };
                },
                post: function postLink(scope, iElement, iAttrs, controller) {
                    var lockedFields = [], trainingRecord = {};

                    $rootScope.$on('newTrainingRecord', function (event, message) {
                        scope.record = angular.copy(message.trainingRecord, {});
                        scope.record.trainedOnDate = new Date();
                        scope.record.certifiedOnDate = new Date();

                        scope.employees = Employee.values;
                        scope.competencies = Competency.values;

                        lockedFields = message.lockedFields;
                        scope.uncertified = false;

                        iElement.modal('show');
                    });

                    scope.isLocked = function (field) {
                        return lockedFields.indexOf(field) >= 0;
                    };

                    scope.isReadyForSubmit = function () {
                        if (!scope.record || !scope.record.competencyId || !scope.record.traineeId || !scope.record.trainedById || !scope.record.trainedOnDate) {
                            return false;
                        }
                        return scope.uncertified || (scope.record.certifiedById && scope.record.certifiedOnDate);
                    };

                    scope.onUncertify = function () {
                        scope.uncertified = true;
                    };

                    scope.onEditCertification = function () {
                        scope.uncertified = false;
                    };

                    scope.onSaveTrainingRecord = function () {
                        scope.record.trainedOn = scope.record.trainedOnDate.toJSON();

                        if (scope.uncertified) {
                            scope.record.certifiedById = null;
                            scope.record.certifiedOn = null;
                        } else {
                            scope.record.certifiedOn = scope.record.certifiedOnDate.toJSON();
                        }

                        var record = new TrainingRecord(scope.record);
                        record.create().then(
                            function (data) {
                                $rootScope.$broadcast('trainingRecordCreated', data);
                            },
                            function (data) {
                                Utilities.showResourceError(data, {title: "Error Saving Training Record", body: "Error saving new training record"});
                            });

                        iElement.modal('hide');
                    };
                }
            };
        }
    };
}]);

trainingDirectives.directive('trainingRecordEditor', ['$filter', 'Utilities', 'Security', 'Employee', 'Competency', 'TrainingRecord', 'TRAINING_RECORD_EDITOR_TEMPLATE', 'LOADING_16_IMAGE', function ($filter, Utilities, Security, Employee, Competency, TrainingRecord, TRAINING_RECORD_EDITOR_TEMPLATE, LOADING_16_IMAGE) {
    return {
        restrict: 'A',
        templateUrl: TRAINING_RECORD_EDITOR_TEMPLATE,
        scope: {
            record: '=',
            displayEmployee: '=',
            displayCompetency: '=',
            batchUpdate: '='
        },
        compile: function compile(tElement, tAttrs, transclude) {
            return {
                pre: function preLink(scope, iElement, iAttrs, controller) {
                    scope.dateOptions = {
                        changeMonth: true,
                        changeYear: true,
                        showButtonPanel: true
                    };
                },
                post: function postLink(scope, iElement, iAttrs, controller) {
                    scope.record.editMode = false;
                    scope.editRecord = {};
                    scope.loadingImage = LOADING_16_IMAGE;
                    scope.inProgress = false;
                    scope.canEditTrainingRecord = Security.canEditTrainingRecord;
                    scope.competency = Competency.getCachedValue(scope.record.competencyId);

                    scope.$watch('editRecord.certifiedById', function() {
                        if (!scope.editRecord.certifiedById) {
                            scope.editRecord.certifiedOnDate = null;
                        } else if (!scope.editRecord.certifiedOnDate) {
                            scope.editRecord.certifiedOnDate = new Date();
                        }
                    });

                    scope.canAdd = function () {
                        if (!Security.canEditTrainingRecord) {
                            return false;
                        }

                        if (!scope.record.id) {
                            return true;
                        }

                        return false;
                    };

                    scope.canEdit = function () {
                        if (!Security.canEditTrainingRecord) {
                            return false;
                        }

                        if (scope.batchUpdate) {
                            return false;
                        }

                        if (scope.record.id && !scope.record.editMode) {
                            return true;
                        }

                        return false;
                    };

                    scope.canDelete = scope.canEdit;

                    scope.outOfDate = function () {
                        return  !scope.record.editMode && scope.record.id && (!scope.record.certifiedOn || new Date(scope.competency.publishedOn) > new Date(scope.record.certifiedOn));
                    };

                    scope.onSelect = function () {
                        scope.$emit('trainingRecordSelectionChanged', scope.record);
                    };

                    scope.onSelect = function () {
                        scope.$emit('trainingRecordSelectionChanged', scope.record);
                    };

                    scope.onEdit = function () {
                        scope.certifiers = scope.trainers = Employee.values;

                        scope.editRecord = angular.copy(scope.record, {});
                        scope.editRecord.trainedOnDate = Utilities.getLocalDate(scope.record.trainedOn);
                        scope.editRecord.certifiedOnDate = Utilities.getLocalDate(scope.record.certifiedOn);

                        scope.record.editMode = true;
                        scope.$emit('trainingRecordEditModeChanged', scope.record);
                    };

                    function deleteTrainingRecord() {
                        scope.record.remove().then(
                                function (data) {
                                    scope.$emit('trainingRecordDeleted', scope.record);
                                },
                                function (data) {
                                    Utilities.showResourceError(data, { title: "Error Deleting Training Record", body: "Error deleting training record " + scope.record.id + "."});
                                });
                    }

                    scope.onDelete = function () {
                        scope.$emit(
                                'showConfirmation',
                                {
                                    title:'Delete Training Record',
                                    body:'Are you sure you would like to delete this training record?',
                                    warningLevel:'warning',
                                    buttons:[
                                        {text:"Yes", icon:"icon-ok", callback:deleteTrainingRecord},
                                        {text:"No", icon:"icon-remove"}
                                    ]
                                });
                    };

                    scope.onAdd = function () {
                        var newTrainingRecord;

                        newTrainingRecord = {
                            traineeId: scope.record.trainee.id,
                            competencyId: scope.record.competency.id
                        };

                        scope.$emit(
                                'newTrainingRecord',
                                {
                                    trainingRecord: newTrainingRecord,
                                    lockedFields: ['trainee', 'competency']
                                });
                    };

                    scope.onSave = function () {
                        scope.inProgress = true;
                        scope.record.editMode = false;
                        scope.$emit('trainingRecordEditModeChanged', scope.record);

                        scope.record.trainedOn = scope.editRecord.trainedOnDate.toJSON();
                        scope.record.trainedById = parseInt(scope.editRecord.trainedById, 10);

                        if (scope.editRecord.certifiedById && scope.editRecord.certifiedOnDate) {
                            scope.record.certifiedById = parseInt(scope.editRecord.certifiedById, 10);
                            scope.record.certifiedOn = scope.editRecord.certifiedOnDate.toJSON();
                        } else {
                            scope.record.certifiedById = null;
                            scope.record.certifiedOn = null;
                        }

                        scope.record.update().then(
                            function (data) {
                                // update doesn't return anything
                                scope.inProgress = false;
                            },
                            function (data) {
                                scope.inProgress = false;
                                Utilities.showResourceError(data, { title: "Error Saving Training Record", body: "Error saving training record " + scope.record.id + "."});
                            });
                    };

                    scope.onCancel = function () {
                        scope.record.editMode = false;
                        scope.$emit('trainingRecordEditModeChanged', scope.record);
                    };
                }
            };
        }
    };
}]);
