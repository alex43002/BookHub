'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SocialFeed } from '@/components/social/social-feed';
import { FollowersList } from '@/components/social/followers-list';
import { FollowingList } from '@/components/social/following-list';
import { useSession } from 'next-auth/react';

export default function SocialPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('feed');

  if (!session) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Reading Community</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="feed">Feed</TabsTrigger>
          <TabsTrigger value="followers">Followers</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>

        <TabsContent value="feed">
          <SocialFeed />
        </TabsContent>

        <TabsContent value="followers">
          <FollowersList userId={session.user.id} />
        </TabsContent>

        <TabsContent value="following">
          <FollowingList userId={session.user.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}