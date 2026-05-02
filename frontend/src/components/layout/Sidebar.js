import React, { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { PlusCircle, MessageSquare, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { fetchWithAuth } = useApi();
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();
  const { sessionId } = useParams();

  const fetchSessions = async () => {
    try {
      const data = await fetchWithAuth('/chat/sessions');
      setSessions(data.sessions || []);
    } catch (err) {
      console.error('Failed to fetch sessions', err);
    }
  };

  useEffect(() => {
    fetchSessions();
    // eslint-disable-next-line
  }, [sessionId]);

  const handleNewChat = () => {
    navigate('/chat');
    if (window.innerWidth < 768) toggleSidebar();
  };

  const handleSelectSession = (id) => {
    navigate(`/chat/${id}`);
    if (window.innerWidth < 768) toggleSidebar();
  };

  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await fetchWithAuth(`/chat/sessions/${deleteConfirmId}`, { method: 'DELETE' });
      setSessions(prev => prev.filter(s => s.id !== deleteConfirmId));
      if (sessionId === deleteConfirmId) navigate('/chat');
    } catch (err) {
      console.error('Delete failed', err);
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const cancelDelete = () => setDeleteConfirmId(null);

  return (
    <div className={`
      fixed md:static inset-y-0 left-0 z-20 
      w-64 bg-bg-sidebar border-r border-border 
      flex flex-col transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `}>
      <div className="p-4 border-b border-border/50 h-16 flex items-center shrink-0">
        <button 
          onClick={handleNewChat}
          className="flex items-center gap-2 w-full bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded font-medium transition-colors"
        >
          <PlusCircle size={18} />
          <span>New Chat</span>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {sessions.map(s => (
          <div 
            key={s.id}
            onClick={() => handleSelectSession(s.id)}
            className={`
              group flex items-center justify-between p-3 rounded cursor-pointer transition-colors border
              ${sessionId === s.id ? 'bg-primary-light text-primary border-primary/20' : 'hover:bg-white border-transparent text-text-dark'}
            `}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <MessageSquare size={16} className={`${sessionId === s.id ? 'text-primary' : 'text-text-muted'} shrink-0`} />
              <span className="truncate text-sm font-medium">{s.title || 'New Chat'}</span>
            </div>
            <button 
              onClick={(e) => handleDeleteClick(e, s.id)}
              className="text-text-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {sessions.length === 0 && (
          <div className="text-center p-4 text-sm text-text-muted mt-4">
            No chats yet. Start a conversation!
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-border/50">
        <div className="bg-primary rounded p-2 text-center shadow-md">
          <p className="text-xs font-medium text-white">
            <span className="font-medium opacity-80 text-xs">Made By : </span>
            Vansh Sharma
          </p>
        </div>
      </div>

      {deleteConfirmId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 transform transition-all">
            <h3 className="text-lg font-bold text-text-dark mb-2">Delete Chat</h3>
            <p className="text-text-muted mb-6 text-sm">Are you sure you want to delete this chat? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={cancelDelete}
                className="px-4 py-2 rounded-lg text-text-muted hover:bg-bg-main transition-colors font-medium text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors shadow-sm font-medium text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
