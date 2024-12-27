'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ActiveChallenges } from '@/components/challenges/active-challenges';
import { CompletedChallenges } from '@/components/challenges/completed-challenges';
import { CreateChallengeDialog } from '@/components/challenges/create-challenge-dialog';

export default function ChallengePage() {
  const [activeTab, setActiveTab] = useState('active');

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Reading Challenges</h1>
        <CreateChallengeDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Challenge
          </Button>
        </CreateChallengeDialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">Active Challenges</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <ActiveChallenges />
        </TabsContent>

        <TabsContent value="completed">
          <CompletedChallenges />
        </TabsContent>
      </Tabs>
    </div>
  );
}