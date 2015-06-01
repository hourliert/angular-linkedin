# angular-linkedin
Tiny wrapper around linkedin api for angular.js

#Install

`bower install hourliert/angular-linkedin`

#Use

At bootstrap:
```
var app = angular.module('myApp', ['linkedin']);

app.config(['LinkedInProvider', function (LinkedInProvider) {
    LinkedInProvider.setApiKey('77t4pravrnp3y5');
    LinkedInProvider.setAuthorize(true);
}]);
```

At runtime:
```
module.service('LinkedInService', ['LinkedIn', function(LinkedIn) {
  //open a new windows asking for user credentials and return a promise with some user info + the api token
  LinkedIn.login().then(function(data){ 
        
  });
  
  //return a promise. it will be resolved with the user session when the linkedin sdk will be loaded
  LinkedIn.handleClientLoad().then(function(data){ 

  });
  
  //get the user main informations
  LinkedIn.me().then(function(selfInfo){ 

  });
}]);
```


