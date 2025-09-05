document.addEventListener("DOMContentLoaded", function() {
    // DOM Element References
    const clientListContainer = document.getElementById("client-list-sidebar");
    const videoLibraryContainer = document.getElementById("video-library-sidebar");
    const mainVideoPlayer = document.getElementById("main-video");
    const clientNameDisplay = document.getElementById("client-name-display");
    const chatMessages = document.getElementById("chat-messages");
    const messageInput = document.getElementById("chat-message-input");
    const sendBtn = document.getElementById("send-chat-btn");
    const tabs = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    const notesArea = document.getElementById('notes-area');
    const saveNoteBtn = document.getElementById('save-notes-btn');
    const savedNotesList = document.createElement('div');
    notesArea.parentElement.appendChild(savedNotesList);
    const endSessionBtn = document.getElementById('end-session-btn');
    const advisorVideoBox = document.getElementById('advisor-video-box');
    const clientVideoBox = document.getElementById('client-video-box');

    // State Management
    let currentSession = {
        clientId: null,
        clientName: null
    };
    let localStream;

    // WebSocket Connection
    const socket = new WebSocket(`ws://${window.location.host}`);

    socket.onopen = () => displayConnectionStatus('Connected to session');
    socket.onmessage = (event) => {
        try {
            handleSocketMessage(JSON.parse(event.data));
        } catch (error) {
            console.error("Received non-JSON message:", event.data);
        }
    };
    socket.onclose = () => displayConnectionStatus('Disconnected from session', true);
    socket.onerror = (error) => displayConnectionStatus('Connection error', true);

    // --- WebSocket Message Handler ---
    function handleSocketMessage(data) {
        switch (data.type) {
            case 'chat':
                appendChatMessage(data.message, data.sender);
                break;
            case 'video-sync':
                mainVideoPlayer.src = `https://www.youtube.com/embed/${data.videoId}?autoplay=1`;
                break;
            // Add WebRTC signaling handlers here in the future
            default:
                console.log("Received unknown message type:", data.type);
        }
    }
    
    // --- Data Fetching ---
    async function fetchData(url, options = {}) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Could not fetch data from ${url}:`, error);
        }
    }

    // --- Webcam and Media ---
    async function setupLocalVideo() {
        try {
            localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            const videoElement = document.createElement('video');
            videoElement.srcObject = localStream;
            videoElement.autoplay = true;
            videoElement.muted = true; // Mute self-view to prevent feedback
            videoElement.style.width = '100%';
            videoElement.style.height = '100%';
            videoElement.style.objectFit = 'cover';
            advisorVideoBox.innerHTML = '';
            advisorVideoBox.appendChild(videoElement);
        } catch (err) {
            console.error("Error accessing webcam:", err);
            advisorVideoBox.innerHTML = '<p>Could not access camera</p>';
        }
    }
    
    // --- Chat Functionality ---
    function sendChatMessage() {
        const message = messageInput.value.trim();
        if (message && socket.readyState === WebSocket.OPEN) {
            const payload = {
                type: 'chat',
                message: message,
                sender: 'Advisor'
            };
            socket.send(JSON.stringify(payload));
            appendChatMessage(message, 'Advisor'); // Show own message immediately
            messageInput.value = "";
        }
    }

    function appendChatMessage(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message');
        messageDiv.innerHTML = `<strong class="${sender.toLowerCase()}">${sender}:</strong> ${message}`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function displayConnectionStatus(text, isError = false) {
        const statusDiv = document.createElement('div');
        statusDiv.className = 'connection-status';
        statusDiv.textContent = text;
        statusDiv.style.color = isError ? '#e74c3c' : '#2ecc71';
        statusDiv.style.textAlign = 'center';
        statusDiv.style.fontSize = '0.9em';
        chatMessages.appendChild(statusDiv);
    }
    
    // --- Session Management ---
    async function startSession(client) {
        currentSession.clientId = client.user_id;
        currentSession.clientName = client.name;
        clientNameDisplay.textContent = client.name;
        clientVideoBox.innerHTML = `<p>Client Cam (${client.name})</p>`;
        notesArea.value = '';
        chatMessages.innerHTML = '';
        displayConnectionStatus(`Session started with ${client.name}`);
        await loadSessionNotes(client.user_id);
    }

    function endSession() {
        if (!currentSession.clientId) return;
        const endedClientName = currentSession.clientName;
        currentSession.clientId = null;
        currentSession.clientName = null;
        clientNameDisplay.textContent = 'No Client Selected';
        clientVideoBox.innerHTML = '<p>Client Cam</p>';
        notesArea.value = '';
        savedNotesList.innerHTML = '';
        chatMessages.innerHTML = '';
        displayConnectionStatus(`Session with ${endedClientName} has ended.`);
    }

    // --- Notes Functionality ---
    async function saveCurrentNote() {
        if (!currentSession.clientId) {
            alert("Please select a client to start a session before saving notes.");
            return;
        }
        const noteText = notesArea.value.trim();
        if (noteText === "") {
            alert("Cannot save an empty note.");
            return;
        }
        const response = await fetchData('/api/session-notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: currentSession.clientId, note: noteText })
        });
        if (response && response.success) {
            notesArea.value = '';
            await loadSessionNotes(currentSession.clientId);
        } else {
            alert("Failed to save note.");
        }
    }

    async function loadSessionNotes(clientId) {
        const data = await fetchData(`/api/session-notes/${clientId}`);
        savedNotesList.innerHTML = '<h4>Saved Notes:</h4>';
        if (data && data.notes && data.notes.length > 0) {
            data.notes.forEach(note => {
                const noteEl = document.createElement('div');
                noteEl.className = 'saved-note-item';
                const noteDate = new Date(note.created_at).toLocaleString();
                noteEl.innerHTML = `<strong>${noteDate}:</strong><p>${note.note}</p>`;
                savedNotesList.appendChild(noteEl);
            });
        } else {
            savedNotesList.innerHTML += '<p>No notes for this client yet.</p>';
        }
    }

    // --- UI Population ---
    async function populateClientList() {
        const data = await fetchData('/api/advisor-clients');
        if (data && data.clients) {
            clientListContainer.innerHTML = "";
            data.clients.forEach(client => {
                const li = document.createElement("li");
                li.textContent = client.name;
                li.dataset.clientId = client.user_id;
                li.addEventListener('click', () => startSession(client));
                clientListContainer.appendChild(li);
            });
        }
    }

    async function populateVideoLibrary() {
        const data = await fetchData('/api/videos');
        if (data && data.videos) {
            videoLibraryContainer.innerHTML = "";
            data.videos.forEach(video => {
                const div = document.createElement("div");
                div.className = "video-item";
                div.textContent = video.title;
                div.addEventListener('click', () => {
                    if (!currentSession.clientId) {
                        alert("Please select a client to start a session first.");
                        return;
                    }
                    const videoId = video.videoId;
                    mainVideoPlayer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
                    if (socket.readyState === WebSocket.OPEN) {
                        const payload = { type: 'video-sync', videoId: videoId };
                        socket.send(JSON.stringify(payload));
                    }
                });
                videoLibraryContainer.appendChild(div);
            });
        }
    }

    // --- Initialization ---
    async function initializePage() {
        await populateClientList();
        await populateVideoLibrary();
        await setupLocalVideo();
    }

    // Event Listeners
    sendBtn.addEventListener('click', sendChatMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
             e.preventDefault();
             sendChatMessage();
        }
    });
    saveNoteBtn.addEventListener('click', saveCurrentNote);
    endSessionBtn.addEventListener('click', endSession);

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(item => item.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });

    initializePage();
});
