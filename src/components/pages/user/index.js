import angular from 'angular';
import uiRouter from 'angular-ui-router';
import component from './component';

export default angular.module('app.components.pages.user', [
        uiRouter
    ])
    .config(function($stateProvider) {
        'ngInject';

        $stateProvider
            .state('user', {
                url: '/user',
                template: '<user-page />',
                resolve: {
                    authResolve
                }
            });
    })
    .component('userPage', component);

function authResolve(AuthService) {
    'ngInject';
    return AuthService.requireSignIn();
}
