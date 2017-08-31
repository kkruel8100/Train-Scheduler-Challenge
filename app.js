$(document).ready(function() {

  //Timepicker for 24 hour format
  var timepicker = new TimePicker('time', {
  lang: 'en',
  theme: 'dark'
  });
  timepicker.on('change', function(evt) { 
  var value = (evt.hour || '00') + ':' + (evt.minute || '00');
  evt.element.value = value;
  });


  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyD6E1dx5DRgEFMHztPCk2eBjCfRlkOG-5k",
    authDomain: "train-scheduler-336a3.firebaseapp.com",
    databaseURL: "https://train-scheduler-336a3.firebaseio.com",
    projectId: "train-scheduler-336a3",
    storageBucket: "train-scheduler-336a3.appspot.com",
    messagingSenderId: "118713276930"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  // Initial Values
    var trainName = "";
    var destination = "";
    var time = "";
    var frequency = "";
    var nextArrival = "";
    var minAway = "";

    // Capture Button Click
    $("#submit").on("click", function(event) {
      event.preventDefault();
      
      trainName = $("#train_input").val().trim();
      destination = $("#destination_input").val().trim();
      time = $("#time").val().trim();
      frequency = $("#frequency_input").val().trim();

      // Code for the push
      database.ref().push({
        trainName: trainName,
        destination: destination,
        time: time,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });

      // Code to clear input fields
      $("#train_input").val("");
      $("#destination_input").val("");
      $("#time").val("");
      $("#frequency_input").val("");

    });

    // Update Train Schedule
    database.ref().on("child_added", function(childSnapshot) {

    //Train first time
    var time = childSnapshot.val().time.trim();
    var timeConverted = moment(time, "H:mm");
    
    //Difference between first train and now
    var diffTime = moment().diff(moment(timeConverted), "minutes");
    
    //Train frequency
    var frequency = childSnapshot.val().frequency.trim();
    //Remainder of the difference between now and first train divided by frequency
	var timeRemainder = diffTime % frequency;
    //Minutes until next train
    var minNextTrain = frequency - timeRemainder;
    //Next train time
   	var nextTrain = moment().add(minNextTrain, "minutes");

    // full list of trains
       $("#trainList").append("<tr><td> " + childSnapshot.val().trainName +
         " </td><td> " + childSnapshot.val().destination +
         " </td><td> " + childSnapshot.val().frequency +
         " </td><td> " + nextTrain.format("h:mm A") +
         " </td><td> " + minNextTrain + " </td></tr>");

     // Handle the errors
     }, function(errorObject) {
       console.log("Errors handled: " + errorObject.code);
    });

});//document ready