// Initialize Firebase
var config = {
    apiKey: "AIzaSyCTk5fL93gTvSzSkzydtIPZUplnCwnyJDw",
    authDomain: "trainscheduler-b7ac8.firebaseapp.com",
    databaseURL: "https://trainscheduler-b7ac8.firebaseio.com",
    projectId: "trainscheduler-b7ac8",
    storageBucket: "trainscheduler-b7ac8.appspot.com",
    messagingSenderId: "105004734488"
};
firebase.initializeApp(config);

var database = firebase.database();

var trainName="";
var trainDestination="";
var firstTrainTime = "";
var trainFrequency = "";
var nextTrain = "";
var nextTrainFormatted = "";
var minutesAway = "";
var firstTimeConverted = "";
var currentTime = "";
var diffTime = "";
var tRemainder = "";
var minutesTillTrain = "";
var keyHolder = "";
var getKey = "";

$(document).ready(function(){

    $("#add-train").on("click", function(){
       event.preventDefault();

       trainName = $("#name-input").val().trim();
       trainDestination = $("#destination-input").val().trim();
       firstTrainTime = $("#first-train-time-input").val().trim();
       trainFrequency = $("#frequency-input").val().trim();
       firstTimeConverted=moment(firstTrainTime, "hh:mm").subtract(1, "years");
       currentTime = moment();
       diffTime = moment().diff(moment(firstTimeConverted), "minutes");
       tRemainder = diffTime % trainFrequency;
       minutesTillTrain = trainFrequency - tRemainder;
       nextTrain = moment().add(minutesTillTrain, "minutes");
       nextTrainFormatted = moment(nextTrain).format("hh:mm");

       //database push
        database.ref().push({
            data_name: trainName,
            data_destination: trainDestination,
            data_frequency: trainFrequency,
            data_firstTrainTime: firstTrainTime,
            data_nextTrainFormatted: nextTrainFormatted,
            data_minutesTillTrain: minutesTillTrain
        });
        //refresh the inputs
        //$("#name-input").val('');
        //$('#destination-input').val('');
        //$("#first-train-time-input").val('');
        //$("#frequency-input").val('');

        return false;
    });

    database.ref().on("child_added", function(snapshot){
        $("#train-schedule").append("<tr><td id='name-display'>"+snapshot.val().data_name+
            "</td><td id='destination-display'>"+snapshot.val().data_destination+
            "</td><td id='frequency-display'>"+snapshot.val().data_frequency+
            "</td><td id='nextArrival-display'>"+snapshot.val().data_nextTrainFormatted+
            "</td><td id='minutes-display'>"+snapshot.val().data_minutesTillTrain+"</td></tr>");
    }, function(errorObject){
        console.log("Errors Handled: "+ errorObject.code);
    });


});