import { Routes, Route } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/react";  // ← was /next, now /react
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Faith from './pages/Faith';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import Programs from './pages/Programs';
import Sermons from './pages/Sermons';
import Give from './pages/Give';
import Contact from './pages/Contact';
import Developer from './pages/Developer';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="faith" element={<Faith />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetails />} />
          <Route path="programs" element={<Programs />} />
          <Route path="sermons" element={<Sermons />} />
          <Route path="give" element={<Give />} />
          <Route path="contact" element={<Contact />} />
          <Route path="developer" element={<Developer />} />
        </Route>
      </Routes>
      <Analytics />  {/* ← added here, outside Routes so it's always mounted */}
    </>
  );
}
