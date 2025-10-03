document.addEventListener('DOMContentLoaded', function() {
  console.log('messages.js loaded');
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
    console.error('Required DOM elements are missing:', {
      messagesContainer: !!messagesContainer,
      messagesTableBody: !!messagesTableBody,
      loadingIndicator: !!loadingIndicator,
      messagesTable: !!messagesTable
    });
    return;
  }
  
  // Automatically show message container and fetch messages
  messagesContainer.style.display = 'block';
  loadingIndicator.style.display = 'block';
  messagesTable.style.display = 'none';
  fetchMessages();
  
  if (showMessagesBtn) {
    showMessagesBtn.addEventListener('click', function() {
      loadingIndicator.style.display = 'block';
      messagesTable.style.display = 'none';
      fetchMessages();
    });
  }
  
  if (closeBtn && messageModal) {
    closeBtn.addEventListener('click', function() {
      messageModal.style.display = 'none';
    });
  }
  
  if (messageModal) {
    window.addEventListener('click', function(event) {
      if (event.target == messageModal) {
        messageModal.style.display = 'none';
      }
    });
  }
  
  if (messageModal && replyModal) {
    document.querySelectorAll('#replyModal .close-btn, #cancel-reply-btn').forEach(el => {
      el.addEventListener('click', function() {
        replyModal.style.display = 'none';
        if (this.id === 'cancel-reply-btn') {
          messageModal.style.display = 'block';
        }
      });
    });
    
    document.getElementById('reply-message-btn').addEventListener('click', function() {
      const message = messagesData.find(msg => msg.id === currentMessageId);
      if (message) {
        messageModal.style.display = 'none';
        document.getElementById('reply-to').value = message.email;
        document.getElementById('reply-subject').value = 'Re: ' + message.subject;
        document.getElementById('reply-message').value = 
          '\n\n-------- Original Message --------\n' + message.message;
        replyModal.style.display = 'block';
      }
    });
    
    document.getElementById('send-reply-btn').addEventListener('click', function() {
      const replyTo = document.getElementById('reply-to').value;
      const replySubject = document.getElementById('reply-subject').value;
      const replyMessage = document.getElementById('reply-message').value;
      
      if (!replyMessage.trim()) {
        alert('Please enter a reply message');
        return;
      }
      
      sendReply(currentMessageId, replyTo, replySubject, replyMessage);
    });
  }
  
  function fetchMessages() {
    const url = 'http://localhost:4000/api/messages';
    console.log('Fetching messages from:', url);
    fetch(url, { credentials: 'include' })
      .then(response => {
        console.log('Response status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Received data:', data);
        if (data.success) {
          messagesData = data.messages;
          console.log('Messages data:', messagesData);
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
  
  function displayMessages(messages) {
    console.log('Displaying messages:', messages);
    if (loadingIndicator) loadingIndicator.style.display = 'none';
    if (messagesTable) messagesTable.style.display = 'table';
    
    if (!messagesTableBody) {
      console.error('messagesTableBody not found');
      return;
    }
    
    if (messages.length === 0) {
      console.log('No messages to display');
      messagesTableBody.innerHTML = '<tr><td colspan="9">No messages found.</td></tr>';
      return;
    }
    
    messagesTableBody.innerHTML = '';
    messages.forEach(message => {
      console.log('Rendering message:', message);
      const row = document.createElement('tr');
      row.setAttribute('data-message-id', message.id);
      
      if (!message.is_read) {
        row.classList.add('unread');
      }
      
      const date = new Date(message.submission_date);
      const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
      
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
          <button onclick="viewMessage('${message.id}')">View</button>
          <button onclick="markAsRead('${message.id}')">Mark as Read</button>
        </td>
      `;
      
      messagesTableBody.appendChild(row);
    });
  }
  
  window.viewMessage = function(id) {
    if (!messageModal) return;
    currentMessageId = id;
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
      
      if (!message.is_read) {
        markAsRead(id);
      }
      
      messageModal.style.display = 'block';
    } else {
      alert('Message not found.');
    }
  };
  
  window.markAsRead = function(id) {
    fetch('http://localhost:4000/api/messages/mark-read', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id }),
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const message = messagesData.find(msg => msg.id === id);
          if (message) {
            message.is_read = true;
          }
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
  
  function sendReply(messageId, to, subject, message) {
    fetch('http://localhost:4000/api/messages/reply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: messageId,
        to: to,
        subject: subject,
        message: message
      }),
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('Reply sent successfully');
          replyModal.style.display = 'none';
          const messageObj = messagesData.find(msg => msg.id === messageId);
          if (messageObj) {
            messageObj.is_replied = true;
          }
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
});