import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePoll } from '../context/PollContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Plus, Play, History, Users, MessageCircle, UserX, Clock } from 'lucide-react';

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const { poll, results, createPoll, endPoll } = usePoll();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [chatMessage, setChatMessage] = useState('');

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleCreatePoll = () => {
    const validOptions = options.filter(opt => opt.trim() !== '');
    if (question.trim() && validOptions.length >= 2) {
      createPoll({
        question: question.trim(),
        options: validOptions,
        timer
      });
      setQuestion('');
      setOptions(['', '', '', '']);
    }
  };

  const startPoll = () => {
    if (poll) {
      endPoll();
    }
  };

  const kickParticipant = (participantId: string) => {
    // Implementation needed
  };

  const sendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatMessage.trim() && poll) {
      // Implementation needed
      setChatMessage('');
    }
  };

  const students = poll?.participants.filter(p => p.role === 'student' && !p.isKicked) || [];

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 fade-in">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Teacher Dashboard
              </h1>
              <p className="text-white/80 text-lg">
                Welcome back, {poll?.currentUser?.name}
              </p>
            </div>
            <Button
              onClick={() => navigate('/poll-history')}
              className="bg-white/20 text-white hover:bg-white/30 border border-white/30"
            >
              <History className="w-4 h-4 mr-2" />
              Poll History
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white card-shadow">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Users className="w-8 h-8 mr-3" />
                  <div>
                    <p className="text-2xl font-bold">{students.length}</p>
                    <p className="text-white/80">Active Students</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white card-shadow">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <History className="w-8 h-8 mr-3" />
                  <div>
                    <p className="text-2xl font-bold">{results.length}</p>
                    <p className="text-white/80">Polls Created</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white card-shadow">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Clock className="w-8 h-8 mr-3" />
                  <div>
                    <p className="text-2xl font-bold">
                      {poll?.isActive ? 'Active' : 'Ready'}
                    </p>
                    <p className="text-white/80">Poll Status</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Poll Creation */}
          <div className="lg:col-span-2">
            <Card className="bg-white card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  Create New Poll
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question
                  </label>
                  <Input
                    placeholder="Enter your poll question..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timer (seconds)
                  </label>
                  <Input
                    type="number"
                    min="10"
                    max="300"
                    value={timer}
                    onChange={(e) => setTimer(Number(e.target.value))}
                    className="w-32"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Options
                  </label>
                  <div className="space-y-3">
                    {options.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder={`Option ${index + 1}`}
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          className="flex-1"
                        />
                        {options.length > 2 && (
                          <Button
                            onClick={() => removeOption(index)}
                            variant="outline"
                            size="sm"
                            className="px-3"
                          >
                            ×
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {options.length < 6 && (
                    <Button
                      onClick={addOption}
                      variant="outline"
                      className="mt-3"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Option
                    </Button>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleCreatePoll}
                    disabled={!question.trim() || options.filter(opt => opt.trim()).length < 2}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Create Poll
                  </Button>
                  
                  {poll && !poll.isActive && (
                    <Button
                      onClick={startPoll}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Poll
                    </Button>
                  )}
                </div>

                {poll && (
                  <Button onClick={endPoll} className="bg-red-500 text-white hover:bg-red-600 mt-4">End Poll</Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Participants & Chat */}
          <div className="space-y-6">
            {/* Participants */}
            <Card className="bg-white card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Participants ({students.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {students.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3">
                          {participant.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium">{participant.name}</span>
                      </div>
                      <Button
                        onClick={() => kickParticipant(participant.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <UserX className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {students.length === 0 && (
                    <p className="text-gray-500 text-center py-4">
                      No students have joined yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Chat */}
            <Card className="bg-white card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Chat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
                  {poll?.chatMessages.map((message) => (
                    <div key={message.id} className="p-2 bg-gray-50 rounded">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{message.sender}</span>
                        <span className="text-xs text-gray-500">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm">{message.message}</p>
                    </div>
                  ))}
                </div>
                
                <form onSubmit={sendChatMessage} className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="sm">
                    Send
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}