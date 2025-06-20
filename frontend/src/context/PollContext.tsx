import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

interface Poll {
  id: string;
  question: string;
  options: string[];
  timer: number;
  responses: { [key: string]: number };
  isActive: boolean;
  createdAt: Date;
}

interface Participant {
  id: string;
  name: string;
  role: 'teacher' | 'student';
  isKicked?: boolean;
}

interface PollState {
  currentUser: Participant | null;
  currentPoll: Poll | null;
  pollHistory: Poll[];
  participants: Participant[];
  timeRemaining: number;
  userResponse: string | null;
  chatMessages: Array<{ id: string; sender: string; message: string; timestamp: Date }>;
}

type PollAction =
  | { type: 'SET_USER'; payload: Participant }
  | { type: 'CREATE_POLL'; payload: Omit<Poll, 'id' | 'responses' | 'isActive' | 'createdAt'> }
  | { type: 'START_POLL'; payload: Poll }
  | { type: 'END_POLL' }
  | { type: 'SUBMIT_RESPONSE'; payload: { optionIndex: number } }
  | { type: 'UPDATE_TIMER'; payload: number }
  | { type: 'ADD_PARTICIPANT'; payload: Participant }
  | { type: 'REMOVE_PARTICIPANT'; payload: string }
  | { type: 'KICK_PARTICIPANT'; payload: string }
  | { type: 'ADD_CHAT_MESSAGE'; payload: { sender: string; message: string } }
  | { type: 'RESET_USER_RESPONSE' };

const initialState: PollState = {
  currentUser: null,
  currentPoll: null,
  pollHistory: [],
  participants: [],
  timeRemaining: 0,
  userResponse: null,
  chatMessages: []
};

function pollReducer(state: PollState, action: PollAction): PollState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, currentUser: action.payload };
    
    case 'CREATE_POLL':
      const newPoll: Poll = {
        ...action.payload,
        id: Date.now().toString(),
        responses: action.payload.options.reduce((acc, _, index) => ({ ...acc, [index]: 0 }), {}),
        isActive: false,
        createdAt: new Date()
      };
      return { ...state, currentPoll: newPoll };
    
    case 'START_POLL':
      return { 
        ...state, 
        currentPoll: { ...action.payload, isActive: true },
        timeRemaining: action.payload.timer,
        userResponse: null
      };
    
    case 'END_POLL':
      if (!state.currentPoll) return state;
      return {
        ...state,
        pollHistory: [...state.pollHistory, { ...state.currentPoll, isActive: false }],
        currentPoll: null,
        timeRemaining: 0,
        userResponse: null
      };
    
    case 'SUBMIT_RESPONSE':
      if (!state.currentPoll || state.userResponse !== null) return state;
      const updatedPoll = {
        ...state.currentPoll,
        responses: {
          ...state.currentPoll.responses,
          [action.payload.optionIndex]: (state.currentPoll.responses[action.payload.optionIndex] || 0) + 1
        }
      };
      return {
        ...state,
        currentPoll: updatedPoll,
        userResponse: action.payload.optionIndex.toString()
      };
    
    case 'UPDATE_TIMER':
      return { ...state, timeRemaining: action.payload };
    
    case 'ADD_PARTICIPANT':
      return {
        ...state,
        participants: [...state.participants.filter(p => p.id !== action.payload.id), action.payload]
      };
    
    case 'REMOVE_PARTICIPANT':
      return {
        ...state,
        participants: state.participants.filter(p => p.id !== action.payload)
      };
    
    case 'KICK_PARTICIPANT':
      return {
        ...state,
        participants: state.participants.map(p => 
          p.id === action.payload ? { ...p, isKicked: true } : p
        )
      };
    
    case 'ADD_CHAT_MESSAGE':
      const chatMessage = {
        id: Date.now().toString(),
        sender: action.payload.sender,
        message: action.payload.message,
        timestamp: new Date()
      };
      return {
        ...state,
        chatMessages: [...state.chatMessages, chatMessage]
      };
    
    case 'RESET_USER_RESPONSE':
      return { ...state, userResponse: null };
    
    default:
      return state;
  }
}

const socket = io('http://localhost:4000');

export const PollContext = createContext({
  poll: null,
  results: {},
  createPoll: (poll) => {},
  submitVote: (option) => {},
  endPoll: () => {},
});

export const PollProvider = ({ children }) => {
  const [poll, setPoll] = useState(null);
  const [results, setResults] = useState({});

  useEffect(() => {
    socket.on('pollCreated', (poll) => setPoll(poll));
    socket.on('pollResults', (results) => setResults(results));
    socket.on('pollEnded', () => {
      setPoll(null);
      setResults({});
    });
    return () => {
      socket.off('pollCreated');
      socket.off('pollResults');
      socket.off('pollEnded');
    };
  }, []);

  const createPoll = (poll) => {
    socket.emit('createPoll', poll);
  };

  const submitVote = (option) => {
    socket.emit('submitVote', option);
  };

  const endPoll = () => {
    socket.emit('endPoll');
  };

  return (
    <PollContext.Provider value={{ poll, results, createPoll, submitVote, endPoll }}>
      {children}
    </PollContext.Provider>
  );
};

export function usePoll() {
  const context = useContext(PollContext);
  if (!context) {
    throw new Error('usePoll must be used within a PollProvider');
  }
  return context;
}