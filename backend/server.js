const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB (Make sure to change this with your MongoDB connection string)
mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// AWS S3 Configuration
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Admin Schema
const adminSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const Admin = mongoose.model('Admin', adminSchema);

// MongoDB model (schema for storing image URLs)
const ImageSchema = new mongoose.Schema({
    imageUrl: String,
});
const Image = mongoose.model('Image', ImageSchema);

// Admin Login
app.post('/api/admin/login', async (req, res) => {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (admin && bcrypt.compareSync(password, admin.password)) {
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Image Upload
app.post('/api/upload', upload.array('images', 10), async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
    }

    const promises = req.files.map(file => {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: file.originalname,
            Body: file.buffer,
            // ACL: 'public-read',
        };
        return s3.upload(params).promise();
    });

    try {
        const data = await Promise.all(promises);
        const urls = data.map(file => file.Location);

        // Save URLs to database (optional)
        // await UserImage.insertMany(urls.map(url => ({ url })));

        res.status(200).json({ message: 'Images uploaded successfully', urls });
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ error: 'Failed to upload images' });
    }
});

// Save image URLs to MongoDB from users
app.post('/api/userUpload', async (req, res) => {
    try {
        const { imageUrls } = req.body; // Array of image URLs from the frontend

        // Insert multiple image URLs into MongoDB
        const imageDocs = imageUrls.map(url => ({ imageUrl: url }));
        await Image.insertMany(imageDocs);

        res.status(200).json({ message: 'Image URLs saved successfully' });
    } catch (error) {
        console.error('Error saving image URLs:', error);
        res.status(500).json({ message: 'Error saving image URLs' });
    }
});

// Get all images from MongoDB submitted by user
app.get('/api/userImages', async (req, res) => {
    try {
        const images = await Image.find(); // Fetch all image documents
        res.status(200).json(images); // Return images as JSON
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ message: 'Error fetching images' });
    }
});


// GET endpoint to fetch images
app.get('/api/images', async (req, res) => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
    };

    try {
        const data = await s3.listObjectsV2(params).promise();
        const imageUrls = data.Contents.map(item => {
            return `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${item.Key}`;
        });
        res.status(200).json(imageUrls);
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ error: 'Failed to fetch images' });
    }
});

// Get Images for Admin
app.get('/api/admin/images', async (req, res) => {
    const images = await UserImage.find();
    res.json(images);
});

// Submit User Selected Images
app.post('/api/user-submit', async (req, res) => {
    const { selectedImages } = req.body;
    // Handle user-selected images (e.g., save to database or send notification)
    res.json({ message: 'Images submitted successfully' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
