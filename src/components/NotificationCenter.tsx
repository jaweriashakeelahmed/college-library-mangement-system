import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, Check, Trash2, Mail, MessageCircle, Smartphone } from 'lucide-react';
import { AppNotification } from '@/src/types';
import { NotificationService } from '@/src/services/notifications/NotificationService';

interface NotificationCenterProps {
  notifications: AppNotification[];
}

export function NotificationCenter({ notifications }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'All' | 'Unread'>('All');
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const filtered = notifications.filter(n => {
    if (filter === 'Unread' && n.read) return false;
    if (search && !n.title.toLowerCase().includes(search.toLowerCase()) && !n.message.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleMarkAllRead = () => {
    notifications.filter(n => !n.read).forEach(n => {
      NotificationService.markAsRead(n.id);
    });
  };

  const handleClearRead = () => {
    notifications.filter(n => n.read).forEach(n => {
      NotificationService.delete(n.id);
    });
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 rounded-full transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden flex flex-col max-h-[80vh]">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
            <div>
              <h3 className="font-bold text-slate-800">Notifications</h3>
              <p className="text-xs text-slate-500">{unreadCount} unread</p>
            </div>
            <div className="flex gap-2">
              <button onClick={handleMarkAllRead} className="text-xs text-blue-600 font-medium hover:text-blue-700 p-1">Mark all read</button>
            </div>
          </div>
          
          <div className="p-2 border-b border-slate-100 shrink-0">
             <input type="text" placeholder="Search notifications..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full text-sm px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none" />
             <div className="flex gap-2 mt-2">
               <button onClick={() => setFilter('All')} className={`text-xs px-3 py-1 rounded-full font-medium ${filter === 'All' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'}`}>All</button>
               <button onClick={() => setFilter('Unread')} className={`text-xs px-3 py-1 rounded-full font-medium ${filter === 'Unread' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>Unread</button>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                <Bell className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                No notifications found.
              </div>
            ) : (
              filtered.map(notification => (
                <div key={notification.id} className={`p-3 rounded-xl border ${notification.read ? 'bg-white border-transparent' : 'bg-blue-50/50 border-blue-100'} hover:bg-slate-50 transition-colors flex gap-3 group relative`}>
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notification.read ? 'bg-transparent' : 'bg-blue-500'}`}></div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-semibold truncate ${notification.read ? 'text-slate-700' : 'text-slate-900'}`}>{notification.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">{notification.message}</p>
                    <div className="text-[10px] text-slate-400 mt-2 font-medium flex items-center justify-between">
                      <span>{new Date(notification.createdAt).toLocaleString()}</span>
                      <div className="flex gap-1">
                        {notification.deliveryChannels?.includes('Email') && <Mail className="w-3 h-3 text-slate-400" />}
                        {notification.deliveryChannels?.includes('WhatsApp') && <MessageCircle className="w-3 h-3 text-slate-400" />}
                        {notification.deliveryChannels?.includes('SMS') && <Smartphone className="w-3 h-3 text-slate-400" />}
                      </div>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1 shrink-0">
                     <button onClick={() => notification.read ? NotificationService.markAsUnread(notification.id) : NotificationService.markAsRead(notification.id)} className="p-1 text-slate-400 hover:text-blue-600 rounded bg-white shadow-sm border border-slate-100">
                       <Check className="w-3 h-3" />
                     </button>
                     <button onClick={() => NotificationService.delete(notification.id)} className="p-1 text-slate-400 hover:text-rose-600 rounded bg-white shadow-sm border border-slate-100">
                       <Trash2 className="w-3 h-3" />
                     </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-2 border-t border-slate-100 shrink-0 text-center">
             <button onClick={handleClearRead} className="text-xs font-medium text-slate-500 hover:text-slate-700">Clear read notifications</button>
          </div>
        </div>
      )}
    </div>
  );
}
