const bodyParser = require('body-parser');
const { WebhookClient } = require('dialogflow-fulfillment');
const express = require('express');

const app = express();

app.set('port', (process.env.PORT || 3002));
app.use(bodyParser.json({
  type: 'application/json',
}));

app.post("/", (req, res) => {

    async function test(assistant) {
        const conv = assistant.conv();
        conv.close(i18n.t('stopped_collecting_google_analytics'));
        return assistant.add(conv);
    }

    const assistant = new WebhookClient({
        request: req,
        response: res
    });

    const intentMap = new Map();
    intentMap.set("FoodAppQuestionIntent", test);

    //const conv = assistant.conv();
    assistant.handleRequest(intentMap);
});

module.exports = app;