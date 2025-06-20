import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { AlertTriangle, Home } from 'lucide-react';

export default function KickedOut() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 card-shadow fade-in">
        <CardContent className="p-12 text-center">
          <Badge className="mb-6 px-4 py-2 bg-red-500 text-white">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Session Ended
          </Badge>
          
          <div className="mb-8">
            <AlertTriangle className="w-20 h-20 mx-auto text-red-500 mb-6" />
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              You've been removed
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              You have been removed from the polling session by the teacher.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => navigate('/')}
              className="w-full btn-primary text-white py-3 text-lg font-semibold rounded-lg"
            >
              <Home className="w-5 h-5 mr-2" />
              Return to Home
            </Button>
            
            <p className="text-sm text-gray-500">
              You can try joining again later
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}