const express = require('express');
const bodyParser = require('body-parser');
const { WebhookClient } = require('dialogflow-fulfillment');
//const { dialogFlow } = require("actions-on-google");

//const app = dialogFlow();
const app = express();
app.use(bodyParser.json());

app.post("/", (req, res) => {

    let body = req.body;
    let { parameters, action, fulfillmentMessages } = body.queryResult;

    const responseBuilder = (msg) => ({
        fulfillmentMessages: [{ text: { text: [msg] } }],
    });

    async function welcome(assistant) {
        const conv = assistant.conv();
        conv.ask("Ola, o que voce gostaria?");
        return assistant.add(conv);
    }
    
    async function test(assistant) {
        const conv = assistant.conv();
        conv.close("iFood ou Uber Eats");
        return assistant.add(conv);
    }

    const assistant = new WebhookClient({
        request: req,
        response: res
    });

    const intentMap = new Map();
    intentMap.set("input.welcome", welcome);
    intentMap.set("askFoodQuestion", test);

    if (fulfillmentMessages) return res.json(responseBuilder("iFood ou Uber Eats"));
    assistant.handleRequest(intentMap.get(assistant.action));
});

app.listen(process.env.PORT || 3002, () => {
    console.log("running on http://localhost:3002");
});