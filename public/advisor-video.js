document.addEventListener("DOMContentLoaded", function() {
    /* -------------------
       VIDEO FUNCTIONALITY
    ---------------------*/
    let videos = JSON.parse(localStorage.getItem("videos")) || [
            { 
              title: "New Video", 
              videoId: "Cda-fUJ-GjE", 
              thumbnail: "https://img.youtube.com/vi/Cda-fUJ-GjE/maxresdefault.jpg" 
            },
            { 
                title: "Second Video", 
                videoId: "qoY2lz5IOGs", 
                thumbnail: "https://img.youtube.com/vi/qoY2lz5IOGs/maxresdefault.jpg"
            }
      
    ];
    
    const videoListContainer = document.getElementById("videoList");
    const mainVideoPlayer = document.getElementById("main-video");
    
    if (videos.length > 0) {
      mainVideoPlayer.src = "https://www.youtube.com/embed/" + videos[0].videoId;
    }
    
    function populateVideoList() {
      videoListContainer.innerHTML = "";
      videos.forEach(video => {
        let videoItem = document.createElement("div");
        videoItem.className = "video-item";
        videoItem.innerHTML = `<img src="${video.thumbnail}" alt="${video.title}"><p>${video.title}</p>`;
        videoItem.addEventListener("click", function() {
          mainVideoPlayer.src = "https://www.youtube.com/embed/" + video.videoId;
        });
        videoListContainer.appendChild(videoItem);
      });
    }
    populateVideoList();
    
    /* -------------------
       NOTIFY CLIENTS FUNCTIONALITY
    ---------------------*/
    const notifyBtn = document.getElementById("notify-btn");
    notifyBtn.addEventListener("click", function() {
      let clients = JSON.parse(localStorage.getItem("clients")) || [
        { firstName: "Clara", lastName: "Mentos", email: "clara@example.com" },
        { firstName: "James", lastName: "Jorham", email: "james@example.com" },
        { firstName: "Oliver", lastName: "Smith", email: "oliver@example.com" },
        { firstName: "Jason", lastName: "Kim", email: "jason@example.com" }
      ];
      let emails = clients.map(client => client.email).join(",");
      const subject = encodeURIComponent("Live Session Notification");
      const body = encodeURIComponent("Dear Client,\n\nWe are live now! Join our session here:\nhttps://www.youtube.com/embed/live_stream?channel=UCgu4tOsRgvENwqXKQ-xosUg\n\nBest Regards,\nYour Advisor");
      window.location.href = `mailto:${emails}?subject=${subject}&body=${body}`;
    });
    
    /* -------------------
       SESSION NOTES FUNCTIONALITY
    ---------------------*/
    const saveNotesBtn = document.getElementById("save-notes-btn");
    const notesArea = document.getElementById("notes-area");
    const savedNotesList = document.getElementById("saved-notes-list");
    
    // Load saved session notes from localStorage (stored as an array)
    let sessionNotes = JSON.parse(localStorage.getItem("sessionNotes")) || [];
    
    function displaySessionNotes() {
      savedNotesList.innerHTML = "";
      sessionNotes.forEach((note, index) => {
        let noteDiv = document.createElement("div");
        noteDiv.className = "saved-note";
        noteDiv.innerHTML = `
          <span>Session ${index + 1}: ${note}</span>
          <button class="delete-note-btn" data-index="${index}">Delete</button>
        `;
        savedNotesList.appendChild(noteDiv);
      });
    }
    
    // Display existing session notes on load
    displaySessionNotes();
    
    // Debug log to check if button is found
    console.log("Save Notes Button:", saveNotesBtn);
    
    // Save note event
    saveNotesBtn.addEventListener("click", function() {
      console.log("Save button clicked");
      let note = notesArea.value.trim();
      if (note !== "") {
        sessionNotes.push(note);
        localStorage.setItem("sessionNotes", JSON.stringify(sessionNotes));
        notesArea.value = ""; // clear the text area after saving
        displaySessionNotes();
        console.log("Note saved:", note);
      } else {
        console.log("No note entered.");
      }
    });
    
    // Delete note functionality using event delegation
    savedNotesList.addEventListener("click", function(e) {
      if (e.target && e.target.classList.contains("delete-note-btn")) {
        let index = e.target.getAttribute("data-index");
        sessionNotes.splice(index, 1);
        localStorage.setItem("sessionNotes", JSON.stringify(sessionNotes));
        displaySessionNotes();
        console.log("Deleted note at index:", index);
      }
    });
  });
  