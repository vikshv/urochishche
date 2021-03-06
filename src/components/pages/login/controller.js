export default class LoginController {
    constructor($scope, $state, $timeout, AuthService) {
        'ngInject';

        this.$scope = $scope;
        this.$state = $state;
        this.$timeout = $timeout;
        this.AuthService = AuthService;
    }

    submit() {
        const { email, password } = this.auth;
        this._startProgress();
        this.AuthService.signInWithEmailAndPassword(email, password)
            .then(() => {
                this._gotoUserState();
            })
            .catch(error => {
                this._stopProgress();
                this._onError(error);
            });
    }

    _onError(error) {
        let result;
        switch (error.code) {
            case 'auth/user-disabled': {
                result = 'Пользователь заблокирован';
                break;
            }
            case 'auth/invalid-email': {
                result = 'Неправильный формат адреса электронной почты';
                break;
            }
            case 'auth/user-not-found': {
                result = 'Пользователь не найден';
                break;
            }
            case 'auth/wrong-password': {
                result = 'Неверный пароль';
                break;
            }
            case 'auth/too-many-requests': {
                result = 'Авторизация временно заблокирована';
                this.blocked = true;
                this.$timeout(() => {
                    this.blocked = false;
                    this.errorMessage = null;
                }, 5000);
                break;
            }
            default: {
                throw Error(error);
            }
        }
        this.errorMessage = result;
    }

    hideErrorMessage() {
        this.errorMessage = null;
    }

    isHasError(attrName) {
        const item = this.$scope.auth[attrName];
        return item.$invalid && item.$dirty && item.$touched;
    }

    _startProgress() {
        this.progress = true;
    }

    _stopProgress() {
        this.progress = false;
    }

    _gotoUserState() {
        this.$state.go('user');
    }
};
