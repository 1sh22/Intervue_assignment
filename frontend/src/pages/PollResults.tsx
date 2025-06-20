import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePoll } from '../context/PollContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { BarChart3, Users, Clock, ArrowLeft } from 'lucide-react';

export default function PollResults() {
  const navigate = useNavigate();
  const { poll, results } = usePoll();

  useEffect(() => {
    if (poll?.currentUser?.isKicked) {
      navigate('/kicked-out');
    } else if (poll?.isActive) {
      navigate('/poll-question');
    }
  }, [poll?.isActive, poll?.currentUser?.isKicked, navigate]);

  if (!poll) {
    if (poll?.currentUser?.role === 'teacher') {
      navigate('/teacher-dashboard');
    } else {
      navigate('/student-waiting');
    }
    return null;
  }

  const totalResponses = Object.values(poll.responses).reduce((sum, count) => sum + count, 0);

  const getPercentage = (count: number) => {
    return totalResponses > 0 ? Math.round((count / totalResponses) * 100) : 0;
  };

  const handleBackToWaiting = () => {
    if (poll.currentUser?.role === 'teacher') {
      navigate('/teacher-dashboard');
    } else {
      navigate('/student-waiting');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-white card-shadow fade-in">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Badge className="px-4 py-2 bg-blue-500 text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Poll Results
            </Badge>
            <Badge className="px-4 py-2 bg-green-500 text-white">
              <Users className="w-4 h-4 mr-2" />
              {totalResponses} Responses
            </Badge>
          </div>
          
          <CardTitle className="text-3xl font-bold text-gray-800 leading-tight">
            {poll.question}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {poll.options.map((option, index) => {
              const count = poll.responses[index] || 0;
              const percentage = getPercentage(count);
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-800">{option}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{count} votes</span>
                      <span className="font-bold text-lg text-blue-600">{percentage}%</span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className="progress-bar h-full bg-blue-500 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {totalResponses === 0 && (
            <div className="text-center py-8">
              <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-xl text-gray-500">No responses yet</p>
              <p className="text-gray-400">Waiting for participants to submit their answers...</p>
            </div>
          )}

          <div className="pt-6 text-center">
            {poll.currentUser?.role === 'student' && (
              <div className="mb-6">
                <p className="text-lg text-gray-600 mb-2">
                  Thank you for participating!
                </p>
                <p className="text-gray-500">
                  Wait for the teacher to ask a new question...
                </p>
              </div>
            )}
            
            <Button
              onClick={handleBackToWaiting}
              className="btn-primary text-white px-8 py-3 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {poll.currentUser?.role === 'teacher' ? 'Back to Dashboard' : 'Wait for Next Question'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}