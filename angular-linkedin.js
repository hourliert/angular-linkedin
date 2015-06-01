(function(){
    'use strict';

    var loadDeferred,
        loadDeferred2;

    angular.module('linkedin', [])
    .provider('LinkedIn', function(){
        var apiKey;
        var authorize = false;

        this.setApiKey= function(value){
            apiKey = value;
        };

        this.setAuthorize= function(value){
            authorize = value;
        };

        this.$get = ['$q', '$timeout', function($q, $timeout){
            loadDeferred.promise.then(function(){
                IN.init({
                    'api_key': apiKey,
                    authorize: authorize,
                    'credentials_cookie': true
                });
                $timeout(function(){ //TODO very ugly but how can i do with this shitty api ?
                    loadDeferred2.resolve();
                }, 5000);
            });

            return {
                login: function(){
                    var df = $q.defer();

                    IN.Event.on(IN, 'auth', function(){
                        if(IN.User.isAuthorized()){
                            df.resolve(IN.ENV.auth);
                        }
                    });

                    IN.UI.Authorize().place();

                    return df.promise;
                },
                logout: function(){
                    var df = $q.defer();

                    loadDeferred2.promise.then(function(){
                        IN.User.logout(function(){
                            df.resolve();
                        });
                    });

                    return df.promise;
                },
                me: function(){
                    var df = $q.defer();

                    loadDeferred2.promise.then(function(){
                        IN.API.Profile('me').fields("first-name", "last-name", "email-address").result(function(res){
                            df.resolve(res.values[0]);
                        }).error(function(){
                            df.reject();
                        });
                    });

                    return df.promise;
                },
                handleClientLoad: function(){
                    var df = $q.defer();

                    loadDeferred2.promise.then(function(){
                        if (IN.User.isAuthorized()){
                            df.resolve({
                                'oauth_token': IN.ENV.auth['oauth_token'],
                                'oauth_expires_in': IN.ENV.auth['oauth_expires_in']
                            });
                        } else {
                            df.reject();
                        }
                    });

                    return df.promise;
                }
            };
        }];
    })
    .run(['$q', '$window', '$timeout', function($q, $window, $timeout){
        loadDeferred = $q.defer();
        loadDeferred2 = $q.defer();

        (function injectScript(){
            var src = '//platform.linkedin.com/in.js?async=true',
                script = document.createElement('script');

            if ($window.location.protocol.indexOf('file:') !== -1){
                src = 'https:' + src;
            }

            script.src = src;
            script.onload = function(){
                $timeout(function(){
                    loadDeferred.resolve();
                }, 200);
            };

            document.getElementsByTagName('head')[0].appendChild(script);
        })();
    }]);
})();
