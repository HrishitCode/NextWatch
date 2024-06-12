const express = require("express");
const app = express();
const cors = require('cors');
const axios = require('axios');

const connectt = require('./database/connection')
const Profile = require('./database/Profile')
const Wishlist = require('./database/Wishlist')
const Lists = require('./database/Lists')
const UserLists = require('./database/UserLists')
const WatchedMovies = require('./database/WatchedMovies')


app.use(cors());
app.use(express.json());
connectt();

function midlogin(req, res, next){
    next();
}


app.post('/login', midlogin, async (req, res) => {
    //console.log(req.body);
    try{
        const responsed = await Profile.find({ email: req.body.email}).exec();
        if (responsed.length > 0)
            return res.send({message: 'Already registered'});
    }
    catch(error)
    {
        console.log("some error occurred here");
    }
    const newData = new Profile({
        name: req.body.name,
        email: req.body.email,
        gauth: req.body.sub,
        picture: req.body.picture,
      });
      
      newData.save()
        .then((savedData) => {
          console.log('Data saved successfully:', savedData);
        })
        .catch((error) => {
          console.error('Error saving data:', error);
        });
    const data = { message: 'Saved on the database' };
    res.json(data);   
})

app.post('/addRating', async (req, res) => {
    const { email, movie_ID, rating } = req.body;

    try {
        // Check if the email exists
        const watchedMovie = await WatchedMovies.findOne({ email });

        if (!watchedMovie) {
            // If the email doesn't exist, create a new document
            const newWatchedMovie = new WatchedMovies({
                email,
                movie_id: [movie_ID],
                ratings: [{ movie_id: movie_ID, rating: rating }]
            });
            await newWatchedMovie.save();
            return res.json({ message: 'New entry added successfully' });
        } else {
            // If the email exists, check if the movie ID is already present
            const existingRating = watchedMovie.ratings.find(r => r.movie_id === movie_ID);

            if (existingRating) {
                // If the movie ID exists, update the rating
                existingRating.rating = rating;
                await watchedMovie.save();
                return res.json({ message: 'Rating updated successfully' });
            } else {
                // If the movie ID doesn't exist, add a new rating entry
                watchedMovie.movie_id.push(movie_ID);
                watchedMovie.ratings.push({ movie_id: movie_ID, rating: rating });
                await watchedMovie.save();
                return res.json({ message: 'New rating added successfully' });
            }
        }
    } catch (error) {
        console.error('Error occurred:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.post('/addWishlist', async (req, res) => {
    console.log(req.body);
    const email = req.body.email;
    const movie_ID = req.body.mvid;
    try{
        const responsed = await Wishlist.findOneAndUpdate({ email }, { $push: { movie_id: movie_ID } }, { new: true });
        if (responsed > 0)
            return res.send({message : 'Successfully updated the Wishlist'});
    }
    catch(error)
    {
        console.log("some error occurred here");
    }
    const newData = new Wishlist({
        email: email,
        movie_id: [movie_ID],
      });
      
      newData.save()
        .then((savedData) => {
          console.log('Data saved successfully:', savedData);
        })
        .catch((error) => {
          console.error('Error saving data:', error);
        });
    const data = { message: 'Saved on the database' };
    res.json(data);   
})

app.post('/removeWishlist', async (req, res) => {
    const { email, mvid } = req.body;
    console.log(req.body);
    try {
        const updatedWishlist = await Wishlist.findOneAndUpdate(
            { email },
            { $pull: { movie_id: mvid } },
            { new: true }
        );

        if (!updatedWishlist) {
            return res.status(404).send({ message: 'Wishlist not found' });
        }

        res.send({ message: 'Successfully removed from the Wishlist', updatedWishlist });
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send({ message: 'An error occurred while removing from the Wishlist' });
    }
});



app.post('/showWishlist', async (req, res) => {
    console.log('here :', req.body);
    const emaill = req.body.email;
    try{
        const responsed = await Wishlist.find({email : emaill}).exec();
        console.log(responsed)
        if (responsed)
            return res.send(responsed);
        else {
            return res.status(404).send('Wishlist not found');
        }
    }
    catch(error)
    {
        console.log("some error occurred here");
    }   
})

app.post('/showUserlist', async (req, res) => {
    console.log('here :', req.body);
    const emaill = req.body.email;
    try{
        const responsed = await UserLists.find({email : emaill}).exec();
        console.log(responsed)
        if (responsed)
            return res.send(responsed);
        else {
            return res.status(404).send('Wishlist not found');
        }
    }
    catch(error)
    {
        console.log("some error occurred here");
    }   
})

app.post('/showlist', async (req, res) => {
    console.log('here :', req.body);
    async function findListById(listId) {
        try {
            const list = await Lists.findById(listId);
            if (!list) {
                console.log('List not found');
                return null; 
            }
            return res.send(list);
        } catch (error) {
            console.error('Error finding list by ID:', error);
            throw error;
        }
    }   
    findListById(req.body.id)
})

app.post('/addlist', async (req, res) => {
    console.log(req.body);
    const email = req.body.email;
    const list_name = req.body.newListName;
    const newData = new Lists({
        Name: list_name,
        movie_id: [],
    });
    const savedData = await newData.save();
    const doc_id = savedData._id;
    const updatedUserLists = await UserLists.findOneAndUpdate(
        { email },
        { $push: { list_id: doc_id } },
        { new: true }
    );
    if (updatedUserLists) {
        console.log('Successfully updated the UserLists:', updatedUserLists);
    } else {
        const newData1 = new UserLists({
            email: email,
            list_id: [doc_id],
          });
          const savedData1 = await newData1.save();
        console.log('Data saved successfully:', savedData1);
        }
    const data = [doc_id, list_name];
    res.json(data);   
})

app.post('/addtolist', async (req, res) => {
    console.log("ADDING the movie to the list : ", req.body);
    const lid = req.body.listID;
    const movie_ID = req.body.movie;
    try{
        const responsed = await Lists.findOneAndUpdate({ _id : lid }, { $push: { movies : movie_ID } }, { new: true });
        if (responsed)
            return res.send({message : 'Successfully updated the List'});
        else {
            return res.status(404).send('List not found');
        }
    }
    catch(error)
    {
        console.log("some error occurred here");
    }   



})

app.listen(3001, ()=>{
    console.log("Port is running");
})