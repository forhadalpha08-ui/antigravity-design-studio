import React from 'react';
import { CommentThread } from '../../../types/canvas';
import { MessageSquare } from 'lucide-react';

interface RenderCommentsProps {
  comments?: CommentThread[];
  activeCommentId?: string | null;
  onSelectComment: (id: string) => void;
}

export const RenderComments: React.FC<RenderCommentsProps> = ({
  comments = [],
  activeCommentId,
  onSelectComment,
}) => {
  if (!comments || comments.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-[10002]">
      {comments.map((thread, index) => {
        const isActive = activeCommentId === thread.id;
        const initial = (thread.author || 'U').charAt(0).toUpperCase();

        return (
          <div
            key={thread.id}
            className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110 group"
            style={{
              left: `${thread.x}px`,
              top: `${thread.y}px`,
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSelectComment(thread.id);
            }}
          >
            {/* Comment Pin Badge */}
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full shadow-lg border text-white font-bold text-xs transition-all ${
                thread.resolved
                  ? 'bg-neutral-800/90 border-neutral-600 opacity-60'
                  : isActive
                  ? 'bg-violet-600 border-white ring-4 ring-violet-500/30'
                  : 'bg-indigo-600 border-indigo-400 hover:bg-violet-600'
              }`}
            >
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] text-white"
                style={{ backgroundColor: thread.avatarColor || '#ec4899' }}
              >
                {initial}
              </div>
              <span>#{index + 1}</span>
              {thread.replies && thread.replies.length > 0 && (
                <span className="text-[10px] opacity-80 flex items-center gap-0.5">
                  <MessageSquare size={10} />
                  {thread.replies.length}
                </span>
              )}
            </div>

            {/* Hover preview tooltip */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-neutral-900/95 border border-neutral-700 text-neutral-200 text-xs px-2.5 py-1.5 rounded-md shadow-2xl whitespace-nowrap z-50 pointer-events-none">
              <p className="font-semibold text-white">{thread.author}</p>
              <p className="text-[11px] text-neutral-300 max-w-[180px] truncate">{thread.text}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
