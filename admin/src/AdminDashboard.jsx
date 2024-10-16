import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AiOutlineClose } from 'react-icons/ai';

function AdminDashboard() {
    const [selectedImages, setSelectedImages] = useState([]);
    const [submittedImages, setSubmittedImages] = useState([]); // State for submitted images
    const [uploadSuccess, setUploadSuccess] = useState(false);

    // Fetch submitted image URLs from MongoDB
    useEffect(() => {
        const fetchSubmittedImages = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/userImages'); // Adjust the URL as needed
                setSubmittedImages(response.data);
            } catch (error) {
                console.error('Error fetching submitted images:', error);
            }
        };

        fetchSubmittedImages();
    }, []);

    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);
        setSelectedImages((prevImages) => [...prevImages, ...files]);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        selectedImages.forEach((image) => {
            formData.append('images', image);
        });

        try {
            const response = await axios.post('http://localhost:5000/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data);
            setUploadSuccess(true);
            setSelectedImages([]); // Clear selected images on success
        } catch (error) {
            console.error('Error uploading images', error);
        }
    };

    const removeImage = (index) => {
        setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">Admin Dashboard</h1>
            <div className="mb-4">
                <label className="block text-lg font-semibold mb-2">Select Images:</label>
                <input 
                    type="file" 
                    multiple 
                    onChange={handleImageChange} 
                    className="block w-full border border-gray-300 rounded-md p-3 bg-gray-50 hover:bg-gray-100 transition duration-300"
                />
            </div>
            <div className="mb-4 flex flex-wrap gap-2">
                {selectedImages.map((image, index) => (
                    <div key={index} className="relative">
                        <img 
                            src={URL.createObjectURL(image)} 
                            alt={`preview ${index + 1}`} 
                            className="w-16 h-16 object-cover rounded-md" 
                        />
                        <button 
                            onClick={() => removeImage(index)} 
                            className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 text-xs"
                        >
                            <AiOutlineClose className="w-3 h-3" />
                        </button>
                    </div>
                ))}
            </div>
            <button 
                onClick={handleUpload} 
                className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300"
            >
                Upload Images
            </button>
            {uploadSuccess && <h2 className="mt-4 text-green-500 text-center font-medium">Uploaded Successfully!</h2>}

            {/* Section to display submitted images */}
            <h2 className="text-2xl font-bold text-center mt-6 mb-4">Submitted Images</h2>
            <div className="flex flex-wrap gap-2">
                {submittedImages.map((image, index) => (
                    <div key={index} className="relative">
                        <img 
                            src={image.imageUrl} // Adjust based on your API response structure
                            alt={`submitted ${index + 1}`} 
                            className="w-16 h-16 object-cover rounded-md" 
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminDashboard;
