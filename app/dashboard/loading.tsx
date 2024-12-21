import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function DashboardLoading() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Books</h1>
      </div>
      <div className="min-h-[400px] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    </div>
  );
}