import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Save, 
  Trash2, 
  Edit3, 
  ChevronLeft, 
  BookOpen, 
  Type, 
  FileText, 
  Lightbulb,
  Calendar,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  Database,
  Download,
  Share,
  Shield,
  Menu,
  X,
  LogOut,
  Image as ImageIcon,
  Heart,
  Link as LinkIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { PROJECT_TYPES, Project, projects as staticProjects } from '../data/projects';
import { Testimony } from './Testimonies';
import { Devotion } from './Devotions';

import ReactMarkdown from 'react-markdown';

type ProgramEvent = {
  time: string;
  name: string;
  desc: string;
};

type ProgramFormData = {
  day: string;
  title: string;
  subtitle: string;
  events: ProgramEvent[];
  highlight: boolean;
  visible: boolean;
  order: number;
};

type ProjectFormData = Omit<Project, 'id'> & {
  id: string;
  documentId?: string;
  visible: boolean;
  order: number;
};

const emptyProgramForm = (): ProgramFormData => ({
  day: '',
  title: '',
  subtitle: '',
  events: [{ time: '', name: '', desc: '' }],
  highlight: false,
  visible: true,
  order: 0,
});

const emptyProjectForm = (): ProjectFormData => ({
  id: '',
  title: '',
  type: 'Evangelism',
  location: '',
  timeframe: '',
  description: '',
  funded: 0,
  image: '',
  fullDescription: '',
  gallery: [''],
  impactStats: [{ label: '', value: '' }],
  stories: [{ quote: '', name: '' }],
  visible: true,
  order: 0,
});

export default function AdminDevotions() {
  const [devotions, setDevotions] = useState<Devotion[]>([]);
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [pendingTestimonies, setPendingTestimonies] = useState<Testimony[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTestimonyId, setEditingTestimonyId] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [isNewTestimony, setIsNewTestimony] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'manager' | 'testimonies' | 'backup' | 'programs' | 'projects'>('manager');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [imageSourceType, setImageSourceType] = useState<'url' | 'upload'>('url');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPendingIds, setSelectedPendingIds] = useState<string[]>([]);
  const navigate = useNavigate();

  // Programs management state
  const [programs, setPrograms] = useState<any[]>([]);
  const [editingProgramId, setEditingProgramId] = useState<string | null>(null);
  const [isNewProgram, setIsNewProgram] = useState(false);
  const [programFormData, setProgramFormData] = useState<ProgramFormData>(emptyProgramForm);

  // Projects management state
  const [managedProjects, setManagedProjects] = useState<ProjectFormData[]>([]);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [isNewProject, setIsNewProject] = useState(false);
  const [projectFormData, setProjectFormData] = useState<ProjectFormData>(emptyProjectForm);

  const handleBulkAction = async (status: 'APPROVED' | 'REJECTED') => {
    if (selectedPendingIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to ${status.toLowerCase()} ${selectedPendingIds.length} testimonies?`)) return;

    try {
      const response = await fetch('/api/admin/bulk-update-pending', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password
        },
        body: JSON.stringify({ ids: selectedPendingIds, status })
      });

      if (response.ok) {
        setPendingTestimonies(prev => prev.filter(t => !selectedPendingIds.includes(t.id)));
        setSelectedPendingIds([]);
        setStatus({ type: 'success', message: `Bulk ${status.toLowerCase()} successful.` });
      } else {
        throw new Error('Bulk update failed');
      }
    } catch (e) {
      setStatus({ type: 'error', message: 'Failed to perform bulk action.' });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    setIsMenuOpen(false);
    navigate('/');
  };

  const activeItemName = activeTab === 'testimonies'
    ? 'Testimony'
    : activeTab === 'programs'
      ? 'Program'
      : activeTab === 'projects'
        ? 'Project'
        : 'Devotion';

  const startNewActiveItem = () => {
    if (activeTab === 'testimonies') {
      startNewTestimony();
    } else if (activeTab === 'programs') {
      startNewProgram();
    } else if (activeTab === 'projects') {
      startNewProject();
    } else {
      startNew();
    }
  };

  // Testimony Form State
  const [testimonyFormData, setTestimonyFormData] = useState<Omit<Testimony, 'id'>>({
    author: '',
    location: 'Unknown',
    content: '',
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    likes: 0,
    projectId: undefined,
    status: 'APPROVED',
    contact: ''
  });

  // Form State
  const [formData, setFormData] = useState<Omit<Devotion, 'id'>>({
    title: '',
    scripture: '',
    content: '',
    nuggets: [''],
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    author: 'Ezekiel Kayondo'
  });

  const sanitizeInput = (str: string) => {
    // Simple sanitization: remove script tags and other dangerous patterns
    return str
      .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
      .replace(/onclick=".*?"/gim, "")
      .replace(/onmouseover=".*?"/gim, "");
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (activeTab === 'manager') {
      if (!formData.title.trim()) newErrors.title = 'Title is required';
      if (formData.title.length > 200) newErrors.title = 'Title is too long (max 200 chars)';
      
      const dateRegex = /^[A-Z][a-z]+ \d{1,2}, \d{4}$/;
      if (!formData.date.trim()) {
        newErrors.date = 'Date is required';
      } else if (!dateRegex.test(formData.date)) {
        newErrors.date = 'Invalid format. Use "Month Day, Year" (e.g., May 13, 2024)';
      }

      if (!formData.scripture.trim()) newErrors.scripture = 'Theme Scripture is required';
      if (!formData.content.trim()) newErrors.content = 'Content is required';
      if (!formData.author.trim()) newErrors.author = 'Author is required';
    } else if (activeTab === 'testimonies') {
      if (!testimonyFormData.author.trim()) newErrors.author = 'Author is required';
      if (!testimonyFormData.content.trim()) newErrors.content = 'Content is required';
      if (!testimonyFormData.date.trim()) newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatus(null);
    try {
      const response = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      if (response.ok) {
        setIsAuthenticated(true);
        setStatus(null);
      } else {
        const data = await response.json();
        setStatus({ type: 'error', message: data.error || 'Incorrect admin password' });
      }
    } catch (e) {
      setStatus({ type: 'error', message: 'Connection error. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const startEdit = (devotion: Devotion) => {
    setEditingId(devotion.id);
    setIsNew(false);
    setFormData({
      title: devotion.title,
      scripture: devotion.scripture,
      content: devotion.content,
      nuggets: devotion.nuggets || [''],
      date: devotion.date,
      author: devotion.author
    });
  };

  const startNew = () => {
    setEditingId('new');
    setIsNew(true);
    setFormData({
      title: '',
      scripture: '',
      content: '',
      nuggets: [''],
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      author: ' Papa Ezekiel Kayondo'
    });
  };

  const addNugget = () => {
    setFormData({ ...formData, nuggets: [...(formData.nuggets || []), ''] });
  };

  const updateNugget = (index: number, value: string) => {
    const newNuggets = [...(formData.nuggets || [])];
    newNuggets[index] = value;
    setFormData({ ...formData, nuggets: newNuggets });
  };

  const removeNugget = (index: number) => {
    const newNuggets = (formData.nuggets || []).filter((_, i) => i !== index);
    setFormData({ ...formData, nuggets: newNuggets.length ? newNuggets : [''] });
  };

  const saveLocal = () => {
    let updatedDevotions: Devotion[];
    if (isNew) {
      const newDevotion: Devotion = {
        ...formData,
        id: Date.now().toString()
      };
      updatedDevotions = [newDevotion, ...devotions];
    } else {
      updatedDevotions = devotions.map(d => d.id === editingId ? { ...formData, id: editingId } : d);
    }
    setDevotions(updatedDevotions);
    setEditingId(null);
    return updatedDevotions;
  };

  const startNewTestimony = () => {
    setEditingTestimonyId('new');
    setIsNewTestimony(true);
    setTestimonyFormData({
      author: '',
      location: 'Unknown',
      content: '',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      likes: 0,
      projectId: undefined,
      status: 'APPROVED',
      contact: ''
    });
  };

  // Programs management helpers
  const startNewProgram = () => {
    setEditingProgramId('new');
    setIsNewProgram(true);
    setProgramFormData({
      ...emptyProgramForm(),
      order: programs.length + 1,
    });
  };

  const startEditProgram = (program: any) => {
    setEditingProgramId(program.id);
    setIsNewProgram(false);
    setProgramFormData({
      day: program.day || program.title || '',
      title: program.title || '',
      subtitle: program.subtitle || '',
      events: Array.isArray(program.events) && program.events.length > 0
        ? program.events.map((event: any) => ({
            time: String(event?.time || ''),
            name: String(event?.name || ''),
            desc: String(event?.desc || ''),
          }))
        : [{ time: program.time || '', name: program.title || '', desc: program.description || '' }],
      highlight: !!program.highlight,
      visible: program.visible !== false,
      order: Number(program.order || 0),
    });
  };

  const startNewProject = () => {
    const nextOrder = managedProjects.length + 1;
    setEditingProjectId('new');
    setIsNewProject(true);
    setProjectFormData({
      ...emptyProjectForm(),
      id: String(nextOrder),
      order: nextOrder,
    });
  };

  const startEditProject = (project: ProjectFormData) => {
    setEditingProjectId(project.documentId || String(project.id));
    setIsNewProject(false);
    setProjectFormData({
      ...emptyProjectForm(),
      ...project,
      id: String(project.id || ''),
      documentId: project.documentId || String(project.id || ''),
      funded: Number(project.funded || 0),
      gallery: project.gallery?.length ? project.gallery : [''],
      impactStats: project.impactStats?.length ? project.impactStats : [{ label: '', value: '' }],
      stories: project.stories?.length ? project.stories : [{ quote: '', name: '' }],
      visible: project.visible !== false,
      order: Number(project.order || project.id || 0),
    });
  };

  const addProgramEvent = () => {
    setProgramFormData({
      ...programFormData,
      events: [...programFormData.events, { time: '', name: '', desc: '' }],
    });
  };

  const updateProgramEvent = (index: number, field: keyof ProgramEvent, value: string) => {
    setProgramFormData({
      ...programFormData,
      events: programFormData.events.map((event, eventIndex) => (
        eventIndex === index ? { ...event, [field]: value } : event
      )),
    });
  };

  const removeProgramEvent = (index: number) => {
    const events = programFormData.events.filter((_, eventIndex) => eventIndex !== index);
    setProgramFormData({
      ...programFormData,
      events: events.length ? events : [{ time: '', name: '', desc: '' }],
    });
  };

  const updateGalleryItem = (index: number, value: string) => {
    setProjectFormData({
      ...projectFormData,
      gallery: projectFormData.gallery.map((item, itemIndex) => itemIndex === index ? value : item),
    });
  };

  const updateImpactStat = (index: number, field: 'label' | 'value', value: string) => {
    setProjectFormData({
      ...projectFormData,
      impactStats: projectFormData.impactStats.map((item, itemIndex) => (
        itemIndex === index ? { ...item, [field]: value } : item
      )),
    });
  };

  const updateStory = (index: number, field: 'quote' | 'name', value: string) => {
    setProjectFormData({
      ...projectFormData,
      stories: (projectFormData.stories || []).map((item, itemIndex) => (
        itemIndex === index ? { ...item, [field]: value } : item
      )),
    });
  };

  const startEditTestimony = (testimony: Testimony) => {
    setEditingTestimonyId(testimony.id);
    setIsNewTestimony(false);
    setTestimonyFormData({
      author: testimony.author,
      location: testimony.location || 'Unknown',
      content: testimony.content,
      date: testimony.date,
      likes: testimony.likes,
      projectId: testimony.projectId,
      status: testimony.status || 'APPROVED',
      contact: testimony.contact || ''
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setStatus({ type: 'error', message: 'Please select an image file.' });
      return;
    }

    setIsUploading(true);
    setStatus(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        headers: {
          'x-admin-password': password
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        // No longer using images for testimonies
        setStatus({ type: 'success', message: 'Image upload is disabled for testimonies.' });
      } else {
        const err = await response.json();
        throw new Error(err.error || 'Upload failed');
      }
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setIsUploading(false);
    }
  };

  const fetchPending = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch('/api/admin/pending-testimonies', {
        headers: { 'x-admin-password': password },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (response.ok) {
        const data = await response.json();
        setPendingTestimonies(data);
      }
    } catch (e: any) {
      console.error("Failed to fetch pending testimonies", e);
    }
  };

  const fetchDevotions = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch('/api/devotions', { signal: controller.signal });
      clearTimeout(timeoutId);
      if (response.ok) {
        const data = await response.json();
        setDevotions(data);
      }
    } catch (e: any) {
      console.error("Failed to fetch devotions", e);
    }
  };

  const fetchApprovedTestimonies = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch('/api/testimonies/approved', { signal: controller.signal });
      clearTimeout(timeoutId);
      if (response.ok) {
        const data = await response.json();
        setTestimonies(data);
      }
    } catch (e: any) {
      console.error("Failed to fetch approved testimonies", e);
    }
  };

  const fetchPrograms = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch('/api/admin/programs', { headers: { 'x-admin-password': password }, signal: controller.signal });
      clearTimeout(timeoutId);
      if (response.ok) {
        const data = await response.json();
        setPrograms(data);
      }
    } catch (e: any) {
      console.error("Failed to fetch programs", e);
    }
  };

  const fetchProjects = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch('/api/admin/projects', { headers: { 'x-admin-password': password }, signal: controller.signal });
      clearTimeout(timeoutId);
      if (response.ok) {
        const data = await response.json();
        setManagedProjects(data);
      }
    } catch (e: any) {
      console.error("Failed to fetch projects", e);
    }
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      fetchDevotions();
      fetchApprovedTestimonies();
      if (activeTab === 'testimonies') {
        fetchPending();
      }
      if (activeTab === 'programs') {
        fetchPrograms();
      }
      if (activeTab === 'projects' || activeTab === 'testimonies') {
        fetchProjects();
      }
    }
  }, [isAuthenticated, activeTab]);

  const fastApprove = async (id: string) => {
    try {
      const response = await fetch('/api/admin/update-pending', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-password': password 
        },
        body: JSON.stringify({ id, status: 'APPROVED' })
      });
      if (response.ok) {
        setPendingTestimonies(prev => prev.filter(t => t.id !== id));
        fetchApprovedTestimonies();
        setStatus({ type: 'success', message: 'Testimony approved successfully!' });
      } else {
        throw new Error('Failed to approve testimony');
      }
    } catch (e) {
      setStatus({ type: 'error', message: 'Failed to approve testimony.' });
    }
  };

  const approvePending = async (testimony: Testimony) => {
    // Open in editor with 'approved' status
    setEditingTestimonyId(testimony.id);
    setIsNewTestimony(false); 
    setTestimonyFormData({
      author: testimony.author,
      location: testimony.location || 'Unknown',
      content: testimony.content,
      date: testimony.date,
      likes: testimony.likes || 0,
      projectId: testimony.projectId,
      status: 'APPROVED',
      contact: testimony.contact || ''
    });
  };

  const rejectPending = async (id: string) => {
    if (!window.confirm("Are you sure you want to reject this submission?")) return;
    
    try {
      const response = await fetch('/api/admin/update-pending', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-password': password 
        },
        body: JSON.stringify({ id, status: 'REJECTED' })
      });
      if (response.ok) {
        setPendingTestimonies(prev => prev.filter(t => t.id !== id));
        setStatus({ type: 'success', message: 'Pending submission rejected.' });
      }
    } catch (e) {
      setStatus({ type: 'error', message: 'Failed to reject submission.' });
    }
  };

  const handleSave = async () => {
    // Programs and projects use nested forms, so they validate inside their own branches.
    if (activeTab !== 'programs' && activeTab !== 'projects' && !validateForm()) {
      setStatus({ type: 'error', message: 'Please fix the errors in the form.' });
      return;
    }

    setIsSaving(true);
    setStatus(null);

    try {
      if (activeTab === 'manager') {
        const data = {
          ...formData,
          id: isNew ? null : editingId,
          title: sanitizeInput(formData.title),
          scripture: sanitizeInput(formData.scripture),
          content: sanitizeInput(formData.content),
          author: sanitizeInput(formData.author),
          nuggets: formData.nuggets?.map(n => sanitizeInput(n))
        };

        const response = await fetch('/api/admin/devotions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-password': password
          },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          await fetchDevotions();
          setEditingId(null);
          setStatus({ type: 'success', message: 'Devotion saved successfully!' });
        } else {
          throw new Error('Failed to save devotion');
        }
      } else if (activeTab === 'testimonies') {
        const isApproving = pendingTestimonies.some(p => p.id === editingTestimonyId);
        
        const data = {
          ...testimonyFormData,
          id: isNewTestimony ? null : editingTestimonyId,
          author: sanitizeInput(testimonyFormData.author),
          content: sanitizeInput(testimonyFormData.content),
          location: sanitizeInput(testimonyFormData.location || 'Unknown'),
          contact: sanitizeInput(testimonyFormData.contact || '')
        };

        const response = await fetch('/api/admin/testimonies', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-password': password
          },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          await fetchApprovedTestimonies();
          if (isApproving) {
            setPendingTestimonies(prev => prev.filter(t => t.id !== editingTestimonyId));
          }
          setEditingTestimonyId(null);
          setStatus({ type: 'success', message: `Testimony ${data.status === 'APPROVED' ? 'approved' : 'saved'} successfully!` });
        } else {
          throw new Error('Failed to save testimony');
        }
      } else if (activeTab === 'programs') {
        // Basic validation
        if (!programFormData.day || !programFormData.title) {
          setStatus({ type: 'error', message: 'Day and title are required for a program.' });
          setIsSaving(false);
          return;
        }

        const data = {
          ...programFormData,
          id: isNewProgram ? null : editingProgramId,
          day: sanitizeInput(programFormData.day),
          title: sanitizeInput(programFormData.title),
          subtitle: sanitizeInput(programFormData.subtitle || ''),
          events: programFormData.events
            .map((event) => ({
              time: sanitizeInput(event.time),
              name: sanitizeInput(event.name),
              desc: sanitizeInput(event.desc),
            }))
            .filter((event) => event.time || event.name || event.desc),
          highlight: !!programFormData.highlight,
          visible: programFormData.visible !== false,
          order: Number(programFormData.order || 0),
        };

        const response = await fetch('/api/admin/programs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-password': password
          },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          await fetchPrograms();
          setEditingProgramId(null);
          setIsNewProgram(false);
          setStatus({ type: 'success', message: 'Program saved successfully!' });
        } else {
          throw new Error('Failed to save program');
        }
      } else if (activeTab === 'projects') {
        if (!projectFormData.title || !projectFormData.type) {
          setStatus({ type: 'error', message: 'Project title and type are required.' });
          setIsSaving(false);
          return;
        }

        const data = {
          ...projectFormData,
          documentId: isNewProject ? null : editingProjectId,
          id: sanitizeInput(String(projectFormData.id || '')),
          title: sanitizeInput(projectFormData.title),
          type: projectFormData.type,
          location: sanitizeInput(projectFormData.location),
          timeframe: sanitizeInput(projectFormData.timeframe),
          description: sanitizeInput(projectFormData.description),
          funded: Number(projectFormData.funded || 0),
          image: sanitizeInput(projectFormData.image),
          fullDescription: sanitizeInput(projectFormData.fullDescription),
          gallery: projectFormData.gallery.map((item) => sanitizeInput(item)).filter(Boolean),
          impactStats: projectFormData.impactStats
            .map((item) => ({
              label: sanitizeInput(item.label),
              value: sanitizeInput(item.value),
            }))
            .filter((item) => item.label || item.value),
          stories: (projectFormData.stories || [])
            .map((item) => ({
              quote: sanitizeInput(item.quote),
              name: sanitizeInput(item.name),
            }))
            .filter((item) => item.quote || item.name),
          visible: projectFormData.visible !== false,
          order: Number(projectFormData.order || 0),
        };

        const response = await fetch('/api/admin/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-password': password
          },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          await fetchProjects();
          setEditingProjectId(null);
          setIsNewProject(false);
          setStatus({ type: 'success', message: 'Project saved successfully!' });
        } else {
          throw new Error('Failed to save project');
        }
      }
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const itemName = activeTab === 'manager' ? 'devotion' : activeTab === 'testimonies' ? 'testimony' : activeTab === 'projects' ? 'project' : 'program';
    if (window.confirm(`Are you sure you want to delete this ${itemName}? This cannot be undone.`)) {
      setIsSaving(true);
      try {
        if (activeTab === 'manager') {
          const response = await fetch(`/api/admin/devotions/${id}`, {
            method: 'DELETE',
            headers: { 'x-admin-password': password }
          });
          if (response.ok) {
            setDevotions(prev => prev.filter(d => d.id !== id));
            setStatus({ type: 'success', message: 'Devotion deleted.' });
          }
        } else if (activeTab === 'testimonies') {
          const response = await fetch(`/api/admin/testimonies/${id}`, {
            method: 'DELETE',
            headers: { 'x-admin-password': password }
          });
          if (response.ok) {
            setTestimonies(prev => prev.filter(t => t.id !== id));
            setPendingTestimonies(prev => prev.filter(t => t.id !== id));
            setStatus({ type: 'success', message: 'Testimony deleted.' });
          } else {
            throw new Error('Failed to delete testimony');
          }
        } else if (activeTab === 'programs') {
          const response = await fetch(`/api/admin/programs/${id}`, {
            method: 'DELETE',
            headers: { 'x-admin-password': password }
          });
          if (response.ok) {
            setPrograms(prev => prev.filter(p => p.id !== id));
            setStatus({ type: 'success', message: 'Program deleted.' });
          } else {
            throw new Error('Failed to delete program');
          }
        } else if (activeTab === 'projects') {
          const response = await fetch(`/api/admin/projects/${id}`, {
            method: 'DELETE',
            headers: { 'x-admin-password': password }
          });
          if (response.ok) {
            setManagedProjects(prev => prev.filter(p => (p.documentId || String(p.id)) !== id));
            setStatus({ type: 'success', message: 'Project deleted.' });
          } else {
            throw new Error('Failed to delete project');
          }
        }
      } catch (e) {
        setStatus({ type: 'error', message: 'Failed to delete.' });
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleBackup = (type: 'devotions' | 'testimonies') => {
    let rawData: any[] = [];
    let fileName = '';
    
    if (type === 'devotions') {
      rawData = devotions;
      fileName = `devotions_backup_${new Date().toISOString().split('T')[0]}.txt`;
    } else {
      rawData = testimonies;
      fileName = `testimonies_backup_${new Date().toISOString().split('T')[0]}.txt`;
    }

    // Format the data as a pretty readable text file
    let textContent = `LOUDER FELLOWSHIP - ${type.toUpperCase()} BACKUP\n`;
    textContent += `Generated on: ${new Date().toLocaleString()}\n`;
    textContent += `==========================================\n\n`;

    rawData.forEach((item, index) => {
      textContent += `ITEM #${index + 1}\n`;
      Object.entries(item).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          textContent += `${key.toUpperCase()}:\n  - ${value.join('\n  - ')}\n`;
        } else {
          textContent += `${key.toUpperCase()}: ${value}\n`;
        }
      });
      textContent += `\n------------------------------------------\n\n`;
    });

    // Create blob and download
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setStatus({ type: 'success', message: `${type.charAt(0).toUpperCase() + type.slice(1)} backup downloaded!` });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-royal-blue flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-10 rounded-[2.5rem] shadow-2xl max-w-md w-full"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-royal-gold/10 rounded-2xl flex items-center justify-center text-royal-gold mx-auto mb-4">
              <BookOpen className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-serif font-black text-royal-blue">Admin Portal</h1>
            <p className="text-slate-500">Louder Fellowship Content Manager</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Admin Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-royal-gold outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-royal-blue text-white py-4 rounded-xl font-black hover:bg-royal-gold hover:text-royal-blue transition-all shadow-lg"
            >
              Access Manager
            </button>
            {status && (
              <div className={`p-4 rounded-xl text-sm font-bold flex items-center gap-2 ${status.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                {status.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                {status.message}
              </div>
            )}
          </form>
        </motion.div>
      </div>
    );
  }

  const testimonyProjectOptions = managedProjects.length > 0 ? managedProjects : staticProjects;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pt-20">
      <header className="bg-white border-b border-slate-200 px-6 md:px-8 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-royal-blue rounded-xl flex items-center justify-center text-royal-gold">
              <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <h1 className="font-serif font-black text-royal-blue leading-none text-sm md:text-base">Management</h1>
              <span className="text-[9px] md:text-[10px] text-slate-400 font-black uppercase tracking-widest">Portal Access</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('manager')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'manager' ? 'bg-white text-royal-blue shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Devotions
            </button>
            <button 
              onClick={() => setActiveTab('testimonies')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'testimonies' ? 'bg-white text-royal-blue shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Testimonies
            </button>
            <button
              onClick={() => setActiveTab('programs')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'programs' ? 'bg-white text-royal-blue shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Programs
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'projects' ? 'bg-white text-royal-blue shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Projects
            </button>
            <button 
              onClick={() => setActiveTab('backup')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'backup' ? 'bg-white text-royal-blue shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Backup
            </button>
          </div>

          <div className="flex items-center gap-4">
            {status && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`hidden xl:flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold ${status.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}
              >
                {status.message}
              </motion.div>
            )}
            <div className="hidden md:flex">
              <button 
                onClick={startNewActiveItem}
                className="bg-royal-blue text-white px-5 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-royal-gold hover:text-royal-blue transition-all shadow-md text-sm"
              >
                <Plus className="w-4 h-4" /> New {activeItemName}
              </button>
            </div>
            
            <button 
              onClick={handleLogout}
              className="hidden md:flex p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
            
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-royal-blue"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Content */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden border-t border-slate-100 pt-4 mt-4"
            >
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => { setActiveTab('manager'); setIsMenuOpen(false); }}
                  className={`w-full px-4 py-3 rounded-xl text-sm font-bold text-left transition-all ${activeTab === 'manager' ? 'bg-royal-blue text-white' : 'bg-slate-50 text-slate-500'}`}
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4" /> Devotions
                  </div>
                </button>
                <button 
                  onClick={() => { setActiveTab('testimonies'); setIsMenuOpen(false); }}
                  className={`w-full px-4 py-3 rounded-xl text-sm font-bold text-left transition-all ${activeTab === 'testimonies' ? 'bg-royal-blue text-white' : 'bg-slate-50 text-slate-500'}`}
                >
                  <div className="flex items-center gap-3">
                    <Share className="w-4 h-4" /> Testimonies
                  </div>
                </button>
                <button
                  onClick={() => { setActiveTab('programs'); setIsMenuOpen(false); }}
                  className={`w-full px-4 py-3 rounded-xl text-sm font-bold text-left transition-all ${activeTab === 'programs' ? 'bg-royal-blue text-white' : 'bg-slate-50 text-slate-500'}`}
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4" /> Programs
                  </div>
                </button>
                <button
                  onClick={() => { setActiveTab('projects'); setIsMenuOpen(false); }}
                  className={`w-full px-4 py-3 rounded-xl text-sm font-bold text-left transition-all ${activeTab === 'projects' ? 'bg-royal-blue text-white' : 'bg-slate-50 text-slate-500'}`}
                >
                  <div className="flex items-center gap-3">
                    <ImageIcon className="w-4 h-4" /> Projects
                  </div>
                </button>
                <button 
                  onClick={() => { setActiveTab('backup'); setIsMenuOpen(false); }}
                  className={`w-full px-4 py-3 rounded-xl text-sm font-bold text-left transition-all ${activeTab === 'backup' ? 'bg-royal-blue text-white' : 'bg-slate-50 text-slate-500'}`}
                >
                  <div className="flex items-center gap-3">
                    <Database className="w-4 h-4" /> System Backup
                  </div>
                </button>
                <div className="pt-2">
                  <button 
                    onClick={() => { startNewActiveItem(); setIsMenuOpen(false); }}
                    className="w-full bg-royal-gold text-royal-blue px-4 py-3 rounded-xl font-bold flex items-center gap-3 shadow-sm text-sm"
                  >
                    <Plus className="w-4 h-4" /> New {activeItemName}
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-100 mt-2">
                  <button 
                    onClick={handleLogout}
                    className="w-full text-red-500 bg-red-50 px-4 py-3 rounded-xl font-bold flex items-center gap-3 text-sm hover:bg-red-100 transition-all"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-10">
        {activeTab === 'manager' ? (
          <div className="grid lg:grid-cols-12 gap-10">
            {/* Devotions List Column */}
            <div className="lg:col-span-5 space-y-4 h-fit sticky top-32">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Published Devotions ({devotions.length})</h2>
              <div className="space-y-3">
                {devotions.map((devotion) => (
                  <div 
                    key={devotion.id}
                    className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer group ${editingId === devotion.id ? 'border-royal-gold shadow-lg ring-1 ring-royal-gold' : 'border-slate-100 hover:shadow-md'}`}
                    onClick={() => startEdit(devotion)}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{devotion.date}</p>
                        <h3 className="font-bold text-royal-blue group-hover:text-royal-gold transition-colors">{devotion.title}</h3>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(devotion.id); }}
                        className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Devotions Editor Column */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                {editingId ? (
                  <motion.div 
                    key="editor"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden"
                  >
                    <div className="p-8 md:p-12 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Edit3 className="w-5 h-5 text-royal-gold" />
                        <h2 className="text-xl font-serif font-black text-royal-blue">{isNew ? 'Create New' : 'Edit Devotion'}</h2>
                      </div>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => setShowPreview(!showPreview)}
                          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${showPreview ? 'bg-royal-gold text-royal-blue' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'}`}
                        >
                          {showPreview ? 'View Editor' : 'View Preview'}
                        </button>
                        <button 
                          onClick={() => { setEditingId(null); setErrors({}); }}
                          className="text-slate-400 hover:text-royal-blue transition-colors flex items-center gap-1 font-bold text-sm"
                        >
                          <ChevronLeft className="w-4 h-4" /> Cancel
                        </button>
                      </div>
                    </div>

                    <div className="p-8 md:p-12 space-y-8">
                      {showPreview ? (
                        <div className="space-y-8">
                          <div className="flex items-center gap-4 mb-2">
                            <div className="px-4 py-1.5 bg-royal-gold/10 text-royal-gold rounded-full text-xs font-black uppercase tracking-widest border border-royal-gold/20">
                              Preview Mode
                            </div>
                          </div>
                          <h2 className="text-4xl font-serif font-black text-royal-blue">{formData.title || 'Untitled Devotion'}</h2>
                          <div className="bg-royal-blue/5 p-6 rounded-2xl border-l-4 border-royal-gold">
                            <p className="text-royal-blue font-serif italic text-lg">{formData.scripture || 'No scripture provided'}</p>
                          </div>
                          <div className="markdown-body prose prose-slate">
                            <ReactMarkdown>{formData.content || 'No content provided'}</ReactMarkdown>
                          </div>
                          {formData.nuggets && formData.nuggets.length > 0 && formData.nuggets[0] && (
                            <div className="bg-slate-50 p-6 rounded-2xl">
                              <h4 className="text-royal-blue font-bold mb-4 flex items-center gap-2"><Lightbulb className="w-4 h-4 text-royal-gold" /> Nuggets</h4>
                              <ul className="space-y-2">
                                {formData.nuggets.map((n, i) => n.trim() && <li key={i} className="text-slate-600 text-sm">• {n}</li>)}
                              </ul>
                            </div>
                          )}
                        </div>
                      ) : (
                        <>
                          {/* Title & Scripture */}
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                                <Type className={`w-3 h-3 ${errors.title ? 'text-red-500' : ''}`} /> Title
                              </label>
                              <input 
                                type="text" 
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className={`w-full px-5 py-4 rounded-xl border focus:ring-2 outline-none transition-all ${errors.title ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-royal-gold'}`}
                                placeholder="Theme Title"
                              />
                              {errors.title && <p className="text-red-500 text-[10px] font-bold">{errors.title}</p>}
                            </div>
                            <div className="space-y-2">
                              <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                                <Calendar className={`w-3 h-3 ${errors.date ? 'text-red-500' : ''}`} /> Publish Date
                              </label>
                              <input 
                                type="text" 
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className={`w-full px-5 py-4 rounded-xl border focus:ring-2 outline-none transition-all ${errors.date ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-royal-gold'}`}
                                placeholder="May 13, 2024"
                              />
                              {errors.date && <p className="text-red-500 text-[10px] font-bold">{errors.date}</p>}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                              <BookOpen className={`w-3 h-3 ${errors.scripture ? 'text-red-500' : ''}`} /> Theme Scripture
                            </label>
                            <textarea 
                              rows={2}
                              value={formData.scripture}
                              onChange={(e) => setFormData({ ...formData, scripture: e.target.value })}
                              className={`w-full px-5 py-4 rounded-xl border focus:ring-2 outline-none font-serif italic transition-all ${errors.scripture ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-royal-gold'}`}
                              placeholder="Jeremiah 29:11 - For I know the plans..."
                            />
                            {errors.scripture && <p className="text-red-500 text-[10px] font-bold">{errors.scripture}</p>}
                          </div>

                          {/* Body Content */}
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                              <FileText className={`w-3 h-3 ${errors.content ? 'text-red-500' : ''}`} /> Body Content (Markdown supported)
                            </label>
                            <textarea 
                              rows={10}
                              value={formData.content}
                              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                              className={`w-full px-5 py-4 rounded-xl border focus:ring-2 outline-none leading-relaxed transition-all ${errors.content ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-royal-gold'}`}
                              placeholder="Type the message here. Use double line breaks for new paragraphs..."
                            />
                            {errors.content && <p className="text-red-500 text-[10px] font-bold">{errors.content}</p>}
                          </div>

                          {/* Nuggets */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                                <Lightbulb className="w-3 h-3" /> Lessons & Nuggets
                              </label>
                              <button 
                                onClick={addNugget}
                                className="text-xs font-black text-royal-gold uppercase hover:underline"
                              >
                                + Add Nugget
                              </button>
                            </div>
                            <div className="space-y-3">
                              {formData.nuggets?.map((nugget, index) => (
                                <div key={index} className="flex gap-3">
                                  <input 
                                    type="text" 
                                    value={nugget}
                                    onChange={(e) => updateNugget(index, e.target.value)}
                                    className="flex-1 px-5 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-royal-gold outline-none text-sm"
                                    placeholder="A key takeaway..."
                                  />
                                  <button 
                                    onClick={() => removeNugget(index)}
                                    className="p-2 text-slate-300 hover:text-red-500"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4 w-full md:w-auto">
                              <User className={`w-5 h-5 ${errors.author ? 'text-red-500' : 'text-slate-300'}`} />
                              <div>
                                <input 
                                  type="text" 
                                  value={formData.author}
                                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                  className={`bg-transparent border-b font-bold text-royal-blue outline-none py-1 transition-all ${errors.author ? 'border-red-500' : 'border-slate-200'}`}
                                  placeholder="Author Name"
                                />
                                {errors.author && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.author}</p>}
                              </div>
                            </div>
                            <button 
                              onClick={handleSave}
                              disabled={isSaving}
                              className="w-full md:w-auto bg-royal-blue text-white px-10 py-4 rounded-full font-black flex items-center justify-center gap-2 hover:bg-royal-gold hover:text-royal-blue transition-all shadow-xl disabled:opacity-50"
                            >
                              {isSaving ? 'Processing...' : (
                                <>
                                  <Save className="w-5 h-5" /> {isNew ? 'Create Devotion' : 'Update & Save'}
                                </>
                              )}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-[600px] bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-12"
                  >
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
                      <FileText className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-serif font-black text-royal-blue mb-2">No Devotion Selected</h3>
                    <p className="text-slate-400 max-w-xs mx-auto mb-8">Select a devotion from the list to edit its content or create a brand new one.</p>
                    <button 
                      onClick={startNew}
                      className="bg-royal-blue/5 text-royal-blue px-8 py-3 rounded-full font-bold hover:bg-royal-blue hover:text-white transition-all"
                    >
                      Create a new Entry
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ) : activeTab === 'programs' ? (
          <div className="grid lg:grid-cols-12 gap-10">
            {/* Programs List Column */}
            <div className="lg:col-span-5 space-y-4 h-fit sticky top-32">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Programs ({programs.length})</h2>
              <div className="space-y-3">
                {programs.map((program) => (
                  <div 
                    key={program.id}
                    className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer group ${editingProgramId === program.id ? 'border-royal-gold shadow-lg ring-1 ring-royal-gold' : 'border-slate-100 hover:shadow-md'}`}
                    onClick={() => startEditProgram(program)}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{program.day || program.subtitle}</p>
                        <h3 className="font-bold text-royal-blue group-hover:text-royal-gold transition-colors">{program.title}</h3>
                        {Array.isArray(program.events) && (
                          <p className="text-[10px] text-slate-400 mt-1">{program.events.length} event{program.events.length === 1 ? '' : 's'}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(program.id); }} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Programs Editor Column */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden p-8 md:p-12">
                {editingProgramId ? (
                  <div>
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Day</label>
                        <input type="text" value={programFormData.day} onChange={(e) => setProgramFormData({ ...programFormData, day: e.target.value })} className="w-full px-5 py-4 rounded-xl border border-slate-200" placeholder="Monday" />
                      </div>
                      <div>
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Title</label>
                        <input type="text" value={programFormData.title} onChange={(e) => setProgramFormData({ ...programFormData, title: e.target.value })} className="w-full px-5 py-4 rounded-xl border border-slate-200" placeholder="Monday" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Subtitle</label>
                        <input type="text" value={programFormData.subtitle} onChange={(e) => setProgramFormData({ ...programFormData, subtitle: e.target.value })} className="w-full px-5 py-4 rounded-xl border border-slate-200" placeholder="Online Connection" />
                      </div>
                      <div>
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Display Order</label>
                        <input type="number" value={programFormData.order} onChange={(e) => setProgramFormData({ ...programFormData, order: parseInt(e.target.value) || 0 })} className="w-full px-5 py-4 rounded-xl border border-slate-200" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Events</label>
                        <button onClick={addProgramEvent} className="text-xs font-black text-royal-gold uppercase hover:underline">+ Add Event</button>
                      </div>
                      {programFormData.events.map((event, index) => (
                        <div key={index} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 space-y-3">
                          <div className="grid md:grid-cols-2 gap-3">
                            <input type="text" value={event.time} onChange={(e) => updateProgramEvent(index, 'time', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm" placeholder="8pm - 10pm" />
                            <input type="text" value={event.name} onChange={(e) => updateProgramEvent(index, 'name', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm" placeholder="Zoom Fellowship" />
                          </div>
                          <textarea rows={3} value={event.desc} onChange={(e) => updateProgramEvent(index, 'desc', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm" placeholder="Event description" />
                          <button onClick={() => removeProgramEvent(index)} className="text-xs font-bold text-red-500 hover:underline">Remove event</button>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 mt-4">
                      <label className="flex items-center gap-2"><input type="checkbox" checked={!!programFormData.highlight} onChange={(e) => setProgramFormData({ ...programFormData, highlight: e.target.checked })} /> <span className="text-xs font-black uppercase tracking-widest text-slate-400">Highlight</span></label>
                      <label className="flex items-center gap-2"><input type="checkbox" checked={!!programFormData.visible} onChange={(e) => setProgramFormData({ ...programFormData, visible: e.target.checked })} /> <span className="text-xs font-black uppercase tracking-widest text-slate-400">Visible</span></label>
                    </div>

                    <div className="pt-8 flex items-center gap-4">
                      <button onClick={handleSave} className="bg-royal-blue text-white px-8 py-3 rounded-full font-bold">{isSaving ? 'Saving...' : 'Save Program'}</button>
                      <button onClick={() => { setEditingProgramId(null); setProgramFormData(emptyProgramForm()); }} className="text-sm text-slate-500">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="h-[400px] flex items-center justify-center text-center py-12">
                    <div>
                      <p className="text-slate-500 mb-4">Select a program to edit or create a new one.</p>
                      <button onClick={startNewProgram} className="bg-royal-blue/5 text-royal-blue px-6 py-3 rounded-full font-bold hover:bg-royal-blue hover:text-white transition-all">Create a new Program</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : activeTab === 'projects' ? (
          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5 space-y-4 h-fit sticky top-32">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Projects ({managedProjects.length})</h2>
              <div className="space-y-3">
                {managedProjects.map((project) => {
                  const projectDocId = project.documentId || String(project.id);
                  return (
                    <div
                      key={projectDocId}
                      className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer group ${editingProjectId === projectDocId ? 'border-royal-gold shadow-lg ring-1 ring-royal-gold' : 'border-slate-100 hover:shadow-md'}`}
                      onClick={() => startEditProject(project)}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{project.type} | {project.location}</p>
                          <h3 className="font-bold text-royal-blue group-hover:text-royal-gold transition-colors truncate">{project.title}</h3>
                          <p className="text-[10px] text-slate-400 mt-1">{project.timeframe}</p>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(projectDocId); }} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden p-8 md:p-12">
                {editingProjectId ? (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Project ID</label>
                        <input type="text" value={projectFormData.id} onChange={(e) => setProjectFormData({ ...projectFormData, id: e.target.value })} className="w-full px-5 py-4 rounded-xl border border-slate-200" />
                      </div>
                      <div>
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Order</label>
                        <input type="number" value={projectFormData.order} onChange={(e) => setProjectFormData({ ...projectFormData, order: parseInt(e.target.value) || 0 })} className="w-full px-5 py-4 rounded-xl border border-slate-200" />
                      </div>
                      <div>
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Funded %</label>
                        <input type="number" min="0" max="100" value={projectFormData.funded} onChange={(e) => setProjectFormData({ ...projectFormData, funded: parseInt(e.target.value) || 0 })} className="w-full px-5 py-4 rounded-xl border border-slate-200" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Title</label>
                        <input type="text" value={projectFormData.title} onChange={(e) => setProjectFormData({ ...projectFormData, title: e.target.value })} className="w-full px-5 py-4 rounded-xl border border-slate-200" />
                      </div>
                      <div>
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Type</label>
                        <select value={projectFormData.type} onChange={(e) => setProjectFormData({ ...projectFormData, type: e.target.value as Project['type'] })} className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-white">
                          {PROJECT_TYPES.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Location</label>
                        <input type="text" value={projectFormData.location} onChange={(e) => setProjectFormData({ ...projectFormData, location: e.target.value })} className="w-full px-5 py-4 rounded-xl border border-slate-200" />
                      </div>
                      <div>
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Timeframe</label>
                        <input type="text" value={projectFormData.timeframe} onChange={(e) => setProjectFormData({ ...projectFormData, timeframe: e.target.value })} className="w-full px-5 py-4 rounded-xl border border-slate-200" />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400">Main Image URL</label>
                      <input type="text" value={projectFormData.image} onChange={(e) => setProjectFormData({ ...projectFormData, image: e.target.value })} className="w-full px-5 py-4 rounded-xl border border-slate-200" placeholder="/journey/example.jpeg or https://..." />
                    </div>

                    <div>
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400">Short Description</label>
                      <textarea rows={3} value={projectFormData.description} onChange={(e) => setProjectFormData({ ...projectFormData, description: e.target.value })} className="w-full px-5 py-4 rounded-xl border border-slate-200" />
                    </div>

                    <div>
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400">Full Description</label>
                      <textarea rows={6} value={projectFormData.fullDescription} onChange={(e) => setProjectFormData({ ...projectFormData, fullDescription: e.target.value })} className="w-full px-5 py-4 rounded-xl border border-slate-200" />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Gallery URLs</label>
                        <button onClick={() => setProjectFormData({ ...projectFormData, gallery: [...projectFormData.gallery, ''] })} className="text-xs font-black text-royal-gold uppercase hover:underline">+ Add Image</button>
                      </div>
                      {projectFormData.gallery.map((item, index) => (
                        <div key={index} className="flex gap-2">
                          <input type="text" value={item} onChange={(e) => updateGalleryItem(index, e.target.value)} className="flex-1 px-5 py-3 rounded-xl border border-slate-200 text-sm" placeholder="Image URL" />
                          <button onClick={() => setProjectFormData({ ...projectFormData, gallery: projectFormData.gallery.filter((_, itemIndex) => itemIndex !== index) || [''] })} className="p-3 text-slate-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Impact Stats</label>
                        <button onClick={() => setProjectFormData({ ...projectFormData, impactStats: [...projectFormData.impactStats, { label: '', value: '' }] })} className="text-xs font-black text-royal-gold uppercase hover:underline">+ Add Stat</button>
                      </div>
                      {projectFormData.impactStats.map((item, index) => (
                        <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                          <input type="text" value={item.label} onChange={(e) => updateImpactStat(index, 'label', e.target.value)} className="px-5 py-3 rounded-xl border border-slate-200 text-sm" placeholder="Label" />
                          <input type="text" value={item.value} onChange={(e) => updateImpactStat(index, 'value', e.target.value)} className="px-5 py-3 rounded-xl border border-slate-200 text-sm" placeholder="Value" />
                          <button onClick={() => setProjectFormData({ ...projectFormData, impactStats: projectFormData.impactStats.filter((_, itemIndex) => itemIndex !== index) })} className="p-3 text-slate-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Stories</label>
                        <button onClick={() => setProjectFormData({ ...projectFormData, stories: [...(projectFormData.stories || []), { quote: '', name: '' }] })} className="text-xs font-black text-royal-gold uppercase hover:underline">+ Add Story</button>
                      </div>
                      {(projectFormData.stories || []).map((item, index) => (
                        <div key={index} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 space-y-3">
                          <textarea rows={3} value={item.quote} onChange={(e) => updateStory(index, 'quote', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm" placeholder="Quote" />
                          <div className="flex gap-2">
                            <input type="text" value={item.name} onChange={(e) => updateStory(index, 'name', e.target.value)} className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm" placeholder="Name" />
                            <button onClick={() => setProjectFormData({ ...projectFormData, stories: (projectFormData.stories || []).filter((_, itemIndex) => itemIndex !== index) })} className="p-3 text-slate-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={projectFormData.visible !== false} onChange={(e) => setProjectFormData({ ...projectFormData, visible: e.target.checked })} />
                      <span className="text-xs font-black uppercase tracking-widest text-slate-400">Visible on site</span>
                    </label>

                    <div className="pt-8 flex items-center gap-4 border-t border-slate-50">
                      <button onClick={handleSave} disabled={isSaving} className="bg-royal-blue text-white px-8 py-3 rounded-full font-bold disabled:opacity-50">{isSaving ? 'Saving...' : 'Save Project'}</button>
                      <button onClick={() => { setEditingProjectId(null); setProjectFormData(emptyProjectForm()); }} className="text-sm text-slate-500">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="h-[400px] flex items-center justify-center text-center py-12">
                    <div>
                      <p className="text-slate-500 mb-4">Select a project to edit or create a new outreach project.</p>
                      <button onClick={startNewProject} className="bg-royal-blue/5 text-royal-blue px-6 py-3 rounded-full font-bold hover:bg-royal-blue hover:text-white transition-all">Create a new Project</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : activeTab === 'testimonies' ? (
          <div className="grid lg:grid-cols-12 gap-10">
            {/* Testimonies List Column */}
            <div className="lg:col-span-5 space-y-8 h-fit sticky top-32">
              {/* Public Submissions Queue */}
              {pendingTestimonies.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-royal-gold">Pending Submissions ({pendingTestimonies.length})</h2>
                    {selectedPendingIds.length > 0 && (
                      <div className="flex gap-2">
                        <button onClick={() => handleBulkAction('APPROVED')} className="text-xs font-black bg-royal-blue text-white px-3 py-1 rounded-lg">Approve ({selectedPendingIds.length})</button>
                        <button onClick={() => handleBulkAction('REJECTED')} className="text-xs font-black bg-red-500 text-white px-3 py-1 rounded-lg">Reject ({selectedPendingIds.length})</button>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <input 
                      type="checkbox" 
                      onChange={(e) => setSelectedPendingIds(e.target.checked ? pendingTestimonies.map(t => t.id) : [])}
                      checked={selectedPendingIds.length === pendingTestimonies.length}
                    />
                    <span className="text-xs font-bold text-slate-500">Select All</span>
                  </div>
                  <div className="space-y-3">
                    {pendingTestimonies.map((testimony) => (
                      <div 
                        key={testimony.id}
                        className={`bg-royal-blue/5 p-5 rounded-2xl border-2 ${selectedPendingIds.includes(testimony.id) ? 'border-royal-blue' : 'border-royal-gold/20'} shadow-sm relative group overflow-hidden`}
                      >
                        <div className="flex items-center gap-4">
                          <input 
                            type="checkbox"
                            checked={selectedPendingIds.includes(testimony.id)}
                            onChange={(e) => setSelectedPendingIds(prev => e.target.checked ? [...prev, testimony.id] : prev.filter(id => id !== testimony.id))}
                          />
                          <div className="w-12 h-12 rounded-xl flex-shrink-0 bg-white flex items-center justify-center text-royal-blue font-black shadow-inner border border-royal-blue/10">
                            {testimony.author.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-royal-blue truncate">{testimony.author}</h3>
                            <p className="text-[9px] font-black text-royal-gold uppercase tracking-widest">{testimony.location}</p>
                            <p className="text-[9px] font-medium text-slate-500 italic truncate mt-0.5">{testimony.contact}</p>
                          </div>
                        </div>
                        <p className="mt-3 text-[11px] text-royal-blue/80 line-clamp-2 italic">"{testimony.content}"</p>
                        <div className="mt-4 flex gap-2">
                          <button 
                            onClick={() => fastApprove(testimony.id)}
                            className="bg-green-600 text-white px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-sm"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => approvePending(testimony)}
                            className="flex-1 bg-royal-blue text-white py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-royal-gold hover:text-royal-blue transition-all"
                          >
                            Review & Edit
                          </button>
                          <button 
                            onClick={() => rejectPending(testimony.id)}
                            className="px-3 bg-white text-red-500 py-2 rounded-lg text-[10px] font-black hover:bg-red-50 transition-all border border-red-100"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Published Testimonies ({testimonies.length})</h2>
                <div className="space-y-3">
                  {testimonies.map((testimony) => (
                  <div 
                    key={testimony.id}
                    className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer group ${editingTestimonyId === testimony.id ? 'border-royal-gold shadow-lg ring-1 ring-royal-gold' : 'border-slate-100 hover:shadow-md'}`}
                    onClick={() => startEditTestimony(testimony)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex-shrink-0 bg-slate-100 relative flex items-center justify-center text-royal-blue font-black border border-slate-200">
                        {testimony.author.charAt(0)}
                        {testimony.status === 'PENDING' && (
                          <div className="absolute inset-0 bg-royal-gold/60 flex items-center justify-center rounded-xl">
                            <AlertCircle className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{testimony.date}</p>
                          <span className="text-[9px] font-black text-royal-gold uppercase">{testimony.location}</span>
                          {testimony.status === 'PENDING' && (
                            <span className="bg-red-50 text-red-500 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest animate-pulse">Pending Review</span>
                          )}
                        </div>
                        <h3 className="font-bold text-royal-blue truncate group-hover:text-royal-gold transition-colors">{testimony.author}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          {testimony.projectId && (
                            <p className="text-[9px] font-black text-royal-gold uppercase tracking-tighter">Project #{testimony.projectId}</p>
                          )}
                          {testimony.contact && (
                            <p className="text-[9px] font-medium text-slate-400 italic">| {testimony.contact}</p>
                          )}
                        </div>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(testimony.id); }}
                        className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Testimonies Editor Column */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                {editingTestimonyId ? (
                  <motion.div 
                    key="testimony-editor"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden"
                  >
                    <div className="p-8 md:p-12 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Share className="w-5 h-5 text-royal-gold" />
                        <h2 className="text-xl font-serif font-black text-royal-blue">{isNewTestimony ? 'New Testimony' : 'Edit Testimony'}</h2>
                      </div>
                      <button 
                        onClick={() => { setEditingTestimonyId(null); setErrors({}); }}
                        className="text-slate-400 hover:text-royal-blue transition-colors flex items-center gap-1 font-bold text-sm"
                      >
                        <ChevronLeft className="w-4 h-4" /> Cancel
                      </button>
                    </div>

                    <div className="p-8 md:p-12 space-y-8">
                      {/* Author & Date */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                            <User className={`w-3 h-3 ${errors.author ? 'text-red-500' : ''}`} /> Author
                          </label>
                          <input 
                            type="text" 
                            value={testimonyFormData.author}
                            onChange={(e) => setTestimonyFormData({ ...testimonyFormData, author: e.target.value })}
                            className={`w-full px-5 py-4 rounded-xl border focus:ring-2 outline-none transition-all ${errors.author ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-royal-gold'}`}
                            placeholder="Full Name"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                            <Calendar className={`w-3 h-3 ${errors.date ? 'text-red-500' : ''}`} /> Date
                          </label>
                          <input 
                            type="text" 
                            value={testimonyFormData.date}
                            onChange={(e) => setTestimonyFormData({ ...testimonyFormData, date: e.target.value })}
                            className={`w-full px-5 py-4 rounded-xl border focus:ring-2 outline-none transition-all ${errors.date ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-royal-gold'}`}
                            placeholder="May 13, 2024"
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                            <FileText className={`w-3 h-3 ${errors.content ? 'text-red-500' : ''}`} /> Testimony Content
                          </label>
                          <textarea 
                            rows={8}
                            value={testimonyFormData.content}
                            onChange={(e) => setTestimonyFormData({ ...testimonyFormData, content: e.target.value })}
                            className={`w-full px-5 py-4 rounded-xl border focus:ring-2 outline-none leading-relaxed transition-all ${errors.content ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-royal-gold'}`}
                            placeholder="What did God do?"
                          />
                        </div>
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                              <Phone className="w-3 h-3" /> Contact Info (Private)
                            </label>
                            <input 
                              type="text" 
                              value={testimonyFormData.contact}
                              onChange={(e) => setTestimonyFormData({ ...testimonyFormData, contact: e.target.value })}
                              className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-royal-gold outline-none transition-all text-sm"
                              placeholder="Phone or Email"
                            />
                            <p className="text-[10px] text-slate-400 font-medium">Capture this for follow-up if needed.</p>
                          </div>

                          <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                              <Shield className="w-3 h-3" /> Approval Status
                            </label>
                            <div className="flex bg-slate-100 p-1 rounded-xl">
                              <button 
                                onClick={() => setTestimonyFormData({ ...testimonyFormData, status: 'APPROVED' })}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-black transition-all ${testimonyFormData.status === 'APPROVED' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                              >
                                <CheckCircle2 className="w-4 h-4" /> APPROVED
                              </button>
                              <button 
                                onClick={() => setTestimonyFormData({ ...testimonyFormData, status: 'PENDING' })}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-black transition-all ${testimonyFormData.status === 'PENDING' ? 'bg-white text-red-500 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                              >
                                <AlertCircle className="w-4 h-4" /> PENDING
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Location & Project Association */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                             Location (Town/City/Country)
                          </label>
                          <input 
                            type="text" 
                            value={testimonyFormData.location}
                            onChange={(e) => setTestimonyFormData({ ...testimonyFormData, location: e.target.value })}
                            className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-royal-gold outline-none transition-all text-sm"
                            placeholder="e.g. Kampala, Uganda"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                            <LinkIcon className="w-3 h-3" /> Attach to Project
                          </label>
                          <select 
                            value={testimonyFormData.projectId || ''}
                            onChange={(e) => setTestimonyFormData({ ...testimonyFormData, projectId: e.target.value ? parseInt(e.target.value) : undefined })}
                            className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-royal-gold outline-none transition-all"
                          >
                            <option value="">No Project (Home Page Only)</option>
                            {testimonyProjectOptions.map(p => (
                              <option key={p.id} value={p.id}>{p.title}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Likes Counter */}
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                          <Heart className="w-3 h-3" /> Initial Blessed Count
                        </label>
                        <input 
                          type="number" 
                          value={testimonyFormData.likes}
                          onChange={(e) => setTestimonyFormData({ ...testimonyFormData, likes: parseInt(e.target.value) || 0 })}
                          className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-royal-gold outline-none transition-all"
                        />
                      </div>

                      <div className="pt-8 border-t border-slate-50">
                        <button 
                          onClick={handleSave}
                          disabled={isSaving}
                          className="w-full bg-royal-blue text-white px-10 py-4 rounded-full font-black flex items-center justify-center gap-2 hover:bg-royal-gold hover:text-royal-blue transition-all shadow-xl disabled:opacity-50"
                        >
                          {isSaving ? 'Processing...' : (
                            <>
                              <Save className="w-5 h-5" /> {isNewTestimony ? 'Create Testimony' : 'Update & Save'}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="testimony-empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-[600px] bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-12"
                  >
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
                      <Share className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-serif font-black text-royal-blue mb-2">No Testimony Selected</h3>
                    <p className="text-slate-400 max-w-xs mx-auto mb-8">Click a testimony from the list or create a new one to celebrate God's faithfulness.</p>
                    <button 
                      onClick={startNewTestimony}
                      className="bg-royal-blue/5 text-royal-blue px-8 py-3 rounded-full font-bold hover:bg-royal-blue hover:text-white transition-all"
                    >
                      Celebrate a Miracle
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
              <div className="p-8 md:p-12 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
                <Database className="w-5 h-5 text-royal-gold" />
                <h2 className="text-xl font-serif font-black text-royal-blue">System Backup & Export</h2>
              </div>
              
              <div className="p-8 md:p-12 space-y-12">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Devotions Backup */}
                  <div className="p-8 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:border-royal-gold/20 transition-all group">
                    <div className="w-12 h-12 rounded-2xl bg-royal-blue flex items-center justify-center text-royal-gold mb-6 group-hover:scale-110 transition-transform">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-royal-blue mb-2">Devotions Backup</h3>
                    <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                      Export all currently published and modified devotions to a readable text file. This includes titles, scriptures, content, and divine nuggets.
                    </p>
                    <button 
                      onClick={() => handleBackup('devotions')}
                      className="w-full py-4 bg-royal-blue text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-royal-gold hover:text-royal-blue transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" /> Download Devotions (.txt)
                    </button>
                  </div>

                  {/* Testimonies Backup */}
                  <div className="p-8 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:border-royal-gold/20 transition-all group">
                    <div className="w-12 h-12 rounded-2xl bg-royal-gold flex items-center justify-center text-royal-blue mb-6 group-hover:scale-110 transition-transform">
                      <Share className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-royal-blue mb-2">Testimonies Backup</h3>
                    <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                      Download a permanent copy of all shared testimonies. Useful for offline ministry reports or data migration.
                    </p>
                    <button 
                      onClick={() => handleBackup('testimonies')}
                      className="w-full py-4 bg-white border-2 border-royal-blue text-royal-blue rounded-xl font-black text-xs uppercase tracking-widest hover:bg-royal-blue hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" /> Download Testimonies (.txt)
                    </button>
                  </div>
                </div>

                <div className="p-8 rounded-3xl bg-royal-gold/5 border border-royal-gold/10 flex items-start gap-4">
                  <Shield className="w-6 h-6 text-royal-gold flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-royal-blue font-bold mb-1">Data Preservation Shield</h4>
                    <p className="text-sm text-royal-blue/60 leading-relaxed">
                      Always perform a backup before major content revisions. These files are saved locally to your device and are not accessible by other portal users unless specifically shared.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      <footer className="mt-20 py-10 border-t border-slate-200 text-center">
        <p className="text-xs font-black text-slate-300 uppercase tracking-[0.3em] mb-2">Security Notice</p>
        <p className="text-[10px] text-slate-400 max-w-md mx-auto">
          This portal allows direct modifications to the application's core data files. Changes made here are persistent and reflected immediately for all users.
        </p>
      </footer>
    </div>
  );
}
