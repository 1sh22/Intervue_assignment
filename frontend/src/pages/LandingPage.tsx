import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePoll } from '../context/PollContext';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Users, GraduationCap, Zap } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { dispatch } = usePoll();
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | null>(null);

  const roles = [
    {
      id: 'student' as const,
      title: "I'm a Student",
      description: "Join live polls, submit answers, and view real-time results",
      icon: GraduationCap,
      color: "bg-blue-500"
    },
    {
      id: 'teacher' as const,
      title: "I'm a Teacher",
      description: "Create polls, manage participants, and view live responses",
      icon: Users,
      color: "bg-purple-500"
    }
  ];

  const handleContinue = () => {
    if (selectedRole) {
      navigate('/name-entry', { state: { role: selectedRole } });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12 fade-in">
          <Badge className="mb-6 px-4 py-2 bg-blue-600 text-white border-blue-600 hover:bg-blue-700 transition-all duration-300">
            <Zap className="w-4 h-4 mr-2" />
            Live Polling System
          </Badge>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Welcome to the Live Polling System
          </h1>
          
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Please select the role that best describes you to begin using the live polling system
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Card
                key={role.id}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                  selectedRole === role.id
                    ? 'ring-4 ring-white/50 bg-white/95 shadow-2xl'
                    : 'bg-white/80 hover:bg-white/90 card-shadow'
                } poll-option`}
                onClick={() => setSelectedRole(role.id)}
              >
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <div className={`${role.color} p-3 rounded-full mr-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800">
                      {role.title}
                    </h2>
                  </div>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {role.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center fade-in">
          <Button
            onClick={handleContinue}
            disabled={!selectedRole}
            className="btn-primary text-white px-12 py-4 text-lg font-semibold rounded-full disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}