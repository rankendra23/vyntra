import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Send,
  Plus,
  MessageSquare,
  ArrowLeft,
  Search,
  Loader2,
  CheckCheck,
} from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Conversation, Message, Profile } from '../../types';
import { messageService } from '../../services/messageService';
import { profileService } from '../../services/profileService';
import { useAuth } from '../auth/AuthContext';
import { useToast } from '../../hooks/useToast';
import { formatTimeAgo } from '../../lib/utils';

export const MessagesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const targetUserIdParam = searchParams.get('user');

  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loadingConv, setLoadingConv] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [searchUserQuery, setSearchUserQuery] = useState('');
  const [suggestedUsers, setSuggestedUsers] = useState<Profile[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversations
  useEffect(() => {
    if (!user) return;
    let mounted = true;

    const loadConvs = async () => {
      try {
        setLoadingConv(true);
        const data = await messageService.getConversations(user.id);
        if (mounted) {
          setConversations(data);
          // If query param target user was passed, find or start conversation
          if (targetUserIdParam) {
            const existing = data.find((c) =>
              c.members.some((m) => m.id === targetUserIdParam)
            );
            if (existing) {
              setActiveConvId(existing.id);
            } else {
              const newConvId = await messageService.startConversation(
                user.id,
                targetUserIdParam
              );
              setActiveConvId(newConvId);
              const refreshed = await messageService.getConversations(user.id);
              setConversations(refreshed);
            }
          } else if (data.length > 0 && !activeConvId) {
            setActiveConvId(data[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load conversations:', err);
      } finally {
        if (mounted) setLoadingConv(false);
      }
    };

    loadConvs();
    return () => {
      mounted = false;
    };
  }, [user, targetUserIdParam]);

  // Load messages when activeConvId changes
  useEffect(() => {
    if (!activeConvId) return;
    let mounted = true;

    const loadMsgs = async () => {
      try {
        setLoadingMsgs(true);
        const msgs = await messageService.getMessages(activeConvId);
        if (mounted) {
          setMessages(msgs);
        }
      } catch {
        toast('Failed to load messages', 'error');
      } finally {
        if (mounted) setLoadingMsgs(false);
      }
    };

    loadMsgs();
    return () => {
      mounted = false;
    };
  }, [activeConvId, toast]);

  // Load suggested users for new chat modal
  useEffect(() => {
    if (!isNewChatOpen || !user) return;
    const fetchUsers = async () => {
      const list = await profileService.getSuggestedUsers(user.id);
      setSuggestedUsers(list);
    };
    fetchUsers();
  }, [isNewChatOpen, user]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !activeConvId || !messageText.trim()) return;

    const text = messageText.trim();
    setMessageText('');

    // Optimistic message
    const tempId = `temp_${Date.now()}`;
    const optimisticMsg: Message = {
      id: tempId,
      conversation_id: activeConvId,
      sender_id: user.id,
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      const realMsg = await messageService.sendMessage(activeConvId, user.id, text);
      setMessages((prev) => prev.map((m) => (m.id === tempId ? realMsg : m)));
    } catch {
      toast('Failed to send message', 'error');
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    }
  };

  const handleStartChatWith = async (targetUser: Profile) => {
    if (!user) return;
    try {
      setIsNewChatOpen(false);
      const convId = await messageService.startConversation(user.id, targetUser.id);
      const refreshed = await messageService.getConversations(user.id);
      setConversations(refreshed);
      setActiveConvId(convId);
    } catch {
      toast('Failed to open chat', 'error');
    }
  };

  const activeConv = conversations.find((c) => c.id === activeConvId);
  const otherMember = activeConv?.members.find((m) => m.id !== user?.id) || activeConv?.members[0];

  return (
    <div className="w-full max-w-5xl h-[calc(100vh-80px)] md:h-[calc(100vh-100px)] px-2 sm:px-4 py-2 flex">
      <div className="w-full h-full bg-white dark:bg-[#121214] border border-neutral-200 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-sm flex">
        {/* Left pane: Conversations List */}
        <div
          className={`w-full md:w-[320px] lg:w-[360px] border-r border-neutral-200 dark:border-neutral-800 flex flex-col shrink-0 ${
            activeConvId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Header */}
          <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <h2 className="text-base font-bold text-neutral-900 dark:text-white">
              Direct Messages
            </h2>
            <button
              type="button"
              onClick={() => setIsNewChatOpen(true)}
              className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 hover:bg-teal-100 transition-colors"
              title="New message"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Conversations scroll area */}
          <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800/40">
            {loadingConv ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center text-neutral-400">
                <MessageSquare className="w-10 h-10 mb-2 opacity-50" />
                <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  No conversations yet
                </p>
                <p className="text-[11px] text-neutral-500 mt-1">
                  Connect with creators to start chatting.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3"
                  onClick={() => setIsNewChatOpen(true)}
                >
                  Start Chat
                </Button>
              </div>
            ) : (
              conversations.map((conv) => {
                const partner = conv.members.find((m) => m.id !== user?.id) || conv.members[0];
                const isSelected = conv.id === activeConvId;

                return (
                  <div
                    key={conv.id}
                    onClick={() => setActiveConvId(conv.id)}
                    className={`flex items-center gap-3 p-3.5 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-neutral-100/90 dark:bg-neutral-800/70'
                        : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/30'
                    }`}
                  >
                    <Avatar
                      src={partner?.avatar_url}
                      alt={partner?.username || 'User'}
                      size="md"
                    />
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                          {partner?.username}
                        </span>
                        {conv.last_message && (
                          <span className="text-[10px] text-neutral-400">
                            {formatTimeAgo(conv.last_message.created_at)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-500 truncate mt-0.5">
                        {conv.last_message?.content || 'No messages yet'}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right pane: Chat View */}
        <div
          className={`flex-1 flex flex-col h-full bg-neutral-50/50 dark:bg-[#0c0c0e]/50 ${
            !activeConvId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {activeConvId && otherMember ? (
            <>
              {/* Chat Header */}
              <div className="h-16 px-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-white dark:bg-[#121214] shrink-0">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveConvId(null)}
                    className="md:hidden p-1.5 rounded-lg text-neutral-500 hover:text-neutral-800 dark:hover:text-white"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <Avatar
                    src={otherMember.avatar_url}
                    alt={otherMember.username}
                    size="sm"
                  />
                  <div className="flex flex-col">
                    <span
                      onClick={() => navigate(`/profile/${otherMember.username}`)}
                      className="text-xs font-bold text-neutral-900 dark:text-white hover:underline cursor-pointer"
                    >
                      {otherMember.username}
                    </span>
                    <span className="text-[10px] text-emerald-500 font-medium">
                      Active now
                    </span>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate(`/profile/${otherMember.username}`)}
                >
                  View Profile
                </Button>
              </div>

              {/* Messages Thread */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loadingMsgs ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-neutral-400">
                    <Avatar src={otherMember.avatar_url} size="xl" className="mb-2" />
                    <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                      {otherMember.full_name}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1">
                      Say hello to start the conversation!
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.sender_id === user?.id;

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                            isMe
                              ? 'bg-teal-600 text-white rounded-br-none'
                              : 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700/60 rounded-bl-none'
                          }`}
                        >
                          {msg.content}
                        </div>
                        <span className="text-[9px] text-neutral-400 mt-1 px-1">
                          {formatTimeAgo(msg.created_at)}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Composer */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 bg-white dark:bg-[#121214] border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-2 shrink-0"
              >
                <input
                  type="text"
                  placeholder="Message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-xs bg-neutral-100 dark:bg-neutral-800/70 rounded-2xl focus:outline-none focus:ring-1 focus:ring-teal-500 text-neutral-900 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={!messageText.trim()}
                  className="p-2.5 rounded-2xl bg-teal-600 text-white disabled:opacity-40 hover:bg-teal-500 transition-colors shadow-sm"
                  aria-label="Send"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            // No chat selected empty state
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-neutral-400">
              <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-3">
                <MessageSquare className="w-8 h-8 opacity-40 text-teal-600" />
              </div>
              <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-200">
                Your Messages
              </h3>
              <p className="text-xs text-neutral-500 max-w-xs mt-1 mb-4">
                Send private photos and messages to a friend or creator.
              </p>
              <Button size="sm" onClick={() => setIsNewChatOpen(true)}>
                Send Message
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Start New Chat Modal */}
      <Modal
        isOpen={isNewChatOpen}
        onClose={() => setIsNewChatOpen(false)}
        maxWidth="sm"
        title="New Message"
      >
        <div className="space-y-3">
          <p className="text-xs text-neutral-500">Suggested creators</p>
          <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
            {suggestedUsers.map((u) => (
              <div
                key={u.id}
                onClick={() => handleStartChatWith(u)}
                className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors"
              >
                <Avatar src={u.avatar_url} alt={u.username} size="sm" />
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-neutral-900 dark:text-white">
                    {u.username}
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    {u.full_name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};
