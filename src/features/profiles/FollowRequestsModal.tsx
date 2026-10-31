import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserCheck, UserX, Loader2, Users } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { FollowRequest } from '../../types';
import { profileService } from '../../services/profileService';
import { useToast } from '../../hooks/useToast';

interface FollowRequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onRequestHandled?: () => void;
}

export const FollowRequestsModal: React.FC<FollowRequestsModalProps> = ({
  isOpen,
  onClose,
  userId,
  onRequestHandled,
}) => {
  const [requests, setRequests] = useState<FollowRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!isOpen) return;
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const data = await profileService.getFollowRequests(userId);
        setRequests(data);
      } catch {
        toast('Failed to load follow requests', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [isOpen, userId, toast]);

  const handleRespond = async (requestId: string, accept: boolean) => {
    try {
      setProcessingId(requestId);
      await profileService.respondFollowRequest(requestId, accept);
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
      toast(accept ? 'Follow request accepted' : 'Follow request declined', 'info');
      if (onRequestHandled) onRequestHandled();
    } catch {
      toast('Failed to process request', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm" title="Follow Requests">
      <div className="flex flex-col max-h-[380px] overflow-y-auto space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
          </div>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-neutral-400">
            <Users className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              No pending requests
            </p>
            <p className="text-xs text-neutral-500">
              When people request to follow your private account, they will appear here.
            </p>
          </div>
        ) : (
          requests.map((req) => (
            <div
              key={req.id}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors"
            >
              <Link
                to={`/profile/${req.requester?.username}`}
                onClick={onClose}
                className="flex items-center gap-3"
              >
                <Avatar
                  src={req.requester?.avatar_url}
                  alt={req.requester?.username || 'User'}
                  size="sm"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-neutral-900 dark:text-white hover:underline">
                    {req.requester?.username}
                  </span>
                  <span className="text-[11px] text-neutral-500 truncate max-w-[120px]">
                    {req.requester?.full_name}
                  </span>
                </div>
              </Link>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => handleRespond(req.id, true)}
                  disabled={processingId === req.id}
                >
                  Confirm
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleRespond(req.id, false)}
                  disabled={processingId === req.id}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
};
