import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserImageSelection() {
    const [images, setImages] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            const response = await axios.get('/api/admin/images');
            setImages(response.data);
        };
        fetchImages();
    }, []);

    const handleSelectImage = (image) => {
        setSelectedImages((prev) => [...prev, image]);
    };

    const handleSubmitImages = async () => {
        try {
            await axios.post('/api/user-submit', { selectedImages });
            alert('Images submitted successfully');
        } catch (error) {
            console.error('Error submitting images', error);
        }
    };

    return (
        <div>
            <h1>Select Images</h1>
            <div className="grid grid-cols-3 gap-4">
                {images.map((image) => (
                    <img
                        key={image.id}
                        src={image.url}
                        alt="Thumbnail"
                        className="cursor-pointer"
                        onClick={() => handleSelectImage(image)}
                    />
                ))}
            </div>
            <button onClick={handleSubmitImages}>Submit Selected Images</button>
        </div>
    );
}

export default UserImageSelection;
