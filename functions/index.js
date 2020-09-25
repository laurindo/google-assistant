const functions = require('firebase-functions');
const {dialogflow, SimpleResponse} = require('actions-on-google');
const Axios = require("axios");
const WEATHER_API_KEY = "4616ac2a0ff236ccd75eb023db6b81ea";

const app = dialogflow({debug: true});

const responseBuilder = (msg) => ({
    fulfillmentMessages: [{ text: { text: [msg] } }],
});

app.intent("FoodAppQuestionIntent", conv => {
    conv.ask(new SimpleResponse({
        speech: "Hi, I'm testing",
        text: "Hi, I'm testing"
    }));
});

exports.chatWebhook = functions.https.onRequest((req, res) => {
    let body = req.body;
    let { parameters, action } = body.queryResult;

    if (action === "askFoodQuestion") {
        functions.logger.info("Hello logs!", {action});
        app.intent("FoodAppQuestionIntent", (conv, {color, number}) => {
            conv.close("Olá, so testando");
        });
        res.json(responseBuilder("iFood ou Uber Eats"));
    }

    if (action !== "askWeather") return res.json(responseBuilder("Unable to process your query"));

    let city = parameters["geo-city"];
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}`;

    return Axios.post(url)
        .then((result) => result.data)
        .then((data) => `The temperature is  ${Math.round(data.main.temp - 273.15)} °C`)
        .then((message) => res.json(responseBuilder(message)))
        .catch((err) => res.json(responseBuilder(err.message)));
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
