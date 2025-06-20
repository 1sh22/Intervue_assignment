const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const app = express();

const server = http.createServer(app);
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
const io = socketIo(server, {
   cors: {
     origin: 'http://localhost:5173',
     methods: ['GET', 'POST'],
     credentials: true
   },
});

const PORT = process.env.PORT || 5000;

const questions = [
  {
    question: "Who painted the Mona Lisa?",
    answers: [
      { text: "Leonardo da Vinci", correct: true },
      { text: "Pablo Picasso", correct: false },
      { text: "Vincent van Gogh", correct: false },
      { text: "Claude Monet", correct: false },
    ],
  },
  {
    question: "Which continent is the Sahara Desert located in?",
    answers: [
      { text: "Asia", correct: false },
      { text: "Africa", correct: true },
      { text: "Australia", correct: false },
      { text: "South America", correct: false },
    ],
  },
  {
    question: "What is the process by which plants make food called?",
    answers: [
      { text: "Respiration", correct: false },
      { text: "Photosynthesis", correct: true },
      { text: "Transpiration", correct: false },
      { text: "Fermentation", correct: false },
    ],
  },
  {
    question: "What is the square root of 144?",
    answers: [
      { text: "10", correct: false },
      { text: "11", correct: false },
      { text: "12", correct: true },
      { text: "13", correct: false },
    ],
  },
  {
    question: "Which animal is known as the King of the Jungle?",
    answers: [
      { text: "Tiger", correct: false },
      { text: "Elephant", correct: false },
      { text: "Lion", correct: true },
      { text: "Leopard", correct: false },
    ],
  },
  {
    question: "Which country gifted the Statue of Liberty to the USA?",
    answers: [
      { text: "United Kingdom", correct: false },
      { text: "France", correct: true },
      { text: "Spain", correct: false },
      { text: "Germany", correct: false },
    ],
  },
  {
    question: "How many legs does a spider have?",
    answers: [
      { text: "6", correct: false },
      { text: "8", correct: true },
      { text: "10", correct: false },
      { text: "12", correct: false },
    ],
  },
  {
    question: "Which instrument measures atmospheric pressure?",
    answers: [
      { text: "Thermometer", correct: false },
      { text: "Barometer", correct: true },
      { text: "Altimeter", correct: false },
      { text: "Anemometer", correct: false },
    ],
  },
  {
    question: "Who wrote 'Romeo and Juliet'?",
    answers: [
      { text: "William Shakespeare", correct: true },
      { text: "Charles Dickens", correct: false },
      { text: "Jane Austen", correct: false },
      { text: "Mark Twain", correct: false },
    ],
  },
  {
    question: "Which metal is liquid at room temperature?",
    answers: [
      { text: "Mercury", correct: true },
      { text: "Iron", correct: false },
      { text: "Aluminum", correct: false },
      { text: "Copper", correct: false },
    ],
  },
  {
    question: "Which is the tallest mountain in the world?",
    answers: [
      { text: "Mount Kilimanjaro", correct: false },
      { text: "Mount Everest", correct: true },
      { text: "K2", correct: false },
      { text: "Mount Elbrus", correct: false },
    ],
  },
  {
    question: "What type of galaxy is the Milky Way?",
    answers: [
      { text: "Elliptical", correct: false },
      { text: "Irregular", correct: false },
      { text: "Spiral", correct: true },
      { text: "Lenticular", correct: false },
    ],
  },
  {
    question: "Which is the longest river in the world?",
    answers: [
      { text: "Amazon River", correct: false },
      { text: "Yangtze River", correct: false },
      { text: "Nile River", correct: true },
      { text: "Mississippi River", correct: false },
    ],
  },
  {
    question: "Which part of the plant conducts photosynthesis?",
    answers: [
      { text: "Stem", correct: false },
      { text: "Leaf", correct: true },
      { text: "Root", correct: false },
      { text: "Flower", correct: false },
    ],
  },
  {
    question: "Which language has the most native speakers worldwide?",
    answers: [
      { text: "English", correct: false },
      { text: "Hindi", correct: false },
      { text: "Mandarin Chinese", correct: true },
      { text: "Spanish", correct: false },
    ],
  },
  {
    question: "What is the freezing point of water?",
    answers: [
      { text: "0°C", correct: true },
      { text: "32°C", correct: false },
      { text: "100°C", correct: false },
      { text: "10°C", correct: false },
    ],
  },
  {
    question: "Which planet has the most moons?",
    answers: [
      { text: "Earth", correct: false },
      { text: "Mars", correct: false },
      { text: "Jupiter", correct: false },
      { text: "Saturn", correct: true },
    ],
  },
  {
    question: "What is the main ingredient in sushi?",
    answers: [
      { text: "Bread", correct: false },
      { text: "Noodles", correct: false },
      { text: "Rice", correct: true },
      { text: "Tofu", correct: false },
    ],
  },
];

const rooms = {};

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinRoom", (room, name) => {
    socket.join(room);
    io.to(room).emit("message", `${name} has joined the game!`);
    if (!rooms[room]) {
      rooms[room] = {
        players: [],
        currentQuestion: null,
        correctAnswer: null,
        questionTimeout: null,
        shouldAskNewQuestion: true,
      };
    }
    // to make score zero
  //   if(rooms[room]){
  //   rooms[room].players.forEach((player) => {
  //     player.score = 0;
  //   });
  // }
  // rooms[room].players.push({ id: socket.id, name,score: 0  });
    rooms[room].players.push({ id: socket.id, name });

    if (!rooms[room].currentQuestion) {
      askNewQuestion(room);
    }
  });

  socket.on("submitAnswer", (room, answerIndex) => {
    const currentPlayer = rooms[room].players.find(
      (player) => player.id === socket.id
    );

    if (currentPlayer) {
      const correctAnswer = rooms[room].correctAnswer;
      const isCorrect = correctAnswer !== null && correctAnswer === answerIndex;
      currentPlayer.score = isCorrect
        ? (currentPlayer.score || 0) + 1
        : (currentPlayer.score || 0) - 1;

      clearTimeout(rooms[room].questionTimeout);

      io.to(room).emit("answerResult", {
        playerName: currentPlayer.name,
        isCorrect,
        correctAnswer,
        scores: rooms[room].players.map((player) => ({
          name: player.name,
          score: player.score || 0,
        })),
      });

      const winningThreshold = 5;
      const winner = rooms[room].players.find(
        (player) => (player.score || 0) >= winningThreshold
      );

      if (winner) {
        io.to(room).emit("gameOver", { winner: winner.name });
        delete rooms[room];
      } else {
        askNewQuestion(room);
      }
    }
  });

  socket.on("disconnect", () => {
    for (const room in rooms) {
      rooms[room].players = rooms[room].players.filter(
        (player) => player.id !== socket.id
      );
    }

    console.log("A user disconnected");
  });
});

function askNewQuestion(room) {
  if (rooms[room].players.length === 0) {
    clearTimeout(rooms[room].questionTimeout);
    delete rooms[room];
    return;
  }

  const randomIndex = Math.floor(Math.random() * questions.length);
  const question = questions[randomIndex];
  rooms[room].currentQuestion = question;
  const correctAnswerIndex = question.answers.findIndex(
    (answer) => answer.correct
  );

  rooms[room].correctAnswer = correctAnswerIndex;
  rooms[room].shouldAskNewQuestion = true;
  io.to(room).emit("newQuestion", {
    question: question.question,
    answers: question.answers.map((answer) => answer.text),
    timer: 10,
  });

  rooms[room].questionTimeout = setTimeout(() => {
    io.to(room).emit("answerResult", {
      playerName: "No one",
      isCorrect: false,
      correctAnswer: rooms[room].correctAnswer,
      scores: rooms[room].players.map((player) => ({
        name: player.name,
        score: player.score || 0,
      })),
    });

    askNewQuestion(room);
  }, 10000);
}

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

