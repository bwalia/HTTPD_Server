// script.js

// create the module and name it app
var app = angular.module("pomodoApp", ["ngRoute"]);

// configure our routes
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : 'pages/home.shtml',
        controller  : 'homeController'
    })
    .when("/tasks", {
        templateUrl : 'pages/tasks.shtml',
        controller  : 'tasksController'
    })
    .when("/projects", {
        templateUrl : 'pages/projects.shtml',
        controller  : 'projectController'
    })
    .when("/locations", {
        templateUrl : 'pages/locations.shtml',
        controller  : 'locationController'
    })
    .when("/account", {
        templateUrl : 'pages/user.shtml',
        controller  : 'userController'
    });
});

app.factory('authInterceptor', function ($rootScope, $q, $window, $location) {
  return {
    request: function (config) {
    	//console.log($window.sessionStorage.token);
    	config.headers = config.headers || {};
    	if ($window.sessionStorage.token) {
      		config.headers.Authorization = $window.sessionStorage.token;
     	}
      	return config;
    },
    response: function (response) {
    	if (response.status === 401) {
        	// handle the case where the user is not authenticated
         	$location.url('/login.html');
      	}
      	return response || $q.when(response);
    }
  };
});

app.config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});

//to change page logo and name
app.run(['$rootScope',function($rootScope){
  $rootScope.changeTitle = function(name, icon) {
    $rootScope.pageInitial = {
      pageTitle: name,
      pageIcon: icon
    };
  } 
}]);

//directive
app.directive("datepicker", function () {
  return {
    restrict: "A",
    require: "ngModel",
    link: function (scope, elem, attrs, ngModelCtrl) {
      var updateModel = function (dateText) {
        scope.$apply(function () {
          ngModelCtrl.$setViewValue(dateText);
        });
      };
      var options = {
        dateFormat: "dd/mm/yy",
        onSelect: function (dateText) {
          updateModel(dateText);
        }
      };
      elem.datepicker(options);
    }
  }
});


// create the controller and inject Angular's $scope
app.controller('NavigationCtrl', ['$scope', '$location', function ($scope, $location) {
    $scope.isCurrentPath = function (path) {
    	return $location.path() == path;
    };
}]);

//login page
app.controller('validateCtrl', function($scope, $http, $window) {
   	$scope.username = 'John Doe';
    $scope.password = '';
    $scope.error_msg = "";
    if ($window.sessionStorage.token) {
    	$window.sessionStorage.token='';
    	delete $window.sessionStorage.token;
    }
    $scope.authenticate_user = function() {
    	var data = $.param({
    		username: $scope.username,
         	password: $scope.password
         });
         var config = {
        	headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }
	
        $http.post('login.cgi', data, config)
        .success(function (data, status, headers, config) {
        	if(data.success){
        		$window.sessionStorage.token = data.success;
        		window.location=data.redirect;
            }else if(data.error){
            	delete $window.sessionStorage.token;
            	$scope.error_msg = data.error;
            }
       	})
        .error(function (data, status, header, config) {
        	$scope.error_msg = status;
       	});
    }
});

//home page
app.controller('homeController', function($scope, $http) {
	$scope.changeTitle('Dashboard', 'fa fa-dashboard');
});

app.controller('userController', function($scope, $http) {
	$scope.changeTitle('My account', 'fa fa-users');
	$scope.submitForm = function() {

            // check to make sure the form is completely valid
            if ($scope.userForm.$valid) {
                alert('submit this form');
            }

        };
});

app.controller('tasksController', function($scope, $http) {
	$scope.changeTitle('Tasks', 'fa fa-tasks');
	$scope.confirmationBox=false;
	$scope.loadData = function () {
		$http({
			method : "GET",
        	url : "tasks.js"
   		}).then(function mySucces(response) {
    		$scope.contentList = response.data.aaData;
    	});
    };
    
    //load locations
    $scope.loadData();
	    
    // reset Task entry form
    $scope.reset_form = function() {
     	$scope.Title="";
     	$scope.Notes="";
     	$scope.LocationID="";
     	$scope.ProjectID="";
     	$scope.datepicker="";
    }
    
    //edit task
    $scope.edit_content = function(val) {
    	$scope.Title=val.Title;
     	$scope.Notes=val.Notes;
     	$scope.LocationID=val.Location;
     	$scope.ProjectID=val.Project;
     	$scope.datepicker=val.DueDate;
     	$scope.ID=val.ID;
    }
    
    //save data
    $scope.save_data = function() {
    	var data = $.param({
    		ID: $scope.ID,
            Title: $scope.Title,
            Notes: $scope.Notes,
            DueDate: $scope.datepicker,
            LocationID : $scope.LocationID,
            ProjectID : $scope.ProjectID
         });
     	 var config = {
            headers : {
                 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }
	
        $http.post('/save/task/@', data, config)
        .success(function (data, status, headers, config) {
            // display response
            console.log(data);
            
            //reload content
            $scope.loadData();
        })
        .error(function (data, status, header, config) {
            console.log(status);
        });
    }
    
    //delete_confirmation 
    $scope.delete_confirmation = function(val) {
    	$scope.confirmationBox=true;
    	$scope.removeID=val;
    }
    
    //remove task from the list
    $scope.remove_task = function() {
    	var removeTaskID= $scope.removeID;
    	if(removeTaskID!=""){
    		$scope.removeID="";
     		var index = -1;		
			var tasksArr = eval( $scope.contentList );
			for( var i = 0; i < tasksArr.length; i++ ) {
				if( tasksArr[i].ID === removeTaskID ) {
					index = i;
					break;
				}
			}
			if( index === -1 ) {
				alert( "Something gone wrong" );
			}
			$scope.contentList.splice( index, 1 );
			$scope.confirmationBox=false;
			console.log("This item has been removed from the database.");	
		}else{
			alert( "Something gone wrong" );
		}
    }
});

// Location Controller
app.controller('locationController', function($scope, $http) {
	$scope.changeTitle('Locations', 'fa fa-map-marker');
	
	$scope.loadData = function () {
		$http({
			method : "GET",
        	url : "locations.js"
   		}).then(function mySucces(response) {
    		$scope.contentList = response.data.aaData;
    	});
    };
    
    //load locations
    $scope.loadData();
     
    // reset Task entry form
    $scope.reset_form = function() {
     	$scope.Name="";
     	
    }
    
    $scope.save_location = function(data) {
    	console.log("Values saved");
     	 var config = {
            headers : {
                 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }
	
        $http.post('/save/location/@', data, config)
        .success(function (data, status, headers, config) {
            // display response
            console.log(data);
            
            //reload content
            $scope.loadData();
        })
        .error(function (data, status, header, config) {
            console.log(status);
        });
    }
    
    // save new location
    $scope.save_new_location = function() {
     	var data = $.param({
            Name: $scope.Name
         });
        $scope.save_location(data);
    }
    
    // save the values
    $scope.save_existing_location = function(val, show) {
     	if(show==false){
     		
     		// use $.param jQuery function to serialize data from JSON 
            var data = $.param({
                ID: val.ID,
                Name: val.Name
            });
        	$scope.save_location(data);
        }	
    }
    
    //remove task from the list
    $scope.remove_location = function(val) {
     	var index = -1;		
		var tasksArr = eval( $scope.contentList );
		for( var i = 0; i < tasksArr.length; i++ ) {
			if( tasksArr[i].ID === val ) {
				index = i;
				break;
			}
		}
		if( index === -1 ) {
			alert( "Something gone wrong" );
		}
		$scope.contentList.splice( index, 1 );
		console.log("This item has been removed from the database.");	
    }
});

// project Controller
app.controller('projectController', function($scope, $http) {
	$scope.changeTitle('Projects', 'fa fa-archive');
	$scope.confirmationBox=false;
	
	$scope.loadData = function () {
		$http({
        	method : "GET",
        	url : "projects.js"
    	}).then(function mySucces(response) {
    		$scope.contentList = response.data.aaData;
    	});
    };
    
    //load projects
    $scope.loadData();
    
    // reset Task entry form
    $scope.reset_form = function() {
     	$scope.Name="";
     	$scope.Notes="";
    }
    
    //edit task
    $scope.edit_content = function(val) {
    	$scope.Name=val.Name;
     	$scope.Notes=val.Notes;
    }
    
    //save data
    $scope.save_data = function(data) {
    	var data = $.param({
    		ID : $scope.ID,
            Name: $scope.Name,
            Notes: $scope.Notes
         });
    	console.log("Values saved");
     	 var config = {
            headers : {
                 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }
	
        $http.post('/save/project/@', data, config)
        .success(function (data, status, headers, config) {
            // display response
            console.log(data);
            
            //reload content
            $scope.loadData();
        })
        .error(function (data, status, header, config) {
            console.log(status);
        });
    }
	
	//delete_confirmation 
    $scope.delete_confirmation = function(val) {
    	$scope.confirmationBox=true;
    	$scope.removeID=val;
    }
    
    //remove item from the list
    $scope.remove_project = function() {
    	var removeItemID= $scope.removeID;
    	if(removeItemID!=""){
    		$scope.removeID="";
     		var index = -1;		
			var tasksArr = eval( $scope.contentList );
			for( var i = 0; i < tasksArr.length; i++ ) {
				if( tasksArr[i].ID === removeItemID ) {
					index = i;
					break;
				}
			}
			if( index === -1 ) {
				alert( "Something gone wrong" );
			}
			$scope.contentList.splice( index, 1 );
			
			$scope.confirmationBox=false;
			console.log("This item has been removed from the database.");	
		}else{
			alert( "Something gone wrong" );
		}
    }
});