import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePoll } from '../context/PollContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Clock, CheckCircle, Users } from 'lucide-react';

export default function PollQuestion() {
  const navigate = useNavigate();
  const { poll, submitVote } = usePoll();
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    if (poll.currentUser?.isKicked) {
      navigate('/kicked-out');
    } else if (!poll.currentPoll?.isActive) {
      if (poll.userResponse !== null) {
        navigate('/poll-results');
      } else {
        navigate('/student-waiting');
      }
    }
  }, [poll.currentPoll?.isActive, poll.currentUser?.isKicked, poll.userResponse, navigate]);

  const handleSubmit = () => {
    if (selectedOption !== null) {
      submitVote(poll.options[selectedOption]);
      setSelectedOption(null);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!poll.currentPoll) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl bg-white card-shadow fade-in">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Badge className="px-4 py-2 bg-green-500 text-white">
              <Users className="w-4 h-4 mr-2" />
              Live Poll
            </Badge>
            <Badge className="px-4 py-2 bg-red-500 text-white">
              <Clock className="w-4 h-4 mr-2" />
              {formatTime(poll.timeRemaining)}
            </Badge>
          </div>
          
          <CardTitle className="text-3xl font-bold text-gray-800 leading-tight">
            {poll.currentPoll.question}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {poll.currentPoll.options.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedOption(index)}
                className={`p-6 text-left rounded-xl border-2 transition-all duration-300 poll-option ${
                  selectedOption === index
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                    selectedOption === index
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedOption === index && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className="text-lg font-medium text-gray-800">
                    {option}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="pt-6">
            <Button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className="w-full bg-blue-600 text-white py-4 text-lg font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Answer
            </Button>
          </div>

          <div className="text-center pt-4">
            <p className="text-gray-500">
              Time remaining: <span className="font-semibold text-red-600">
                {formatTime(poll.timeRemaining)}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}