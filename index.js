const express = require("express")
const cors = require("cors")
const app = express()
app.use(cors())
app.use(express.json())
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const configuration = new Configuration({
    apiKey: process.env.CODE_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const completeGenerator = async (inputPrompt, code) => {
    const messages = [{ role: "user", content: code }, { role: "assistant", content: inputPrompt }];
    try {
        if (!code) throw new Error("No input is provided")

        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: messages,
        });

        console.log(completion.data.choices[0].message.content)
        return JSON.stringify(completion.data.choices[0].message.content)
    } catch (error) {
        console.error('Error:', error);
    }
}

app.post("/convert", async (req, res) => {
    const language = req.query.language
    const inputcode = req.body.inputcode
    let response = await completeGenerator(`Convert a code from current language to ${language} language every line should in new line`, inputcode);
    console.log(response);
    res.send(response)

})

app.post("/debug", async (req, res) => {
    const inputcode = req.body.inputcode
    let response = await completeGenerator(`Please Debug the code that is ${inputcode} if there is any error, and explain step by step process to correct it.`, inputcode);
    console.log(response);
    res.send(response)

})

app.post("/qualityCheck", async (req, res) => {
    const inputcode = req.body.inputcode
    let response = await completeGenerator(`Please Check the quality of code that is ${inputcode} if there is any possiblity to optimize the code then give some tips to inprove it`, inputcode);
    console.log(response);
    res.send(response)
})

app.listen(8080, () => {
    console.log("running")
}
)





