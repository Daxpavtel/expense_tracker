const { fork } = require('child_process');
const path = require('path');

const serverPath = path.join(__dirname, 'server', 'src', 'app.js');
const clientScript = path.join(__dirname, 'client', 'node_modules', 'react-scripts', 'scripts', 'start.js');

console.log('Starting server (port 5000) and client (port 3000)...');

const server = fork(serverPath, [], { cwd: path.join(__dirname, 'server'), stdio: 'inherit' });
server.on('error', (err) => { console.error('Server failed:', err.message); process.exit(1); });
server.on('close', (code) => { if (code) process.exit(code); });

const client = fork(clientScript, [], { cwd: path.join(__dirname, 'client'), stdio: 'inherit' });
client.on('error', (err) => { console.error('Client failed:', err.message); process.exit(1); });
client.on('close', (code) => { if (code) process.exit(code); });
