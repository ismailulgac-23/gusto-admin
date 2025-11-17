"use client";
import axios from '@/axios';
import * as React from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useUserStore } from "@/context/UserContext";

export default function ChooseModerator({ onClose }) {
    const [moderators, setModerators] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [search, setSearch] = React.useState('');
    const userStore = useUserStore();
    const isModerator = userStore?.user?.isModerator;
    
    // Example moderator stats - in a real app, fetch this from API
    const moderatorStats = {
        totalAssignedChats: 1,
        activeChats: 1,
        totalMessages: 0,
        lastActivity: null
    };

    React.useEffect(() => {
        setLoading(true);
        axios.get('/admin/moderators').then((res) => {
            setModerators(res.data);
            setLoading(false);
        }).catch(err => {
            console.error('Moderatör verisi yüklenirken hata:', err);
            setLoading(false);
        });
    }, []);

    const filteredModerators = React.useMemo(() => {
        if (!search.trim()) return moderators;
        const searchTerm = search.toLowerCase();
        return moderators.filter(mod => 
            mod.name.toLowerCase().includes(searchTerm) || 
            (mod.email && mod.email.toLowerCase().includes(searchTerm))
        );
    }, [moderators, search]);

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return "Henüz aktivite yok";
        const date = new Date(dateString);
        return date.toLocaleString('tr-TR');
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl p-6 max-w-[800px] w-full shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
                    <h1 className='text-2xl font-bold text-gray-900 dark:text-white flex items-center'>
                        <Icon icon="heroicons:user-group" className="h-7 w-7 mr-2 text-blue-500" />
                        {isModerator ? "Moderatör İstatistikleri" : "Moderatör Seç"}
                    </h1>
                    <button 
                        onClick={() => onClose(null)}
                        className="p-2 rounded-full hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30 transition-colors text-gray-600 dark:text-gray-400"
                        aria-label="Kapat"
                    >
                        <Icon icon="heroicons:x-mark" className="h-6 w-6" />
                    </button>
                </div>

                {isModerator ? (
                    // Moderator statistics view
                    <div className="mb-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {/* Total Assigned Chats */}
                            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900/50">
                                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl dark:bg-blue-900/30">
                                    <Icon icon="heroicons:chat-bubble-left-right" className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                                </div>
                                <div className="mt-4">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Toplam Atanan Sohbet</span>
                                    <h4 className="mt-2 font-bold text-gray-800 text-xl dark:text-white">{moderatorStats.totalAssignedChats}</h4>
                                </div>
                            </div>

                            {/* Active Chats */}
                            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900/50">
                                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl dark:bg-green-900/30">
                                    <Icon icon="heroicons:chat-bubble-oval-left-ellipsis" className="h-6 w-6 text-green-600 dark:text-green-300" />
                                </div>
                                <div className="mt-4">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Aktif Sohbetler</span>
                                    <h4 className="mt-2 font-bold text-gray-800 text-xl dark:text-white">{moderatorStats.activeChats}</h4>
                                </div>
                            </div>

                            {/* Total Messages */}
                            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900/50">
                                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl dark:bg-purple-900/30">
                                    <Icon icon="heroicons:envelope" className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                                </div>
                                <div className="mt-4">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Toplam Mesaj</span>
                                    <h4 className="mt-2 font-bold text-gray-800 text-xl dark:text-white">{moderatorStats.totalMessages}</h4>
                                </div>
                            </div>

                            {/* Last Activity */}
                            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900/50">
                                <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-xl dark:bg-amber-900/30">
                                    <Icon icon="heroicons:clock" className="h-6 w-6 text-amber-600 dark:text-amber-300" />
                                </div>
                                <div className="mt-4">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Son Aktivite</span>
                                    <h4 className="mt-2 font-bold text-gray-800 text-base dark:text-white">{formatDate(moderatorStats.lastActivity)}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Search input */}
                        <div className="mb-6">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Icon icon="heroicons:magnifying-glass" className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="search"
                                    className="block w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Moderatör ara..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center py-8">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : filteredModerators.length === 0 ? (
                            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-8 text-center">
                                <Icon icon="heroicons:user-slash" className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                                <p className="text-gray-600 dark:text-gray-300">Moderatör bulunamadı</p>
                            </div>
                        ) : (
                            <div className='grid gap-4 max-h-[60vh] overflow-y-auto pr-1'>
                                {filteredModerators.map((moderator) => (
                                    <div 
                                        key={moderator.id}
                                        className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-800/80 cursor-pointer transition-all"
                                        onClick={() => onClose(moderator)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                                <span className="text-lg font-medium text-blue-600 dark:text-blue-300">
                                                    {moderator.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900 dark:text-white">{moderator.name}</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{moderator.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <span className={`px-3 py-1.5 text-xs rounded-full font-medium ${
                                                moderator.isActive 
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                                            }`}>
                                                {moderator.isActive ? 'Aktif' : 'Pasif'}
                                            </span>
                                            <Icon icon="heroicons:chevron-right" className="h-5 w-5 text-gray-400 ml-3" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                    <button
                        onClick={() => onClose(null)}
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mr-3"
                    >
                        {isModerator ? "Kapat" : "İptal"}
                    </button>
                </div>
            </div>
        </div>
    );
}
