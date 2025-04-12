import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ImageGrid from './components/ImageGrid';
import ImageDetail from './components/ImageDetail';
import About from './components/About';

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout searchTerm={searchTerm} onSearchChange={setSearchTerm} />}>
          <Route index element={<ImageGrid searchTerm={searchTerm} />} />
          <Route path="/about" element={<About />} />
          <Route path="/:slug" element={<ImageDetail />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;