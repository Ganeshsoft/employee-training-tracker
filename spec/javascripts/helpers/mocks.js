angular.module('common.mock', []);

angular.module('common.mock').factory('MessageQueue', function () {
    var service = {callbacks: {subscriptions: {}}};

    service.connected = false;
    service.connecting = false;

    service.connect = function (url, login, password, connectCallback, errorCallback) {
        service.url = url;
        service.login = login;
        service.password = password;
        service.callbacks.connectCallback = connectCallback;
        service.callbacks.errorCallback = errorCallback;
    };

    service.reconnect = function (connectCallback, errorCallback) {
        service.callbacks.connectCallback = connectCallback;
        service.callbacks.errorCallback = errorCallback;
    };

    service.disconnect = function () {
        service.connected = false;
    };

    service.subscribe = function (destination, callback, headers) {
        service.callbacks.subscriptions[destination] = callback;
        return '123';
    };

    spyOn(service, 'connect').andCallThrough();
    spyOn(service, 'reconnect').andCallThrough();
    spyOn(service, 'disconnect').andCallThrough();
    spyOn(service, 'subscribe').andCallThrough();

    service.unsubscribe = jasmine.createSpy('MessageQueue unsubscribe');
    service.send = jasmine.createSpy('MessageQueue send');

    return service;
});