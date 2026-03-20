const express = require('express');
const User = require('./../Models/user');
const { jwtAuthMiddleware, generateToken } = require('../jwt');

const route = express.Router();

// POST route to add a person  signup
route.post('/signup', async (req, res)=>{ 
    try{
        const data = req.body // Assuming the request body contains the person data
    // Create a new User document using the Mongoose model
    const newUser = new User(data); 
    // Save the new user to the database
    const response = await newUser.save()
    console.log('data saved');

    const payload = {
        id: response.id, 
    }

    console.log(JSON.stringify(payload));
    // Generate JWT token
    const token = generateToken(payload);
    console.log('Generated Token:', token);
    res.status(200).json({ response: response, token: token });
    }catch(err){
        console.log(err);
        res.status(500).json({ err: "Internal Server Error" });
    }
})

// Post route to login
route.post('/login', async (req, res)=>{
    try{
        // Extract aadharCardNumber and password from request body
        const { aadharCardNumber, password } = req.body;
        // Find the user by aadharCardNumber
        const user = await User.findOne({ aadharCardNumber: aadharCardNumber });
        // if user does not exist or password does not match
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({ error: 'Invalid aadharCardNumber or password' });
        }
        // Create payload for JWT token
        const payload = {
            id: user.id, 
        }
        const token = generateToken(payload);
        // restun token as response 
        res.json({ token: token });
    }catch(err){
        console.log(err);
        res.status(500).json({ err: "Internal Server Error" });
    }
})

// profile route
route.get('/profile', jwtAuthMiddleware, async (req, res)=>{
    try{
        const userData = req.user; 
        const userId = userData.id;
        // Fetch user details from the database using the userId
        const user = await User.findById(userId); // Assuming you have a User model
        if(!user){
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    }catch(err){
        console.log(err);
        res.status(500).json({ err: "Internal Server Error" });
    }
})




route.put('/profile/password', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Extract the id from the token
        const { oldPassword, newPassword } = req.body; // Extract old and new passwords from the request body

        // Find the user by ID
        const user = await User.findById(userId); // Assuming you have a User model
        // if password does not match, return error
        if(!(await user.comparePassword(oldPassword))){
            return res.status(401).json({ error: 'Invalid aadharCardNumber or password' });
        }
        // Update the user's password
        user.password = newPassword; // Assuming you have a method to hash the password before saving
        await user.save(); // Save the updated user document
        console.log('Password updated successfully');
        res.status(200).json({message: 'Password updated successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: "Internal Server Error" });
    }
});

module.exports = route;
