import { useState, useEffect } from 'react';
import axios from 'axios';

function ImageGallery() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/images');
        const imagesWithSelectedState = response.data.map(url => ({
          url,
          selected: false,
        }));
        setImages(imagesWithSelectedState);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  const toggleSelect = (index) => {
    setImages((prevImages) =>
      prevImages.map((image, i) =>
        i === index ? { ...image, selected: !image.selected } : image
      )
    );
  };

  const handleSubmit = async () => {
    const selectedImageUrls = images
      .filter(image => image.selected) // Filter selected images
      .map(image => image.url); // Extract only the URLs

    try {
      const response = await axios.post('http://localhost:5000/api/userUpload', {
        imageUrls: selectedImageUrls, // Send URLs to backend
      });
      console.log("images uploaded successfully")
      console.log(response.data);
    } catch (error) {
      console.error('Error submitting image URLs:', error);
    }
  };


  return (
    <div className="relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((image, index) => (
          <div
            key={index}
            onClick={() => toggleSelect(index)}
            className={`relative border-2 border-gray-200 rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:scale-125 hover:z-10 hover:shadow-xl cursor-pointer`}
          >
            <img src={image.url} alt="Preview" className="w-full h-56 object-cover" />
            <div
              className={`absolute inset-0 flex items-center justify-center ${image.selected ? 'bg-green-500 opacity-75' : 'bg-transparent'
                } transition duration-300`}
            >
              {image.selected && (
                <span className="text-white text-3xl font-bold">Selected</span>
              )}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="fixed z-50 bottom-16 right-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg"
      >
        Submit Selected Images
      </button>
    </div>
  );
}

export default ImageGallery;
