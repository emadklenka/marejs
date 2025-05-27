export default function sampleWSHandler(ws, req) {
  console.log('🔌 Sample WebSocket connected');
  
  // Send welcome message
  ws.send(JSON.stringify({
    type: 'welcome',
    message: 'Connected to sample WebSocket!'
  }));

  // Handle incoming messages
  ws.on('message', (data) => {
    try {
      const message = data.toString();
      console.log('📨 Received message:', message);
      
      // Echo the message back
      ws.send(JSON.stringify({
        type: 'echo',
        original: message,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('❌ Error handling message:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Failed to process message'
      }));
    }
  });

  // Handle connection close
  ws.on('close', () => {
    console.log('🔌 Sample WebSocket disconnected');
  });

  // Handle errors
  ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error);
  });
}
