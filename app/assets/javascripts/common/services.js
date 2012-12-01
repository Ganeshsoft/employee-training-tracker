//= require_self
//= require_tree ./services
angular.module('common.services', ['rails']);
angular.module('common.services.users', ['rails', 'common.services']);
angular.module('common.services.builds', ['rails', 'common.services']);

angular.module('common.services').config(["$httpProvider", function (provider) {
    provider.defaults.headers.common['X-CSRF-Token'] = angular.element('meta[name=csrf-token]').attr('content');
}]);
