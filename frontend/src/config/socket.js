import { io } from 'socket.io-client';

let socket;

export const initializeSocket = (projectId) => {
    console.log('initializeSocket called with projectId:', projectId);
    
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token ? 'Token found' : 'No token found');
    console.log('Token preview:', token ? token.substring(0, 50) + '...' : 'null');

    if (!token) {
        console.error('No token found for socket connection');
        return;
    }

    if (!projectId) {
        console.error('No projectId provided for socket connection');
        return;
    }

    if (socket) {
        console.log('Disconnecting existing socket');
        socket.disconnect();
    }

    console.log('Attempting to connect to server...');
    console.log('Server URL: http://localhost:3000');
    console.log('Project ID:', projectId);

    socket = io('http://localhost:3000', {
        auth: {
            token: token
        },
        query: {
            projectId: projectId
        },
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: true
    });

    socket.on('connect', () => {
        console.log('SUCCESS: Connected to server!');
        console.log('Socket ID:', socket.id);
        console.log('Project ID:', projectId);
        console.log('Transport:', socket.io.engine.transport.name);
    });

    socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        console.error('Error message:', error.message);
        console.error('Error description:', error.description);
        console.error('Error context:', error.context);
        console.error('Error type:', error.type);
    });

    socket.on('disconnect', (reason) => {
        console.log('Disconnected from server');
        console.log('Reason:', reason);
        console.log('Socket ID was:', socket.id);
    });

    socket.on('reconnect', (attemptNumber) => {
        console.log('Reconnected after', attemptNumber, 'attempts');
    });

    socket.on('reconnect_attempt', (attemptNumber) => {
        console.log('Reconnection attempt #', attemptNumber);
    });

    socket.on('reconnect_error', (error) => {
        console.error('Reconnection error:', error);
    });

    socket.on('reconnect_failed', () => {
        console.error('Reconnection failed - giving up');
    });

    socket.on('user-joined', (data) => {
        console.log('User joined the project:', data);
    });

    socket.on('user-left', (data) => {
        console.log('User left the project:', data);
    });

    setTimeout(() => {
        console.log('Socket state after 2 seconds:');
        console.log('   - Connected:', socket.connected);
        console.log('   - ID:', socket.id);
        console.log('   - Transport:', socket.io.engine?.transport?.name);
    }, 2000);
    
    return socket;
};

export const sendMessage = (event, data) => {
    console.log('sendMessage called with:', { event, data });
    console.log('Socket state - Connected:', socket?.connected);
    console.log('Socket ID:', socket?.id);
    
    if (socket && socket.connected) {
        socket.emit(event, data);
        console.log('Message sent successfully:', data);
    } else {
        console.error('Socket not connected. Cannot send message.');
        console.error('Socket exists:', !!socket);
        console.error('Socket connected:', socket?.connected);
    }
};

export const receiveMessage = (event, callback) => {
    console.log('Setting up listener for event:', event);
    
    if (socket) {
        socket.off(event);
        
        socket.on(event, (data) => {
            console.log('Message received for event:', event);
            console.log('Message data:', data);
            callback(data);
        });
        
        console.log('Listener set up successfully for:', event);
    } else {
        console.error('Socket not initialized. Cannot receive messages.');
    }
};

export const disconnectSocket = () => {
    if (socket) {
        console.log('Disconnecting socket:', socket.id);
        socket.disconnect();
        socket = null;
        console.log('Socket disconnected and cleaned up');
    } else {
        console.log('No socket to disconnect');
    }
};

export const getSocketState = () => {
    return {
        exists: !!socket,
        connected: socket?.connected,
        id: socket?.id,
        transport: socket?.io?.engine?.transport?.name
    };
};