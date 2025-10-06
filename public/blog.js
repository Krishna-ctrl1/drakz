let currentUserId = null;

function initializeUser() {
  fetch("/api/auth/current-user", {
    credentials: "include", // Ensure session cookies are sent
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.authenticated) {
        currentUserId = data.userId;
      } else {
        console.warn("User not authenticated");
      }
    })
    .catch((error) => console.error("Error getting current user:", error));
}

// Call this when the page loads
document.addEventListener("DOMContentLoaded", initializeUser);

// Use this function to get the current user ID
function getCurrentUserId() {
  console.log("Current UserId = ", currentUserId);
  return currentUserId;
}

// blog.js (updated with async fixes and toggle for like/dislike)

// Sidebar Functions
function openNav() {
  const sidebar = document.getElementById("mySidebar");
  const closeButton = document.getElementById("close-button");

  sidebar.style.width = "180px"; // Open sidebar to full width
  document.getElementById("main").style.marginLeft = "180px"; // Adjust main content
  closeButton.innerHTML =
    '<img width="25" src="assets/icons/sidebarclose.png">'; // Set close button image
  closeButton.setAttribute("onclick", "closeNav()"); // Set close behavior
  sidebar.classList.remove("icons-only"); // Ensure text is visible
}

function closeNav() {
  const sidebar = document.getElementById("mySidebar");
  const closeButton = document.getElementById("close-button");

  sidebar.style.width = "60px"; // Set sidebar to icons-only mode
  document.getElementById("main").style.marginLeft = "60px"; // Adjust main content
  closeButton.innerHTML = '<img width="25" src="assets/icons/sidebaropen.png">'; // Set open button image
  closeButton.setAttribute("onclick", "openNav()"); // Set open behavior
  sidebar.classList.add("icons-only"); // Hide text
}

// Initialize sidebar state
document.addEventListener("DOMContentLoaded", function () {
  openNav(); // Start with the sidebar open
});

// Overlay Form Functions
function openForm() {
  const overlay = document.getElementById("overlay");
  overlay.classList.add("active");
}

function closeForm() {
  const overlay = document.getElementById("overlay");
  overlay.classList.remove("active");

  // Reset form fields
  document.getElementById("blogTitle").value = "";
  document.getElementById("blogContent").value = "";
  document.getElementById("titleCharCount").textContent = "0/50";
  document.getElementById("contentCharCount").textContent = "0/10000";
}

// Handle form submission
const blogForm = document.getElementById("blogForm");
if (blogForm) {
  blogForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent default form submission

    // Get form data
    const blogTitle = document.getElementById("blogTitle").value.trim();
    const blogContent = document.getElementById("blogContent").value.trim();

    // Validate data
    if (!blogTitle || !blogContent) {
      alert("Please fill in all fields.");
      return;
    }

    // Get current user ID
    const currentUserId = getCurrentUserId();

    if (!currentUserId) {
      alert("You must be logged in to publish a blog.");
      return;
    }

    // Create blog post object
    const blogPost = {
      title: blogTitle,
      content: blogContent,
      author_id: currentUserId,
    };

    // Send to server
    saveBlogToDatabase(blogPost)
      .then((response) => {
        if (response.success) {
          // Close the form
          closeForm();

          // Display success message
          alert("Blog post submitted successfully!");

          // Redirect to blogs page
          if (window.location.pathname.includes("create_blog.html")) {
            window.location.href = "community_blogs.html";
          }
        } else {
          alert("Error publishing blog: " + response.message);
        }
      })
      .catch((error) => {
        console.error("Error publishing blog:", error);
        alert("Failed to publish blog. Please try again.");
      });
  });
}

// Function to save blog to database
async function saveBlogToDatabase(blogPost) {
  try {
    const response = await fetch("/api/blogs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(blogPost),
      credentials: "include", // Include credentials for session cookies
    });

    return await response.json();
  } catch (error) {
    console.error("Error saving blog:", error);
    throw error;
  }
}

// Redirect to blogs.html for "Read Blogs"
function viewBlogs() {
  window.location.href = "community_blogs.html";
}

// Display all blogs (for community_blogs.html)
async function displayBlogs(searchQuery = '') {
  const blogsList = document.getElementById("blogsList");
  if (!blogsList) return;

  try {
    // Fetch blogs from server with optional search
    const url = searchQuery ? `/api/blogs?search=${encodeURIComponent(searchQuery)}` : "/api/blogs";
    const response = await fetch(url);
    const blogs = await response.json();

    blogsList.innerHTML = "";

    if (blogs.length === 0) {
      blogsList.innerHTML = "<p>No blogs found.</p>";
      return;
    }

    const currentUserId = getCurrentUserId();

    for (const blog of blogs) {
      const blogElement = document.createElement("div");
      blogElement.className = "blog-post";
      blogElement.id = `blog-${blog._id}`; // For deletion

      // Fetch user interactions for this blog
      let isLiked = false;
      let isDisliked = false;
      if (currentUserId) {
        const interactionsResponse = await fetch(
          `/api/blogs/${blog._id}/interactions`
        );
        const interactions = await interactionsResponse.json();
        isLiked = interactions.liked;
        isDisliked = interactions.disliked;
      }

      const isAuthor = blog.author_id === currentUserId;

      blogElement.innerHTML = `
        <h3>${blog.title}</h3>
        <p><strong>Author:</strong> ${blog.author_name}</p>
        <p>${blog.content}</p>
        <div class="blog-actions">
          <div class="buttons">
            ${isAuthor ? `<button onclick="deleteBlog('${blog._id}')">Delete</button>` : ""}
            <button onclick="toggleLike('${blog._id}', ${isLiked})" class="like-button ${isLiked ? "liked" : ""}">
              <i class="${isLiked ? "fas fa-thumbs-up" : "far fa-thumbs-up"}"></i> Like (${blog.likes || 0})
            </button>
            <button onclick="toggleDislike('${blog._id}', ${isDisliked})" class="dislike-button ${isDisliked ? "disliked" : ""}">
              <i class="${isDisliked ? "fas fa-thumbs-down" : "far fa-thumbs-down"}"></i> Dislike (${blog.dislikes || 0})
            </button>
          </div>
          <div class="comments-section">
            <h4>Comments</h4>
            <div id="comments-${blog._id}"></div>
            <textarea id="commentInput-${blog._id}" placeholder="Add a comment..."></textarea>
            <button onclick="addComment('${blog._id}')">Add Comment</button>
          </div>
        </div>
        <hr>
      `;
      blogsList.appendChild(blogElement);

      // Display comments for this blog
      await displayComments(blog._id);
    }
  } catch (error) {
    console.error("Error fetching blogs:", error);
    blogsList.innerHTML = "<p>Error loading blogs. Please try again later.</p>";
  }
}

// Toggle Like Blog (now supports unlike if already liked)
async function toggleLike(blogId, isCurrentlyLiked) {
  const currentUserId = getCurrentUserId();

  if (!currentUserId) {
    alert("You must be logged in to like a blog.");
    return;
  }

  const endpoint = isCurrentlyLiked ? `/api/blogs/${blogId}/unlike` : `/api/blogs/${blogId}/like`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const result = await response.json();

    if (result.success) {
      // Refresh the blogs list
      refreshBlogs();
    } else {
      alert(result.message || "Failed to toggle like");
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    alert("Failed to toggle like. Please try again.");
  }
}

// Toggle Dislike Blog (now supports undislike if already disliked)
async function toggleDislike(blogId, isCurrentlyDisliked) {
  const currentUserId = getCurrentUserId();

  if (!currentUserId) {
    alert("You must be logged in to dislike a blog.");
    return;
  }

  const endpoint = isCurrentlyDisliked ? `/api/blogs/${blogId}/undislike` : `/api/blogs/${blogId}/dislike`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const result = await response.json();

    if (result.success) {
      // Refresh the blogs list
      refreshBlogs();
    } else {
      alert(result.message || "Failed to toggle dislike");
    }
  } catch (error) {
    console.error("Error toggling dislike:", error);
    alert("Failed to toggle dislike. Please try again.");
  }
}

// Add a comment to a blog
async function addComment(blogId) {
  const commentInput = document.getElementById(`commentInput-${blogId}`);
  const commentText = commentInput.value.trim();

  if (!commentText) {
    alert("Please enter a comment.");
    return;
  }

  const currentUserId = getCurrentUserId();

  if (!currentUserId) {
    alert("You must be logged in to comment.");
    return;
  }

  try {
    const response = await fetch(`/api/blogs/${blogId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: commentText,
      }),
      credentials: "include",
    });

    const result = await response.json();

    if (result.success) {
      // Clear the comment input
      commentInput.value = "";

      // Refresh comments
      await displayComments(blogId);
    } else {
      alert(result.message || "Failed to add comment");
    }
  } catch (error) {
    console.error("Error adding comment:", error);
    alert("Failed to add comment. Please try again.");
  }
}

// Display comments for a blog
async function displayComments(blogId) {
  const commentsContainer = document.getElementById(`comments-${blogId}`);
  if (!commentsContainer) return;

  try {
    // Fetch comments from server
    const response = await fetch(`/api/blogs/${blogId}/comments`);
    const comments = await response.json();

    // Clear existing comments
    commentsContainer.innerHTML = "";

    // Display each comment
    if (comments.length > 0) {
      const currentUserId = getCurrentUserId();

      for (const comment of comments) {
        const commentElement = document.createElement("div");
        commentElement.className = "comment";
        const isCommentAuthor = currentUserId && comment.user_id === currentUserId;

        commentElement.innerHTML = `
          <p><strong>${comment.username || "Unknown User"}</strong> (${formatDate(comment.created_at)}): ${comment.text}</p>
          ${isCommentAuthor ? `<button onclick="deleteComment('${blogId}', '${comment._id}')">Delete</button>` : ""}
        `;
        commentsContainer.appendChild(commentElement);
      }
    } else {
      commentsContainer.innerHTML = "<p>No comments yet.</p>";
    }
  } catch (error) {
    console.error("Error fetching comments:", error);
    commentsContainer.innerHTML =
      "<p>Error loading comments. Please try again later.</p>";
  }
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

// Delete a comment (updated to refresh only comments)
async function deleteComment(blogId, commentId) {
  const currentUserId = getCurrentUserId();

  if (!currentUserId) {
    alert("You must be logged in to delete a comment.");
    return;
  }

  if (confirm("Are you sure you want to delete this comment?")) {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const result = await response.json();

      if (result.success) {
        // Refresh only the comments section
        await displayComments(blogId);
      } else {
        alert(result.message || "Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment. Please try again.");
    }
  }
}

// Delete a blog
async function deleteBlog(blogId) {
  if (confirm("Are you sure you want to delete this blog?")) {
    try {
      const response = await fetch(`/api/blogs/${blogId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const result = await response.json();

      if (result.success) {
        // Refresh blogs
        refreshBlogs();
      } else {
        alert(result.message || "Failed to delete blog");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete blog. Please try again.");
    }
  }
}

// Filter blogs based on search query
function filterBlogs() {
  const searchQuery = document.getElementById("searchInput").value.toLowerCase().trim();
  displayBlogs(searchQuery);
}

// Refresh blogs (alias for displayBlogs with current search)
function refreshBlogs() {
  const searchInput = document.getElementById("searchInput");
  const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : '';
  displayBlogs(searchQuery);
}

async function initializeUser() {
  try {
    const response = await fetch("/api/auth/current-user", {
      credentials: "include",
    });
    const data = await response.json();
    if (data.authenticated) {
      currentUserId = data.userId;
    }
  } catch (error) {
    console.error("Error getting current user:", error);
  }
}

// Use this function to get the current user ID
function getCurrentUserId() {
  return currentUserId;
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", async () => {
  await initializeUser();

  if (window.location.pathname.includes("community_blogs.html")) {
    await displayBlogs();

    // Add event listener for search input
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      searchInput.addEventListener("input", filterBlogs);
    }
  }
});