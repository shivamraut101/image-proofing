import { useState } from 'react';
import ImageCard from './ImageCard';
import { images } from '../assets/images';

function ImageGallery() {
  const [imageList, setImageList] = useState(images);

  const toggleSelect = (id) => {
    setImageList(prevList =>
      prevList.map(image => image.id === id ? { ...image, selected: !image.selected } : image)
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {imageList.map(image => (
        <ImageCard key={image.id} image={image} onToggleSelect={() => toggleSelect(image.id)} />
      ))}
    </div>
  );
}

export default ImageGallery;
