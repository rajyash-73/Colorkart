import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md mx-4 dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 mb-6">
            The page you're looking for doesn't exist.
          </p>
          
          <div
            className="cursor-pointer" 
            onClick={() => window.location.href = '/'}
          >
            <Button className="w-full flex items-center justify-center">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
