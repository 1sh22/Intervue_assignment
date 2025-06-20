import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePoll } from '../context/PollContext';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Clock, Users, Loader2 } from 'lucide-react';

export default function StudentWaiting() {
  const navigate = useNavigate();
  const { state, poll } = usePoll();

  useEffect(() => {
    if (state.currentUser?.isKicked) {
      navigate('/kicked-out');
    } else if (poll) {
      navigate('/poll-question');
    }
  }, [state.currentPoll?.isActive, state.currentUser?.isKicked, navigate, poll]);

  const students = state.participants.filter(p => p.role === 'student' && !p.isKicked);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white card-shadow fade-in">
        <CardContent className="p-12 text-center">
          <div className="mb-8">
            <Badge className="mb-4 px-4 py-2 bg-blue-500 text-white">
              <Users className="w-4 h-4 mr-2" />
              Student Session
            </Badge>
            
            <div className="mb-6">
              <Loader2 className="w-16 h-16 mx-auto text-blue-500 animate-spin mb-4" />
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Waiting for Teacher
              </h1>
              <p className="text-xl text-gray-600">
                Please wait for the teacher to start a poll question...
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 bg-white rounded-xl">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-1">Students Online</h3>
              <p className="text-2xl font-bold text-blue-600">{students.length}</p>
            </div>
            
            <div className="p-6 bg-white rounded-xl">
              <Clock className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-1">Session Status</h3>
              <p className="text-lg font-semibold text-purple-600">Active</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-500 mb-4">
              Welcome, <span className="font-semibold text-gray-700">{state.currentUser?.name}</span>!
            </p>
            <div className="flex items-center justify-center text-sm text-gray-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
              Connected to live session
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}