import { io } from 'socket.io-client';

let socket;

export const initializeSocket = (projectId) => {
    // Get token from localStorage or wherever you store it
    const token = localStorage.getItem('token'); // Adjust based on your auth setup
    
    if (!token) {
        console.error('No token found for socket connection');
        return;
    }

    if (!projectId) {
        console.error('No projectId provided for socket connection');
        return;
    }

    // Disconnect existing socket if any
    if (socket) {
        socket.disconnect();
    }

    // Initialize socket with proper configuration
    socket = io('http://localhost:3000', {
        auth: {
            token: token
        },
        query: {
            projectId: projectId
        },
        transports: ['websocket', 'polling'] // Fallback to polling if websocket fails
    });

    socket.on('connect', () => {
        console.log('✅ Connected to server with socket ID:', socket.id);
    });

    socket.on('connect_error', (error) => {
        console.error('❌ Socket connection error:', error.message);
    });

    socket.on('disconnect', (reason) => {
        console.log('❌ Disconnected from server. Reason:', reason);
    });

    return socket;
};

export const sendMessage = (event, data) => {
    if (socket && socket.connected) {
        socket.emit(event, data);
        console.log('📨 Message sent:', data);
    } else {
        console.error('❌ Socket not connected. Cannot send message.');
    }
};

export const recieveMessage = (event, callback) => {
    if (socket) {
        socket.on(event, callback);
    } else {
        console.error('❌ Socket not initialized. Cannot receive messages.');
    }
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};