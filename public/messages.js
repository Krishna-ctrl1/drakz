document.addEventListener('DOMContentLoaded', function() {
    // Get all required DOM elements
    const showMessagesBtn = document.getElementById('showMessages');
    const messagesContainer = document.getElementById('messagesContainer');
    const messagesTableBody = document.getElementById('messagesTableBody');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const messagesTable = document.getElementById('messagesTable');
    const messageModal = document.getElementById('messageModal');
    const replyModal = document.getElementById('replyModal');
    const closeBtn = document.getElementsByClassName('close')[0];
    
    // Store messages data
    let messagesData = [];
    // Track current message being viewed for reply functionality
    let currentMessageId = null;
    
    // Check if all required elements exist before proceeding
    if (!messagesContainer || !messagesTableBody || !loadingIndicator || !messagesTable) {
        console.error('Required DOM elements are missing. Please check your HTML.');
        return; // Exit early if elements are missing
    }
    
    // Automatically show message container and fetch messages when page loads
    messagesContainer.style.display = 'block';
    loadingIndicator.style.display = 'block';
    messagesTable.style.display = 'none';
    fetchMessages();
    
    // The "Show Messages" button is now optional, but we'll keep it for refreshing messages
    if (showMessagesBtn) {
        showMessagesBtn.addEventListener('click', function() {
            loadingIndicator.style.display = 'block';
            messagesTable.style.display = 'none';
            fetchMessages();
        });
    }
    
    // Close the modal when the user clicks on the close button
    if (closeBtn && messageModal) {
        closeBtn.addEventListener('click', function() {
            messageModal.style.display = 'none';
        });
    }
    
    // Close the modal when the user clicks anywhere outside of the modal
    if (messageModal) {
        window.addEventListener('click', function(event) {
            if (event.target == messageModal) {
                messageModal.style.display = 'none';
            }
        });
    }
    
    // Setup reply modal functionality
    if (messageModal && replyModal) {
        // Close reply modal
        document.querySelectorAll('#replyModal .close-btn, #cancel-reply-btn').forEach(el => {
            el.addEventListener('click', function() {
                replyModal.style.display = 'none';
                // Show the message modal again if canceling
                if (this.id === 'cancel-reply-btn') {
                    messageModal.style.display = 'block';
                }
            });
        });
        
        // Open reply modal when clicking reply button
        document.getElementById('reply-message-btn').addEventListener('click', function() {
            const message = messagesData.find(msg => msg.id === currentMessageId);
            if (message) {
                // Hide message modal
                messageModal.style.display = 'none';
                
                // Populate reply form
                document.getElementById('reply-to').value = message.email;
                document.getElementById('reply-subject').value = 'Re: ' + message.subject;
                
                // Add original message quote
                document.getElementById('reply-message').value = 
                    '\n\n-------- Original Message --------\n' + message.message;
                
                // Show reply modal
                replyModal.style.display = 'block';
            }
        });
        
        // Handle sending reply
        document.getElementById('send-reply-btn').addEventListener('click', function() {
            const replyTo = document.getElementById('reply-to').value;
            const replySubject = document.getElementById('reply-subject').value;
            const replyMessage = document.getElementById('reply-message').value;
            
            if (!replyMessage.trim()) {
                alert('Please enter a reply message');
                return;
            }
            
            // Send the reply
            sendReply(currentMessageId, replyTo, replySubject, replyMessage);
        });
    }
    
    // Function to fetch messages from the server using your existing API endpoint
    function fetchMessages() {
        fetch('/api/messages')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    messagesData = data.messages;
                    displayMessages(messagesData);
                } else {
                    throw new Error(data.message || 'Error fetching messages');
                }
            })
            .catch(error => {
                console.error('Error fetching messages:', error);
                if (messagesTableBody) {
                    messagesTableBody.innerHTML = '<tr><td colspan="9">Error loading messages. Please try again.</td></tr>';
                }
                if (loadingIndicator) loadingIndicator.style.display = 'none';
                if (messagesTable) messagesTable.style.display = 'table';
            });
    }
    
    // Function to display messages in the table
    function displayMessages(messages) {
        if (loadingIndicator) loadingIndicator.style.display = 'none';
        if (messagesTable) messagesTable.style.display = 'table';
        
        if (!messagesTableBody) return;
        
        if (messages.length === 0) {
            messagesTableBody.innerHTML = '<tr><td colspan="9">No messages found.</td></tr>';
            return;
        }
        
        messagesTableBody.innerHTML = '';
        
        messages.forEach(message => {
            const row = document.createElement('tr');
            row.setAttribute('data-message-id', message.id);
            
            if (!message.is_read) {
                row.classList.add('unread');
            }
            
            // Format the date
            const date = new Date(message.submission_date);
            const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
            
            // Determine status text based on message properties
            let statusText = 'Unread';
            let statusClass = 'unread';
            if (message.is_replied) {
                statusText = 'Replied';
                statusClass = 'replied';
            } else if (message.is_read) {
                statusText = 'Read';
                statusClass = 'read';
            }
            
            row.innerHTML = `
                <td>${message.id}</td>
                <td>${message.name}</td>
                <td>${message.email}</td>
                <td>${message.phone || 'N/A'}</td>
                <td>${message.subject}</td>
                <td class="message-content">${message.message}</td>
                <td>${formattedDate}</td>
                <td class="message-status ${statusClass}">${statusText}</td>
                <td>
                    <button onclick="viewMessage(${message.id})">View</button>
                    <button onclick="markAsRead(${message.id})">Mark as Read</button>
                </td>
            `;
            
            messagesTableBody.appendChild(row);
        });
    }
    
    // Function to send a reply to a message
    function sendReply(messageId, to, subject, message) {
        fetch('/api/messages/reply', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: messageId,
                to: to,
                subject: subject,
                message: message
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Reply sent successfully');
                replyModal.style.display = 'none';
                
                // Update local data
                const messageObj = messagesData.find(msg => msg.id === messageId);
                if (messageObj) {
                    messageObj.is_replied = true;
                }
                
                // Refresh the display
                displayMessages(messagesData);
            } else {
                alert('Failed to send reply: ' + (data.message || 'Unknown error'));
            }
        })
        .catch(error => {
            console.error('Error sending reply:', error);
            alert('Error sending reply. Please try again.');
        });
    }
    
    window.viewMessage = function(id) {
        if (!messageModal) return;
        
        // Store current message ID
        currentMessageId = id;
        
        // Find the message in our cached data
        const message = messagesData.find(msg => msg.id === id);
        
        if (message) {
            const modalSubject = document.getElementById('modalSubject');
            const modalName = document.getElementById('modalName');
            const modalEmail = document.getElementById('modalEmail');
            const modalPhone = document.getElementById('modalPhone');
            const modalDate = document.getElementById('modalDate');
            const modalMessage = document.getElementById('modalMessage');
            
            if (modalSubject) modalSubject.textContent = message.subject;
            if (modalName) modalName.textContent = message.name;
            if (modalEmail) modalEmail.textContent = message.email;
            if (modalPhone) modalPhone.textContent = message.phone || 'N/A';
            if (modalDate) modalDate.textContent = new Date(message.submission_date).toLocaleString();
            if (modalMessage) modalMessage.textContent = message.message;
            
            // Mark as read if it was unread
            if (!message.is_read) {
                markAsRead(id);
            }
            
            messageModal.style.display = 'block';
        } else {
            alert('Message not found.');
        }
    };
    
    window.markAsRead = function(id) {
        fetch('/api/messages/mark-read', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Update local data
                const message = messagesData.find(msg => msg.id === id);
                if (message) {
                    message.is_read = true;
                }
                
                // Refresh the display
                displayMessages(messagesData);
            } else {
                alert('Failed to mark message as read: ' + (data.message || 'Unknown error'));
            }
        })
        .catch(error => {
            console.error('Error marking message as read:', error);
            alert('Error marking message as read. Please try again.');
        });
    };
});