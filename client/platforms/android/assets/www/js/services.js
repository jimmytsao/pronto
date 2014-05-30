angular.module('starter.services', ['LocalStorageModule'])


.factory('ServerUrls', function(){
  return {
    url: 'http://localhost:3000'
    // url: 'http://prontoeats.azurewebsites.net'
  };
})
.factory('UserActiveRequest', function($http, localStorageService,ServerUrls){
   var all = function(){
     var userId = localStorageService.get('userId');
     var accessToken = localStorageService.get('token');
     var url = ServerUrls.url+'/requests?userId='+userId+'&accessToken='+accessToken;
     return $http({
       method: 'GET',
       url: url
     });
   };

  var reject = function(requestId, businessId){
    console.log(requestId, businessId);
    return $http({
      method: 'POST',
      url: ServerUrls.url+'/requests/reject',
      data: {
        requestId: requestId,
        businessId: businessId,
        userId: localStorageService.get('userId'),
        accessToken: localStorageService.get('token')
      }
    })
  };

  var accept = function(requestId, businessId){
    console.log('user accept: ', requestId, businessId);
    return $http({
      method: 'POST',
      url: ServerUrls.url+'/requests/accept',
      data: {
        requestId: requestId,
        businessId: businessId,
        userId: localStorageService.get('userId'),
        accessToken: localStorageService.get('token')
      }
    })
  };

 return {
     all:all,
     accept: accept,
     reject: reject
   };
})

.factory('ActiveTestData', function(){
  var summaryData = {
    distance: 5,
    location: 'Current Location',
    groupSize: 3,
    mins: 15
  };

  var offersData = [
    {
      businessName: 'Jims',
      address: '1452 Howard St',
      distance: 0.23,
      offer: '20% off'
    },
    {
      businessName: 'Joes',
      address: '1234 Market St',
      distance: 0.45,
      offer: '15% off'
    },
    {
      businessName: 'Jeffs',
      address: '944 Market St',
      distance: 0.75,
      offer: '30% off'
    }
  ]
  return summaryData;
})

.factory('OffersTestData', function(){
  var offersData = [
    {
      businessName: 'Jims',
      address: '1452 Howard St',
      distance: 0.23,
      offer: '20% off'
    },
    {
      businessName: 'Joes',
      address: '1234 Market St',
      distance: 0.45,
      offer: '15% off'
    },
    {
      businessName: 'Jeffs',
      address: '944 Market St',
      distance: 0.75,
      offer: '30% off'
    }
  ]
  return offersData;
})


//Get the longitude and latitude coordinates from device GPS
.factory('GetLocation', function($q) {

  var longLat = function(){

    //create a promise since getting the position is an asynch
    var deferred = $q.defer();

    navigator.geolocation.getCurrentPosition(
      function(pos) {
        deferred.resolve([pos.coords.longitude, pos.coords.latitude])
        }, function(error) {
          alert('Unable to get location: ' + error.message);
      }
    );
    //return promise object
    return deferred.promise;
  }

  //return factory object
  return {
    longLat: longLat
  };
})



.factory('ExistingOffers', function($http, localStorageService,ServerUrls) {
  // Might use a resource here that returns a JSON array
  var all = function(){
    var businessId = localStorageService.get('restaurantId');
    var accessToken = localStorageService.get('token');
    var url = ServerUrls.url+'/business/offered?businessId='+businessId+
      '&accessToken='+accessToken;

    return $http({
      method:'GET',
      url: url
    });
  }

  // get: function(existingOfferId) {
  //   // Simple index lookup
  //   return existingOffers[existingOfferId];
  // }

  return {
    all: all
  };
})

.factory('Requests', function($http, localStorageService, $location, ServerUrls) {
  // Might use a resource here that returns a JSON array
  // GET Request with route

  // Some fake testing data
  // var requests = [
  //   { id: 0, name: 'Scruff McGruff', party: '5', time: '15'},
  //   { id: 1, name: 'G.I. Joe', party: '2', time: '30' },
  //   { id: 2, name: 'Miss Frizzle', party: '3', time: '15' },
  //   { id: 3, name: 'Ash Ketchum', party: '6', time: '45' }
  // ];

  var all = function(){
    var businessId = localStorageService.get('restaurantId');
    var accessToken = localStorageService.get('token');
    var url = ServerUrls.url+'/business/requests?businessId='+businessId+'&accessToken='+accessToken;

    return $http({
      method:'GET',
      url: url
    })
  };

  var get = function(requests, requestId) {
    // Simple index lookup
    for(var i =0; i<requests.length; i++){
      if (requests[i].requestId === requestId*1){
        return requests[i];
      }
    }
  }

  var go = function(request){
    path = 'rest/request/' + request.requestId;
    $location.path(path);
  };

  var decline = function(request){
    console.log(request.requestId);
    return $http({
      method: 'POST',
      url: ServerUrls.url+'/business/requests/decline',
      data: {
        requestId: request.requestId,
        businessId: localStorageService.get('restaurantId'),
        accessToken: localStorageService.get('token')
      }
    })
  };

  var accept = function(requestId, offer){
    console.log(requestId, offer);
    return $http({
      method: 'POST',
      url: ServerUrls.url+'/business/requests/accept',
      data: {
        requestId: requestId,
        offer:  offer,
        businessId: localStorageService.get('restaurantId'),
        accessToken: localStorageService.get('token')
      }
    })
  };

  return {
    all: all,
    get: get,
    go: go,
    decline:decline,
    accept: accept
  };
})

.factory('AcceptedOffers', function($http, localStorageService, ServerUrls) {

  var all = function(){
    var businessId = localStorageService.get('restaurantId');
    var accessToken = localStorageService.get('token');
    var url = ServerUrls.url+'/business/accepted?businessId='+businessId+
      '&accessToken='+accessToken;

    return $http({
      method:'GET',
      url: url
    });
  }

  return {
    all: all
  };
})