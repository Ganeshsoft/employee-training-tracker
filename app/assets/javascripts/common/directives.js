angular.module('common.directives', ['common.assets']);

angular.module('common.directives').directive('commonModalError', [ '$rootScope', '$http', '$location', '$timeout', 'ERROR_DIALOG_TEMPLATE', 'LOADING_16_IMAGE', function ($rootScope, $http, $location, $timeout, ERROR_DIALOG_TEMPLATE, LOADING_16_IMAGE) {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        templateUrl: ERROR_DIALOG_TEMPLATE,

        link: function (scope, element, attrs) {
            var errorDate;

            scope.loadingImage = LOADING_16_IMAGE;

            function setDetailsButton(show) {
                if (show) {
                    scope.detailButtonText = 'Hide Details';
                } else {
                    scope.detailButtonText = 'Show Details';
                }
                scope.showDetails = show;
            }

            $rootScope.$on('showError', function (event, message) {
                errorDate = new Date();
                scope.inProgress = false;
                scope.title = message.title;
                scope.body = [];
                scope.details = [];
                scope.hasDetails = false;
                setDetailsButton(message.showDetails || false);

                if (message.body) {
                    if (angular.isArray(message.body)) {
                        scope.body = message.body;
                    } else {
                        scope.body.push(message.body);
                    }
                }

                if (message.details) {
                    if (angular.isArray(message.details)) {
                        scope.details = message.details;
                    } else {
                        scope.details.push(message.details);
                    }

                    scope.hasDetails = scope.details.length > 0;
                }

                if (angular.isNumber(message.timeout)) {
                    $timeout(function () {
                        element.modal('hide');
                    }, message.timeout);
                }

                element.modal('show');
            });

            scope.onToggleShowDetails = function () {
                setDetailsButton(!scope.showDetails);
            };
        }
    };
}]);

angular.module('common.directives').directive('commonModalProgress', [ '$rootScope', 'PROGRESS_DIALOG_TEMPLATE', function ($rootScope, PROGRESS_DIALOG_TEMPLATE) {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        templateUrl: PROGRESS_DIALOG_TEMPLATE,

        link: function (scope, element, attrs) {
            $rootScope.$on('showProgress', function (event, message) {
                scope.title = message.title;
                scope.body = message.body;
                element.modal('show');
            });
            $rootScope.$on('hideProgress', function (event) {
                element.modal('hide');
            });
        }
    };
}]);

angular.module('common.directives').directive('commonModalConfirmation', [ '$rootScope', 'CONFIRMATION_DIALOG_TEMPLATE', 'LOADING_16_IMAGE', function ($rootScope, CONFIRMATION_DIALOG_TEMPLATE, LOADING_16_IMAGE) {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        templateUrl: CONFIRMATION_DIALOG_TEMPLATE,

        link: function (scope, element, attrs) {
            scope.loadingImage = LOADING_16_IMAGE;

            $rootScope.$on('showConfirmation', function (event, message) {
                scope.title = message.title;
                scope.body = [];
                scope.buttons = [];
                scope.inProgress = false;

                if (message.warningLevel) {
                    scope.warningLevel = "modal-" + message.warningLevel;
                }

                if (message.body) {
                    if (angular.isArray(message.body)) {
                        scope.body = message.body;
                    } else {
                        scope.body.push(message.body);
                    }
                }

                if (message.buttons) {
                    if (angular.isArray(message.buttons)) {
                        scope.buttons = message.buttons;
                    } else {
                        scope.buttons.push(message.buttons);
                    }
                }

                element.modal('show');
            });

            scope.onButtonClick = function (callback) {
                scope.inProgress = true;
                if (callback) {
                    try {
                        callback();
                    }
                    catch (e) {
                        element.modal('hide');
                        var errorMessage = {
                            title: 'JS Error:  ' + callback.name,
                            body: e.message
                        };
                        $rootScope.$emit('showError', errorMessage);
                    }
                }
                element.modal('hide');
                scope.inProgress = false;
            };
        }
    };
}]);

angular.module('common.directives').directive('uiSelect2ClickFixer', function () {
    return {
        link: function (scope, element, attrs) {
            element.parent().bind('click', function (event) {
                event.stopPropagation();
            });
        }
    };
});
