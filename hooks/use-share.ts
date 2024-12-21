import { useState } from 'react';
import { trpc } from '@/lib/trpc/client';
import { useToast } from '@/hooks/use-toast';
import type { ShareFormData } from '@/lib/validators/social';

export function useShare() {
  const [isSharing, setIsSharing] = useState(false);
  const { toast } = useToast();
  const utils = trpc.useContext();

  const shareBook = trpc.social.share.useMutation({
    onSuccess: () => {
      utils.social.getFeed.invalidate();
      setIsSharing(false);
      toast({
        title: 'Shared successfully',
        description: 'Your update has been shared',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to share update',
        variant: 'destructive',
      });
    },
  });

  const handleShare = async (data: ShareFormData) => {
    setIsSharing(true);
    try {
      await shareBook.mutateAsync(data);
    } finally {
      setIsSharing(false);
    }
  };

  return {
    isSharing,
    handleShare,
  };
}