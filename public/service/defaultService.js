'use strict';

app.service('defaultService', () => {
    var auth = false;
    var obj = {}

    obj.setAuth = function (value) {
        console.log('in set auth')
        auth = value;
        console.log(auth)
    }

    obj.getAuth = function () {
            return auth
    }

    return obj;





})