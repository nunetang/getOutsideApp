$(document).ready(function(){
    $('#search').click(function() {
        var inputText = $('.validate').val();
        var queryURL = "https://data.seattle.gov/resource/j9km-ydkc.json?name=" + inputText;
        var results = $('#results');
        
        $.ajax({
            url:queryURL,
            method:"GET"
        }).then(function(response){
            var responseString = JSON.stringify(response);
            results.text(responseString);
            // console.log(response);
        });
    });

    var featuresURL = "https://data.seattle.gov/resource/j9km-ydkc.json?";
    var results = $('#results');
    $.ajax({
        url: featuresURL,
        method: "GET"
    }).then(function(response){
        
        var i;
        var featuresList = [];
        for (i = 0; i < response.length; i++) {
            featuresList.push(response[i]['feature_desc']);
            }
            featuresList.sort();
            var newfeaturesList = featuresList.filter(function(elem, index, self) {
                return index === self.indexOf(elem);
            });
            newfeaturesList.forEach(element => $("#parkfeatures").append("<option value=\""+element+"\">"+element+"</option>"));   
})

// $('.park-search').click(function() {
//     var inputText = $('#search-input').val();
//     console.log(inputText);
//     var queryURL = "https://data.seattle.gov/resource/j9km-ydkc.json?name=" + inputText;
//     var results = $('#results');
    
//     $.ajax({
//         url:queryURL,
//         method:"GET"
//     }).then(function(response){
//         var responseString = JSON.stringify(response);
//         results.text(responseString);
//     });
// });
$('#parkfeatures').click(function() {
    var featureText = $('#parkfeatures').val();
    console.log(featureText);
    var queryURL = "https://data.seattle.gov/resource/j9km-ydkc.json?feature_desc=" + featureText;
    var results = $('#results');
    $.ajax({
        url:queryURL,
        method:"GET"
    }).then(function(response){
        var responseString = JSON.stringify(response);
        results.text(responseString);
});
})

$('#maxDistance').click(function() {
    $('#results').empty();
    console.log($('#maxDistance').val())
    var inputText =$('#maxDistance').val();
    var queryURL = "https://data.seattle.gov/resource/j9km-ydkc.json?"
    // var results = $('.container');

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
    }
    else{
        alert("Geolocation is not allowed")}

function successFunction(position) {
            let currentLat = position.coords.latitude;
            let currentLon = position.coords.longitude;

    
    $.ajax({
        url:queryURL,
        method:"GET"
    }).then(function(response){
        let DistanceList =[];
        for (i = 0; i < response.length; i++){
            parkLat = response[i].ypos;
            parkLon = response[i].xpos;
            var radlat1 = Math.PI * currentLat/180;
		var radlat2 = Math.PI * parkLat/180;
		var theta = currentLon-parkLon;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
    
        
        if (!dist == NaN || dist <= inputText){

            DistanceList.push(response[i].name);
        }
        }
        if(DistanceList.length == 0){
            DistanceList.push("No parks within your mile search of current location")
        }
        Unique = [...new Set(DistanceList)];

        Unique.sort();

        for (i = 0; i < Unique.length; i++){
            console.log(Unique[i]);
            let parkDiv = $('<div>').text(Unique[i])
            $(parkDiv).addClass("park");

            $('.container').append(parkDiv );
        }
       

        
    });

};
function errorFunction(error){
    switch(error.code) {
        case error.PERMISSION_DENIED:
          alert("User denied the request for Geolocation.")
          break;
        case error.POSITION_UNAVAILABLE:
          alert("Location information is unavailable.")
          break;
        case error.TIMEOUT:
          alert("The request to get user location timed out.")
          break;
        case error.UNKNOWN_ERROR:
          alert("An unknown error occurred.")
          break;
      }
}

});

  });