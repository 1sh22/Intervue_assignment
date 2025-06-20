const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

let currentPoll = null;
let pollResults = {};

io.on('connection', (socket) => {
  // Send current poll to new student
  if (currentPoll) {
    socket.emit('pollCreated', currentPoll);
    socket.emit('pollResults', pollResults);
  }

  socket.on('createPoll', (poll) => {
    currentPoll = poll;
    pollResults = {};
    io.emit('pollCreated', poll);
    io.emit('pollResults', pollResults);
  });

  socket.on('submitVote', (option) => {
    if (!pollResults[option]) pollResults[option] = 0;
    pollResults[option] += 1;
    io.emit('pollResults', pollResults);
  });

  socket.on('endPoll', () => {
    currentPoll = null;
    pollResults = {};
    io.emit('pollEnded');
  });

  socket.on('disconnect', () => {});
});

app.get('/', (req, res) => {
  res.send('Polling backend running');
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
}); 