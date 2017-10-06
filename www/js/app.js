// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var db =null;
var mymod = angular.module('starter', ['ionic', 'ngCordova', 'chart.js']);

/*mymod.factory('MyService', function(){
  return {
    data: {
      firstname: '',
      lastname: ''
    }
    // Other methods or objects can go here
  };
});*/


mymod.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
	
	//$ionicConfigProvider.backButton.previousTitleText(false);
	//$ionicConfigProvider.backButton.icon('ion-chevron-left');
	//$ionicConfigProvider.backButton.text('')
		$ionicConfigProvider.backButton.previousTitleText(false);
		$ionicConfigProvider.backButton.icon('ion-chevron-left');
		$ionicConfigProvider.backButton.text('')
	
        $stateProvider
			.state('/', {
                url: '/Home',
                templateUrl: 'templates/Home.html',
                controller: 'myCtrl'
            })
			.state('Home', {
                url: '/Home',
                templateUrl: 'templates/Home.html',
                controller: 'myCtrl'
            })
			.state('Create', {
                url: '/Create',
                templateUrl: 'templates/Create.html',
                controller: 'myCtrl'
            })
			.state('Update', {
                url: '/Update',
                templateUrl: 'templates/Update.html',
                controller: 'myDataPopulate'
            })
			.state('Grid', {
                url: '/Grid',
                templateUrl: 'templates/Grid.html',
                controller: 'myDataPopulate'
            })
			.state('Search', {
                url: '/Search',
                templateUrl: 'templates/Search.html',
                controller: 'mySearchDataPopulate'
            })
			.state('SearchGrid', {
                url: '/SearchGrid',
                templateUrl: 'templates/SearchGrid.html',
                controller: 'mySearchDataPopulate'
            })
			.state('Charts', {
                url: '/Charts',
                templateUrl: 'templates/Charts.html',
                controller: 'myCharts'
            });
        $urlRouterProvider.otherwise('/Home');
    });


mymod.run(function($rootScope,$ionicPlatform, $cordovaSQLite, $state,$ionicHistory) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
	
	db = $cordovaSQLite.openDB({ name: "my.db", location:2, createFromLocation: 1});
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS people (id integer primary key, firstname text, lastname text,amount numeric, exdate date, fwhere text, fhow text, freason text)");
	
  });
  
  $ionicPlatform.registerBackButtonAction(function (e) {
  if($state.current.name=="Home" || $state.current.name=="/"  || $state.current.name==""){
	
	/*if ($rootScope.backButtonPressedOnceToExit) {
      ionic.Platform.exitApp();
    }

    else if ($ionicHistory.backView()) {
      $ionicHistory.goBack();
    }
    else {
      $rootScope.backButtonPressedOnceToExit = true;
      window.plugins.toast.showShortCenter(
        "Press back button again to exit",function(a){},function(b){}
      );
      setTimeout(function(){
        $rootScope.backButtonPressedOnceToExit = false;
      },2000);
    }
    e.preventDefault();
    return false;*/
  
	
    navigator.app.exitApp(); //<-- remove this line to disable the exit
  }
  else {
    navigator.app.backHistory();
  }
}, 100);
  
});



mymod.service("ValuesStore", function() {

		//alert("Hello!!!");
		return "Test!!!";

});


mymod.controller("myCtrl",function($scope, $cordovaToast, $ionicHistory, $cordovaSQLite,$state, $ionicSideMenuDelegate,$filter,$state, $location) {
		
	var cr = this;
	$ionicHistory.clearCache();
	
	$scope.showToast = function(message, duration, location) {
        $cordovaToast.show(message, duration, location).then(function(success) {
            console.log("The toast was shown");
        }, function (error) {
            console.log("The toast was not shown due to " + error);
        });
    }
	
	if(!$scope.idvalue)
	{
		$scope.idvalue = "";
	}
	cr.allSessions = [];
	
	cr.clearCreateData = function(){
		cr.firstname= "";
		cr.lastname = "";
		cr.amount = "";
		cr.exdate = "";
		cr.where = "";
		cr.how = "";
		cr.reason = "";
		cr.firstname= "";
	}
	
	$scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
  
  $scope.changeState = function(page) {
    $state.go(page);
  }
	
	cr.createTable = function()
	{
		$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS people (id integer primary key, firstname text, lastname text,amount numeric, exdate date, fwhere text, fhow text, freason text)").then(function(res) {
            console.log("Table Created");
        }, function (err) {
            console.error(err);
        });
	}
	
	//Insert values
    cr.insert = function() {
        var query = "INSERT INTO people (firstname, lastname, amount, exdate, fwhere, fhow, freason) VALUES (?,?,?,?,?,?,?)";
		var dt = new Date(cr.exdate);
		var strdt = new Date(dt.getFullYear() + "/" + (dt.getMonth() + 1)  + "/" + dt.getDate())
		strdt= $filter('date')(new Date(strdt), "yyyy/MM/dd");
        $cordovaSQLite.execute(db, query, [cr.firstname, cr.lastname,cr.amount, strdt, cr.where, cr.how, cr.reason]).then(function(res) {
            console.log("INSERT ID -> " + res.insertId);
			$scope.showToast("Data Created Successfully","long","bottom");
			$location.path("/Home");
        }, function (err) {
            console.error(err);
        });
    }
	
	
	//Select values
    cr.select = function(lastname) {
        var query = "SELECT firstname, lastname FROM people WHERE lastname = ?";
        $cordovaSQLite.execute(db, query, [cr.lastname]).then(function(res) {
            if(res.rows.length > 0) {
                console.log("SELECTED -> " + res.rows.item(0).firstname + " " + res.rows.item(0).lastname);
				$scope.showToast(res.rows.item(0).firstname + " " + res.rows.item(0).lastname,"long","bottom");
            } else {
                console.log("No results found");
            }
        }, function (err) {
            console.error(err);
        });
    }
	
	//Delete Records
	cr.deleteTable = function() {
		if(confirm("Do you really want to delete whole records?"))
		{
        var query = "DELETE FROM people";
        $cordovaSQLite.execute(db, query).then(function(res) {
            if(res.rows.length == 0) {
                console.log("DELETED -> ");
				$scope.showToast("All records have been deleted","long","bottom");
            } else {
                console.log("Not able to delete");
            }
        }, function (err) {
            console.error(err);
        });
		}
    }
	
	//DROP TABLE Subjects;
	
	cr.dropTable = function() {
        var query = "DROP TABLE people";
        $cordovaSQLite.execute(db, query).then(function(res) {
            if(res.rows.length == 0) {
                console.log("DROPPED TABLE -> ");
				$scope.showToast("Table has been dropped successfully","long","bottom");
            } else {
                console.log("Not bale gto drop");
            }
        }, function (err) {
            console.error(err);
        });
    }
	
	cr.showAll = function() {
    var query = "SELECT * FROM people";
    $cordovaSQLite.execute(db, query, []).then(function(res) {

        if(res.rows.length > 0) {
             console.log("SELECTED -> " + res.rows.item(0).lastname + " " + res.rows.item(0).firstname);
			 console.log("SELECTED -> " + res.rows.item(0).amount + " " + res.rows.item(0).exdate);
			 console.log("SELECTED -> " + res.rows.item(0).fwhere + " " + res.rows.item(0).fhow);
			 console.log("SELECTED -> " + res.rows.item(0).freason); 
			 
			 
             for (var i=0; i<res.rows.length; i++) {

                cr.allSessions.push({
					id: res.rows.item(i).id,
                    firstname: res.rows.item(i).firstname,
                    lastname: res.rows.item(i).lastname,
                    amount: res.rows.item(i).amount,
                    exdate: res.rows.item(i).exdate,
                    fwhere: res.rows.item(i).fwhere,
                    fhow: res.rows.item(i).fhow,
                    freason: res.rows.item(i).freason
                    });

             }
			// alert(JSON.stringify(cr.allSessions));
        } else {
            console.log("No results found");
        }
    }, function (err) {
        console.error("error=>"+err);
    });
}
	
 
});

mymod.controller("myDataPopulate",function($scope,$ionicHistory, $cordovaToast, $cordovaSQLite, ValuesStore, $filter, $state, $location) {
	
	$scope.allSessions = [];
	
	
	$scope.showToast = function(message, duration, location) {
        $cordovaToast.show(message, duration, location).then(function(success) {
            console.log("The toast was shown");
        }, function (error) {
            console.log("The toast was not shown due to " + error);
        });
    }
	
	//$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS people (id integer primary key, firstname text, lastname text,amount numeric, exdate date, fwhere text, fhow text, freason text)");
    var query = "SELECT * FROM people";
    $cordovaSQLite.execute(db, query, []).then(function(res) {

        if(res.rows.length > 0) {
             console.log("SELECTED -> " + res.rows.item(0).lastname + " " + res.rows.item(0).firstname);
			 console.log("SELECTED -> " + res.rows.item(0).amount + " " + res.rows.item(0).exdate);
			 console.log("SELECTED -> " + res.rows.item(0).fwhere + " " + res.rows.item(0).fhow);
			 console.log("SELECTED -> " + res.rows.item(0).freason); 
			 
			 
             for (var i=0; i<res.rows.length; i++) {

                $scope.allSessions.push({
					id: res.rows.item(i).id,
                    firstname: res.rows.item(i).firstname,
                    lastname: res.rows.item(i).lastname,
                    amount: res.rows.item(i).amount,
                    exdate: res.rows.item(i).exdate,
                    fwhere: res.rows.item(i).fwhere,
                    fhow: res.rows.item(i).fhow,
                    freason: res.rows.item(i).freason
                    });

             }
			 
			//alert(JSON.stringify($scope.allSessions));
        } else {
            console.log("No results found");
        }
    }, function (err) {
        console.error("error=>"+err);
    });

	query = "select sum(amount) r FROM people"
	$cordovaSQLite.execute(db, query, []).then(function(res) {
		$scope.totalAmount = res.rows.item(0).r;
    }, function (err) {
        console.error("error=>"+err);
    });
	
	
	$scope.idset = function(id)
	{
		sid=id;
	}
		
		if(sid){
			delete $scope.updateData;
	$scope.updateData = [];
	query = "SELECT * FROM people WHERE id = " + sid;
    $cordovaSQLite.execute(db, query, []).then(function(res) {
		
        if(res.rows.length > 0) {
             console.log("UPDATED -> " + res.rows.item(0).lastname + " " + res.rows.item(0).firstname);
			 console.log("UPDATED -> " + res.rows.item(0).amount + " " + res.rows.item(0).exdate);
			 console.log("UPDATED -> " + res.rows.item(0).fwhere + " " + res.rows.item(0).fhow);
			 console.log("UPDATED -> " + res.rows.item(0).freason); 
			 
			 
             //for (var i=0; i<res.rows.length; i++) {
				var i=0;
				$scope.updateData.id = res.rows.item(i).id;
				$scope.updateData.firstname = res.rows.item(i).firstname;
				$scope.updateData.lastname = res.rows.item(i).lastname;
				$scope.updateData.amount = res.rows.item(i).amount;
				$scope.updateData.exdate = new Date(res.rows.item(i).exdate);
				$scope.updateData.fwhere = res.rows.item(i).fwhere;
				$scope.updateData.fhow = res.rows.item(i).fhow;
				$scope.updateData.freason = res.rows.item(i).freason;
                

             //}
			 
			//alert(JSON.stringify($scope.allSessions));
        } else {
            console.log("No results found");
        }
    }, function (err) {
        console.error("error=>"+err);
    });		
	
	}
	
	$scope.updateRecord = function() {
		var dt = new Date($scope.updateData.exdate);
		var strdt = new Date(dt.getFullYear() + "/" + (dt.getMonth() + 1)  + "/" + dt.getDate())
		strdt= $filter('date')(new Date(strdt), "yyyy/MM/dd");
		
        var query = "UPDATE people SET firstname='"+$scope.updateData.firstname+"',"
		+ " lastname='" + $scope.updateData.lastname +"',"
		+ " amount=" + $scope.updateData.amount +","
		+ " exdate='" + strdt +"',"
		+ " fwhere='" + $scope.updateData.fwhere +"',"
		+ " fhow='" + $scope.updateData.fhow +"',"
		+ " freason='" + $scope.updateData.freason +"' WHERE id=" + $scope.updateData.id;
        $cordovaSQLite.execute(db, query, []).then(function(res) {
            console.log("Updated ID -> " + $scope.updateData.id);
			$ionicHistory.clearCache();
			$scope.showToast("Data Updated Successfully","long","bottom");
			$location.path("/Home");
        }, function (err) {
            console.error(err);
        });
    }
	
	$scope.createTable = function()
	{
		$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS people (id integer primary key, firstname text, lastname text,amount numeric, exdate date, fwhere text, fhow text, freason text)").then(function(res) {
            console.log("Table Created");
        }, function (err) {
            console.error(err);
        });
	}
	
	
	$scope.copyRecord = function(id) {
		
		if(confirm("Do you want to copy this Record?"))
		{
		
		console.log(id);
		
        var query = "SELECT * From people WHERE id=" + id;
        $cordovaSQLite.execute(db, query, []).then(function(res) {
            
			//Start
			
			var dt = new Date(res.rows.item(0).exdate);
			var strdt = new Date(dt.getFullYear() + "/" + (dt.getMonth() + 1)  + "/" + dt.getDate())
			strdt= $filter('date')(new Date(strdt), "yyyy/MM/dd");
			
			var query1 = "INSERT INTO people (firstname, lastname, amount, exdate, fwhere, fhow, freason) VALUES (?,?,?,?,?,?,?)";
			$cordovaSQLite.execute(db, query1, [res.rows.item(0).firstname, res.rows.item(0).lastname,res.rows.item(0).amount, strdt, res.rows.item(0).where, res.rows.item(0).how, res.rows.item(0).reason]).then(function(res1) {
            console.log("INSERT ID -> " + res1.insertId);
			$scope.showToast("Data Copied Successfully","long","bottom");
			$scope.idset(res1.insertId)
			$location.path("/Update");
        }, function (err) {
            console.error(err);
        });
			
			
			//End
			
			//$scope.showToast("Data copied Successfully","long","bottom");
			//$location.path("/Home");
        }, function (err) {
            console.error(err);
        });
		}
    }
	
	
	
	
	$scope.deleteRecord = function(id) {
		if(confirm("Do you really want to delete this expense?"))
		{
        var query = "DELETE  FROM people WHERE id=" + id;
        $cordovaSQLite.execute(db, query, []).then(function(res) {
            console.log("Deleted ID -> " + id);
			$scope.showToast("Data Deleted Successfully","long","bottom");
			$location.path("/Home");
        }, function (err) {
            console.error(err);
        });
		}
    }


});



mymod.controller("mySearchDataPopulate",function($scope, $cordovaToast, $cordovaSQLite, $filter, $state, $location) {
	
	$scope.allSessions = [];
	
	//$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS people (id integer primary key, firstname text, lastname text,amount numeric, exdate date, fwhere text, fhow text, freason text)");
    var query = "SELECT * FROM people WHERE firstname like '%";
	
	$scope.deleteRecord = function(id) {
		if(confirm("Do you really want to delete this expense?"))
		{
        var query = "DELETE  FROM people WHERE id=" + id;
        $cordovaSQLite.execute(db, query, []).then(function(res) {
            console.log("Deleted ID -> " + id);
			$scope.showToast("Data Deleted Successfully","long","bottom");
			$scope.searchFunction($scope.stype,$scope.sfname,$scope.slname);
        }, function (err) {
            console.error(err);
        });
		}
    }
	
	$scope.showToast = function(message, duration, location) {
        $cordovaToast.show(message, duration, location).then(function(success) {
            console.log("The toast was shown");
        }, function (error) {
            console.log("The toast was not shown due to " + error);
        });
    }
	
	
	$scope.queryBuilder = function(type,fname, lname){
		
		if(type == "Name")
		{
			query = "SELECT * FROM people WHERE ";
			if(fname)
			{
				query = query + " firstname like '%" + fname +"%'";
			}
			if(lname)
			{
				query = query + " or lastname like '%" + lname +"%'";
			}
			return query;
		}
		else if(type == "Date")
		{
			var dt = new Date(fname);
			var strdt = new Date(dt.getFullYear() + "/" + (dt.getMonth() + 1)  + "/" + dt.getDate())
			strdt= $filter('date')(new Date(strdt), "yyyy/MM/dd");
			query = "SELECT * FROM people WHERE ";
			if(fname)
			{
				query = query + " exdate = '" + strdt +"'";
				return query;
			}
		}
		else if(type == "How")
		{
			query = "SELECT * FROM people WHERE ";
			if(fname)
			{
				query = query + " fhow like '%" + fname +"%'";
				return query;
			}
			else if(lname)
			{
				query = query + " fwhere like '%" + lname +"%'";
				return query;
			}
			
			if(fname && lname)
			{
					query = "SELECT * FROM people WHERE ";
					query = query + " fhow like '%" + fname +"%' OR fwhere like '%" + lname +"%'";
					return query;
			}
		}
		else if(type == "BDate")
		{
			var dt = new Date(fname);
			var strdt = new Date(dt.getFullYear() + "/" + (dt.getMonth() + 1)  + "/" + dt.getDate())
			strdt= $filter('date')(new Date(strdt), "yyyy/MM/dd");
			dt = new Date(lname);
			strdt1 = new Date(dt.getFullYear() + "/" + (dt.getMonth() + 1)  + "/" + dt.getDate());
			strdt1 = $filter('date')(new Date(strdt1), "yyyy/MM/dd");
			query = "SELECT * FROM people WHERE ";
			if(fname)
			{
				query = query + " exdate BETWEEN '" + strdt +"' AND '" + strdt1 +"'";
				return query;
			}
		}
		alert("Search Failed");
		return query;
		
	}
	
	$scope.searchFunction = function(type,fname, lname){
		$scope.stype= type;
		$scope.sfname= fname;
		$scope.slname= lname;
		query = $scope.queryBuilder(type,fname, lname);
		//query = query + fname +"%' or lastname like '%" + lname +"%'"
		//alert(query);
		$scope.allSessions = [];
    $cordovaSQLite.execute(db, query, []).then(function(res) {

        if(res.rows.length > 0) {
             console.log("SELECTED -> " + res.rows.item(0).lastname + " " + res.rows.item(0).firstname);
			 console.log("SELECTED -> " + res.rows.item(0).amount + " " + res.rows.item(0).exdate);
			 console.log("SELECTED -> " + res.rows.item(0).fwhere + " " + res.rows.item(0).fhow);
			 console.log("SELECTED -> " + res.rows.item(0).freason); 
			 
			 
             for (var i=0; i<res.rows.length; i++) {
				 
				/*console.log("SELECTED -> " + res.rows.item(i).lastname + " " + res.rows.item(i).firstname);
				console.log("SELECTED -> " + res.rows.item(i).amount + " " + res.rows.item(i).exdate);
				console.log("SELECTED -> " + res.rows.item(i).fwhere + " " + res.rows.item(i).fhow);
				console.log("SELECTED -> " + res.rows.item(i).freason);*/

                $scope.allSessions.push({
					id: res.rows.item(i).id,
                    firstname: res.rows.item(i).firstname,
                    lastname: res.rows.item(i).lastname,
                    amount: res.rows.item(i).amount,
                    exdate: res.rows.item(i).exdate,
                    fwhere: res.rows.item(i).fwhere,
                    fhow: res.rows.item(i).fhow,
                    freason: res.rows.item(i).freason
                    });

             }
			 
			 
			//alert(JSON.stringify($scope.allSessions));
        } else {
            console.log("No results found");
        }
    }, function (err) {
        console.error("error=>"+err);
    });

	query = query.replace('*', 'sum(amount) r ');
	$cordovaSQLite.execute(db, query, []).then(function(res) {
		$scope.totalAmount = res.rows.item(0).r;
    }, function (err) {
        console.error("error=>"+err);
    });

	}	
	
	$scope.idset = function(id)
	{
		sid = id;
	}
	

});


mymod.controller("myUpdateDataPopulate",function($scope, $cordovaSQLite, $filter, ValuesStore) {
	
	$scope.allSessions = [];
	
	//$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS people (id integer primary key, firstname text, lastname text,amount numeric, exdate date, fwhere text, fhow text, freason text)");
    var query = "SELECT * FROM people WHERE firstname like '%";
	
	//$scope.valuestore = ValuesStore;
	
});

mymod.controller("myCharts",function($scope, $q, $cordovaSQLite,$state, $ionicSideMenuDelegate,$filter,$state, $location) {
	
	//Starts....
	$scope.labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    $scope.series = ['Series A', 'Series B'];
    $scope.data = [
	[],
	[],
	[]
    ];
	var year = new Date();
	$scope.cyear = year.getFullYear();
	$scope.cyear1 = year.getFullYear()-1;
	$scope.cyear2 = year.getFullYear()-2;
	$scope.queryRe = function(ry)
	{
		$scope.data = [
		[],
		[],
		[]
    ];
		var va = [];
		var cou = 1;
		for(y=1;y<=12;y++){
			formattedNumber = ("0" + y).slice(-2);
			va= $scope.testAlert(formattedNumber, $scope.cyear).then(
            function(res){   //success callback
			 $scope.data[0].push(res); //this should be the resolved object
			 //$scope.data[1].push(res);
			 
			 //R start
		
			formattedNumber = ("0" + cou).slice(-2);
			cou++;
			
			if(ry == $scope.cyear){yy=ry-1}else{yy = ry;}
			
			//if($scope.search.cyear1 == true){yy = $scope.cyear1}
			//if($scope.search.cyear2 == true){yy = $scope.cyear2}
			va= $scope.testAlert(formattedNumber, yy).then(
            function(res){   //success callback
			 $scope.data[1].push(res); //this should be the resolved object
			 //$scope.data[1].push(res);
            },
            function(err){   //error callback
			$scope.data[1].push(0);
             console.log(err);  //this should be the rejected object
            }
			);
			
			 
			 //R END
			 
            },
            function(err){   //error callback
			$scope.data[0].push(0);
             console.log(err);  //this should be the rejected object
            }
			);
			//console.log(va+ "results");
		}	
	}
	
	$scope.testAlert = function(d1, ye)
	{
		//var query = "SELECT sum(amount) r FROM people";
			var q = $q.defer();
			var query = "";
			//for(y=1;y<=12;y++){
			//formattedNumber = ("0" + y).slice(-2);
			query = "SELECT  sum(amount) r FROM people WHERE exdate GLOB '*" + ye +"/" + d1 + "/*'";
			$cordovaSQLite.execute(db, query, []).then(function(res) {
			if(res.rows.item(0).r == null){q.resolve(0);return res.rows;}else{q.resolve(parseInt(res.rows.item(0).r));return res.rows;}
			}, function (err) {
			 q.reject(err); 
			console.error("error=>"+err);
			
		});	
			//}
		return q.promise;
	}
	
});