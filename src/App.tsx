import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Faith from './pages/Faith';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import Programs from './pages/Programs';
import Sermons from './pages/Sermons';
import Testimonies from './pages/Testimonies';
import Devotions from './pages/Devotions';
import AdminDevotions from './pages/AdminDevotions';
import Give from './pages/Give';
import Contact from './pages/Contact';
import Developer from './pages/Developer';
import Children from './pages/Children';
import Leadership from './pages/Leadership';
import MissionKasubi from './pages/MissionKasubi';
import ScrollToTop from './components/ScrollToTop';
import AnalyticsTracker from './components/AnalyticsTracker';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <AnalyticsTracker />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="faith" element={<Faith />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetails />} />
          <Route path="programs" element={<Programs />} />
          <Route path="sermons" element={<Sermons />} />
          <Route path="testimonies" element={<Testimonies />} />
          <Route path="devotions" element={<Devotions />} />
          <Route path="admin-portal-secret" element={<AdminDevotions />} />
          <Route path="give" element={<Give />} />
          <Route path="contact" element={<Contact />} />
          <Route path="developer" element={<Developer />} />
          <Route path="children" element={<Children />} />
          <Route path="leadership" element={<Leadership />} />
          <Route path="mission-kasubi" element={<MissionKasubi />} />
        </Route>
      </Routes>
    </>
  );
}
