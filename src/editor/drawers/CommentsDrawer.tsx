import React, { useState } from 'react';
import { CommentThread, CommentReply } from '../../types/canvas';
import { MessageSquare, CheckCircle2, Trash2, Send, CornerDownRight, Eye, EyeOff } from 'lucide-react';
import { generateId } from '../../utils/id';

interface CommentsDrawerProps {
  comments?: CommentThread[];
  activeCommentId?: string | null;
  showComments: boolean;
  onToggleShowComments: () => void;
  onSelectComment: (id: string) => void;
  onAddComment: (comment: CommentThread) => void;
  onResolveComment: (id: string) => void;
  onDeleteComment: (id: string) => void;
  onAddReply?: (threadId: string, reply: CommentReply) => void;
}

const AUTHOR_COLORS = ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];

export const CommentsDrawer: React.FC<CommentsDrawerProps> = ({
  comments = [],
  activeCommentId,
  showComments,
  onToggleShowComments,
  onSelectComment,
  onAddComment,
  onResolveComment,
  onDeleteComment,
}) => {
  const [newCommentText, setNewCommentText] = useState('');
  const [authorName, setAuthorName] = useState('Designer');
  const [replyTextMap, setReplyTextMap] = useState<{ [threadId: string]: string }>({});

  const handleCreateGeneralComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newThread: CommentThread = {
      id: generateId('cmt'),
      x: 120 + Math.random() * 200,
      y: 120 + Math.random() * 200,
      author: authorName.trim() || 'Designer',
      avatarColor: AUTHOR_COLORS[Math.floor(Math.random() * AUTHOR_COLORS.length)],
      text: newCommentText.trim(),
      createdAt: Date.now(),
      resolved: false,
      replies: [],
    };

    onAddComment(newThread);
    setNewCommentText('');
  };

  const handleAddReply = (threadId: string) => {
    const text = replyTextMap[threadId];
    if (!text || !text.trim()) return;

    const thread = comments.find((c) => c.id === threadId);
    if (!thread) return;

    const newReply: CommentReply = {
      id: generateId('reply'),
      author: authorName.trim() || 'Reviewer',
      avatarColor: AUTHOR_COLORS[Math.floor(Math.random() * AUTHOR_COLORS.length)],
      text: text.trim(),
      createdAt: Date.now(),
    };

    const updatedReplies = [...(thread.replies || []), newReply];
    thread.replies = updatedReplies;
    setReplyTextMap((prev) => ({ ...prev, [threadId]: '' }));
    onSelectComment(threadId);
  };

  const activeCount = comments.filter((c) => !c.resolved).length;

  return (
    <div className="w-80 h-full bg-[#0f1118] border-r border-neutral-800 flex flex-col z-20 select-none">
      {/* Header */}
      <div className="p-4 border-b border-neutral-800">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <MessageSquare size={18} className="text-violet-400" />
            <span>Design Feedback</span>
            {activeCount > 0 && (
              <span className="bg-violet-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {activeCount}
              </span>
            )}
          </h3>

          <button
            onClick={onToggleShowComments}
            title={showComments ? 'Hide canvas comment pins' : 'Show canvas comment pins'}
            className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            {showComments ? <Eye size={15} /> : <EyeOff size={15} />}
          </button>
        </div>
        <p className="text-[11px] text-neutral-400 mt-0.5">
          Review, pin notes, and collaborate on design iterations
        </p>
      </div>

      {/* Comment List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {comments.length === 0 ? (
          <div className="p-6 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center space-y-2">
            <MessageSquare size={24} className="mx-auto text-neutral-600" />
            <p className="text-xs font-semibold text-neutral-300">No Comments Yet</p>
            <p className="text-[11px] text-neutral-500">
              Leave feedback below or select the Comment tool in the left toolbar to pin a note anywhere on canvas.
            </p>
          </div>
        ) : (
          comments.map((thread, index) => {
            const isActive = activeCommentId === thread.id;

            return (
              <div
                key={thread.id}
                onClick={() => onSelectComment(thread.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  thread.resolved
                    ? 'bg-neutral-900/40 border-neutral-800/60 opacity-60'
                    : isActive
                    ? 'bg-violet-950/20 border-violet-500 ring-1 ring-violet-500/50'
                    : 'bg-neutral-900/90 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                {/* Thread Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow"
                      style={{ backgroundColor: thread.avatarColor || '#ec4899' }}
                    >
                      {thread.author.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-white">{thread.author}</span>
                    <span className="text-[9px] text-neutral-500">#{index + 1}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onResolveComment(thread.id);
                      }}
                      title={thread.resolved ? 'Reopen Thread' : 'Mark as Resolved'}
                      className={`p-1 rounded transition-colors ${
                        thread.resolved
                          ? 'text-emerald-400 hover:bg-emerald-950/50'
                          : 'text-neutral-500 hover:text-emerald-400 hover:bg-neutral-800'
                      }`}
                    >
                      <CheckCircle2 size={15} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteComment(thread.id);
                      }}
                      title="Delete Thread"
                      className="p-1 rounded text-neutral-500 hover:text-red-400 hover:bg-neutral-800 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Comment Text */}
                <p className="text-xs text-neutral-200 mt-2 leading-relaxed">{thread.text}</p>

                {/* Replies */}
                {thread.replies && thread.replies.length > 0 && (
                  <div className="mt-3 pl-3 border-l-2 border-neutral-800 space-y-2">
                    {thread.replies.map((reply) => (
                      <div key={reply.id} className="text-xs space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: reply.avatarColor }}
                          />
                          <span className="font-semibold text-neutral-300 text-[11px]">
                            {reply.author}
                          </span>
                        </div>
                        <p className="text-neutral-300 text-[11px] pl-3.5">{reply.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Input */}
                {!thread.resolved && (
                  <div
                    className="mt-3 pt-2 border-t border-neutral-800/80 flex gap-1.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="text"
                      value={replyTextMap[thread.id] || ''}
                      onChange={(e) =>
                        setReplyTextMap((prev) => ({ ...prev, [thread.id]: e.target.value }))
                      }
                      placeholder="Write a reply..."
                      className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1 text-[11px] text-white placeholder-neutral-500 outline-none focus:border-violet-500"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddReply(thread.id)}
                    />
                    <button
                      onClick={() => handleAddReply(thread.id)}
                      className="p-1 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors shrink-0"
                    >
                      <CornerDownRight size={13} />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* New Comment Input Box */}
      <form onSubmit={handleCreateGeneralComment} className="p-4 border-t border-neutral-800 space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-semibold text-neutral-300">Add Feedback</label>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Your name"
            className="w-24 text-[10px] bg-neutral-900 border border-neutral-800 rounded px-1.5 py-0.5 text-white outline-none focus:border-violet-500"
          />
        </div>
        <div className="flex gap-2">
          <textarea
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            rows={2}
            placeholder="Type comment or feedback..."
            className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-xs text-white placeholder-neutral-500 outline-none focus:border-violet-500 resize-none"
          />
          <button
            type="submit"
            disabled={!newCommentText.trim()}
            className="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white px-3 rounded-lg flex items-center justify-center transition-colors shrink-0 shadow-sm"
          >
            <Send size={15} />
          </button>
        </div>
      </form>
    </div>
  );
};
