import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePoll } from '../context/PollContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, BarChart3, Clock, Users } from 'lucide-react';

export default function PollHistory() {
  const navigate = useNavigate();
  const { state } = usePoll();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getTotalResponses = (responses: { [key: string]: number }) => {
    return Object.values(responses).reduce((sum, count) => sum + count, 0);
  };

  const getPercentage = (count: number, total: number) => {
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Poll History</h1>
              <p className="text-gray-600 text-lg">
                Review all your previous polls and their results
              </p>
            </div>
            <Button
              onClick={() => navigate('/teacher-dashboard')}
              className="bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>

          <Card className="bg-white card-shadow mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <BarChart3 className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{state.pollHistory.length}</p>
                  <p className="text-gray-600">Total Polls</p>
                </div>
                <div className="text-center">
                  <Users className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-2xl font-bold">
                    {state.pollHistory.reduce((sum, poll) => sum + getTotalResponses(poll.responses), 0)}
                  </p>
                  <p className="text-gray-600">Total Responses</p>
                </div>
                <div className="text-center">
                  <Clock className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-2xl font-bold">
                    {state.pollHistory.length > 0 
                      ? Math.round(state.pollHistory.reduce((sum, poll) => sum + getTotalResponses(poll.responses), 0) / state.pollHistory.length)
                      : 0
                    }
                  </p>
                  <p className="text-gray-600">Avg. Responses</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {state.pollHistory.length === 0 ? (
            <Card className="bg-white card-shadow">
              <CardContent className="p-12 text-center">
                <BarChart3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No polls yet</h3>
                <p className="text-gray-500">Create your first poll to see it here!</p>
              </CardContent>
            </Card>
          ) : (
            state.pollHistory.slice().reverse().map((poll, index) => {
              const totalResponses = getTotalResponses(poll.responses);
              
              return (
                <Card key={poll.id} className="bg-white card-shadow fade-in">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl font-bold text-gray-800 mb-2">
                          {poll.question}
                        </CardTitle>
                        <div className="flex items-center gap-4">
                          <Badge className="bg-blue-100 text-blue-800">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatDate(poll.createdAt)}
                          </Badge>
                          <Badge className="bg-green-100 text-green-800">
                            <Users className="w-3 h-3 mr-1" />
                            {totalResponses} responses
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      {poll.options.map((option, optionIndex) => {
                        const count = poll.responses[optionIndex] || 0;
                        const percentage = getPercentage(count, totalResponses);
                        
                        return (
                          <div key={optionIndex} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-700">{option}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">{count} votes</span>
                                <span className="font-bold text-blue-600">{percentage}%</span>
                              </div>
                            </div>
                            
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                              <div
                                className="progress-bar h-full bg-blue-500 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}