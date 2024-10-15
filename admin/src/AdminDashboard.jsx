import React, { useState } from 'react';
import axios from 'axios';

function AdminDashboard() {
    const [selectedImages, setSelectedImages] = useState([]);

    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);
        setSelectedImages(files);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        selectedImages.forEach((image) => {
            formData.append('images', image);
        });

        try {
            const response = await axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data);
        } catch (error) {
            console.error('Error uploading images', error);
        }
    };

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <input type="file" multiple onChange={handleImageChange} />
            <button onClick={handleUpload}>Upload Images</button>
        </div>
    );
}

export default AdminDashboard;
