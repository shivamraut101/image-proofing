function ImageCard({ image, onToggleSelect }) {
  return (
    <div
      onClick={onToggleSelect}
      className="relative border-2 border-gray-200 rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:scale-125 hover:z-10 hover:shadow-xl cursor-pointer"
    >
      <img src={image.src} alt="Preview" className="w-full h-56 object-cover" />
      <div
        className={`absolute inset-0 flex items-center justify-center ${
          image.selected ? 'bg-green-500 opacity-75' : 'bg-transparent'
        } transition duration-300`}
      >
        {image.selected && (
          <span className="text-white text-3xl font-bold">Selected</span>
        )}
      </div>
    </div>
  );
}

export default ImageCard;
