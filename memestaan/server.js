const bodyParser = require("body-parser");
const cors = require('cors');
const express = require('express');

const mongoose = rqeuire('mongoose');

const app = express(); 
app.use(cors());
app.use(bodyParser.json);

//connect to MongoDB
mongoose.connect('mongodb://localhost:27017/memeDB', {
    useNewUrlParser: true,
    useUnifiedTopology:true,
}). then(() => console.log('Connected to the MongoDB database')).catch((err) => console.error(connectionError));

// meme Schema

const memeSchema = new mongoose.Schema({
    title: String,
    imageUrl: String,
    upvotes: {type: Number, default: 0},
    downvotes: {type: Number, default: 0},
});

const Meme = mongoose.model('Meme', memeSchema);


//Routes

app.get('/memes', async(req, res) => {
    const memes = await Meme.find();
    res.json(memes);
})

app.post('/memes', async (req, res) => {
    const meme = new Meme(req.body);
    await meme.save();
    res.json(meme);
}) 

app.put('/memes/:id/vote', async (req, res) => {
    const {voteType} = req.body; //upvote or downvote
    const meme = await Meme.findById(req.params.id);
    if(voteType === 'upvote') meme.upvotes++;
    if(voteType === 'downvote') meme.downvotes++;
    await meme.save();
    res.json(meme);
});

const PORT = 5000;
app.listen(PORT,() => console.log(`Server is running on port ${PORT}`));

