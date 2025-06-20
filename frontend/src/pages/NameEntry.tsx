import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePoll } from '../context/PollContext';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { User, ArrowRight } from 'lucide-react';

export default function NameEntry() {
  const navigate = useNavigate();
  const location = useLocation();
  const { dispatch } = usePoll();
  const [name, setName] = useState('');
  
  const role = location.state?.role as 'student' | 'teacher';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      const user = {
        id: Date.now().toString(),
        name: name.trim(),
        role
      };
      
      dispatch({ type: 'SET_USER', payload: user });
      dispatch({ type: 'ADD_PARTICIPANT', payload: user });
      
      if (role === 'teacher') {
        navigate('/teacher-dashboard');
      } else {
        navigate('/student-waiting');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white card-shadow fade-in">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <Badge className="mb-4 px-3 py-1 bg-blue-600 text-white border-none">
              <User className="w-4 h-4 mr-2" />
              {role === 'teacher' ? 'Teacher' : 'Student'} Registration
            </Badge>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Enter Your Name
            </h1>
            
            <p className="text-gray-600">
              {role === 'teacher' 
                ? 'Set up your teacher profile to start creating polls'
                : 'Join the polling session with your name'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-300"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full btn-primary text-white py-3 text-lg font-semibold rounded-lg flex items-center justify-center gap-2"
            >
              {role === 'teacher' ? "Let's Get Started" : 'Join Session'}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}