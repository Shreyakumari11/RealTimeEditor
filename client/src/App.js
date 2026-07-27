import React, { useEffect, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { io } from 'socket.io-client';

function App() {
  const [quill, setQuill] = useState();
  const socket = io("http://localhost:4000");

  useEffect(() => {
    const q = new Quill('#editor', { theme: 'snow' });
    setQuill(q);
  }, []);

  useEffect(() => {
    if (!quill || !socket) return;
    
    quill.on('text-change', (delta, oldDelta, source) => {
      if (source !== 'user') return;
      socket.emit('send-changes', delta);
    });

    socket.on('receive-changes', (delta) => {
      quill.updateContents(delta);
    });
  }, [quill, socket]);

  return <div id="editor" style={{ height: '500px', width: '80%', margin: 'auto' }}></div>;
}

export default App;