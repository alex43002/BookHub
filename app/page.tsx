import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpen, Target, BarChart3, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <BookOpen className="h-16 w-16 mx-auto text-primary" />
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Track Your Reading Journey
          </h1>
          <p className="text-xl text-muted-foreground">
            Keep track of your books, set reading goals, and visualize your progress
            with our intuitive book tracking platform.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/auth/signup">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="outline" size="lg">Sign In</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <Target className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Set Reading Goals</h3>
            <p className="text-muted-foreground">
              Set personalized reading goals and track your progress throughout the year.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <BarChart3 className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
            <p className="text-muted-foreground">
              Visualize your reading habits with detailed statistics and insights.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <Users className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Join Community</h3>
            <p className="text-muted-foreground">
              Connect with fellow readers and share your reading journey.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-16 border-t">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2024 BookTracker. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}