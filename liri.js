require("dotenv").config();

// Require Packages
let keys = require("./keys.js")
let axios = require("axios");
let Spotify = require("node-spotify-api");
let myspotify = new Spotify(keys.spotify)
let moment = require("moment");
let fs = require("fs");

// User command and input
let userCommand = process.argv[2];
let userInput = process.argv.slice(3).join(" ");

//Search concert function
function searchConcert() {

    // If have an empty userinput
    if (!userInput) {
        userInput = " ";
    }

    // Cited: the class activity-ombAxios
    // Run a request with axios to an API
    axios.get("https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=codingbootcamp")

        .then(function (response) {
            let data = response.data;
            data.forEach(element => {
                let venueName = "Name of the Venue: " + element.venue.name;
                let venueLocation = "\n" + "Venue Location: " + element.venue.city + ", " + element.venue.country;
                let eventDate = "\n" + "Date of the Event: " + moment(element.datetime).format("L") + "\n";
                let divider = "\n------------------------------------------------------------\n";
                console.log(venueName, venueLocation, eventDate, divider)
            });
        });
}

// Search spotify function
function searchSpotify() {

    // If have an empty user input
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

        let userSong = data.tracks.items;
        console.log("Artist: " + userSong[0].artists[0].name);
        console.log("Song's name: " + userSong[0].name);
        console.log("Preview link of the song from Spotify: " + userSong[0].preview_url);
        console.log("The album that the song is from: " + userSong[0].album.name);
        console.log("\n---------------------------------------------------------------\n");
    });
};

// Search movie function
function searchMovie() {

    // If catch an empty userinput
    if (!userInput) {
        userInput = "Mr. Nobody";
        console.log("If you haven't watched 'Mr. Nobody,' then you should: <http://www.imdb.com/title/tt0485947/>");
        console.log("It's on Netflix!");
    }

    // Cited: the class activity-ombAxios
    // Run a request with axios to an API
    axios.get("http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=trilogy")
        .then(function (response) {

            console.log("Title: " + response.data.Title);
            console.log("Year Released: " + response.data.Year);
            console.log("IMDB rating: " + response.data.imdbRating);
            console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
            console.log("Country where the movie was produced: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Cast: " + response.data.Actors);
        });
};

// Access random.txt
function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (err, data) {

        if (err) {
            console.log(err);
        }

        let readArray = data.split(",");

        userInput = readArray[1];

        searchSpotify(userInput);
    })
};

//Call specific function based on user's command
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
        console.log("Please enter a valid search term, such as concert-this, spotify-this-song, movie-this, or do-what-it-says");
        break;
}