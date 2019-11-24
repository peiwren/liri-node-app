require("dotenv").config();

// Require Packages
var keys = require("./keys.js")
var axios = require("axios");
var Spotify = require("node-spotify-api");
var myspotify = new Spotify(keys.spotify)
var moment = require("moment");
var fs = require("fs");

// User Input
var userCommand = process.argv[2];
// var userInput = process.argv[3];
var userInput = process.argv.slice(3).join(" ");

//Search Concert function
function searchConcert() {

    if (userInput !== true) {
        userInput = "Slayer";
    }

    // Cited: the class activity ombAxios
    // Run a request with axios to an API
    axios.get("https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=codingbootcamp")
        .then(function (response) {
            for (var i = 0; i < response.data.length; i++) {
                console.log("Name of the Venue: " + response.data[i].venue.name);
                console.log("Venue Location: " + response.data[i].venue.city + ", " + response.data[i].venue.country);
                console.log("Date of the Event: " + moment(response.data[i].datetime).format("L"));
                console.log("\n---------------------------------------------------------------\n");
            }
        });
}

// Search Spotify Function
function searchSpotify() {

    // If have an empty userinput
    if (!userInput) {
        userInput = "'The Sign' by Ace of Base";
    }

    myspotify.search({
        type: "track",
        query: userInput,
        limit: 3
    }, function (err, data) {
        if (err) {
            console.log(err);
        }

        var userSong = data.tracks.items;
        console.log("Artist: " + userSong[0].artists[0].name);
        console.log("Song's name: " + userSong[0].name);
        console.log("Preview link of the song from Spotify: " + userSong[0].preview_url);
        console.log("The album that the song is from: " + userSong[0].album.name);
        console.log("\n---------------------------------------------------------------\n");
    });
};


// Search Movie Function
function searchMovie() {

    // If catch an empty userinput
    if (!userInput) {
        userInput = "Mr. Nobody";
        console.log("If you haven't watched 'Mr. Nobody,' then you should: <http://www.imdb.com/title/tt0485947/>");
        console.log("It's on Netflix!");
    }

    // Cited: the class activity ombAxios
    // Run a request with axios to an API
    axios.get("http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=trilogy")
        .then(function (response) {

            console.log("Title: " + response.data.Title);
            console.log("Year Released: " + response.data.Year);
            console.log("IMDB rating: " + response.data.imdbRating);
            console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
            console.log("Country/Countries Produced: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Cast: " + response.data.Actors);
        });
};

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (err, data) {

        if (err) {
            console.log(err);
        }

        var readArray = data.split(",");

        userInput = readArray[1];

        searchSpotify(userInput);
    })
};

//Call specific function based on users command
switch (userCommand) {
    case "concert-this":
        searchConcert();
        break;
    case "spotify-this-song":
        searchSpotify();
        break;
    case "movie-this":
        searchMovie();
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
    default:
        console.log("Please enter a valid search term, such as {concert-this},");
        console.log("{spotify-this-song}, {movie-this}, or {do-what-it-says}");
        break;
}