const express = require('express');
const app = express();
const http = require('http').createServer(app);
const cors = require('cors');
const path = require('path');

app.use(cors());

// Static files serve karne ke liye production mein
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

const io = require('socket.io')(http, {
  cors: { origin: "*" }
});

io.on('connection', (socket) => {
  console.log('User connected');
  socket.on('send-changes', (delta) => {
    socket.broadcast.emit('receive-changes', delta);
  });
});

const PORT = process.env.PORT || 4000;
http.listen(PORT, () => console.log(`Server running on port ${PORT}`));