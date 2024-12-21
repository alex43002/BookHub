'use client';

import { Button } from '@/components/ui/button';
import { Share } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareButtonProps {
  shareId: string;
  onShare?: () => void;
}

export function ShareButton({ shareId, onShare }: ShareButtonProps) {
  const { toast } = useToast();

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/share/${shareId}`
      );
      toast({
        title: 'Link copied',
        description: 'Share link has been copied to clipboard',
      });
      onShare?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy share link',
        variant: 'destructive',
      });
    }
  };

  return (
    <Button variant="ghost" size="sm" className="gap-2" onClick={handleShare}>
      <Share className="h-4 w-4" />
      Share
    </Button>
  );
}