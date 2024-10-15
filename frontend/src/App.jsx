import ImageGallery from './components/ImageGallery';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white text-center shadow-md">
        <h1 className="text-3xl font-bold">Image Proofing System</h1>
        <p className="mt-2 text-lg">Select and approve your images below</p>
      </header>
      <main className="p-8">
        <ImageGallery />
      </main>
      <footer className="fixed bottom-0 left-0 w-full bg-gray-800 text-white text-center p-4">
      <p>© 2024 Your Website. All rights reserved.</p>
    </footer>
    </div>
  );
}

export default App;
