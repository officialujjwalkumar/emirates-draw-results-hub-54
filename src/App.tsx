
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Mega7 from './pages/Mega7';
import Easy6 from './pages/Easy6';
import Fast5 from './pages/Fast5';
import Blog from './pages/Blog';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/mega7" element={<Mega7 />} />
              <Route path="/easy6" element={<Easy6 />} />
              <Route path="/fast5" element={<Fast5 />} />
              <Route path="/blog" element={<Blog />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster />
      </Router>
    </ThemeProvider>
  );
}

export default App;
