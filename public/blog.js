let currentUserId = null;
function initializeUser() {
  fetch("/api/auth/current-user")
    .then((response) => response.json())
    .then((data) => {
      if (data.authenticated) {
        currentUserId = data.userId;
      }
    })
    .catch((error) => console.error("Error getting current user:", error));
}

// Call this when the page loads
document.addEventListener("DOMContentLoaded", initializeUser);

// Use this function to get the current user ID
function getCurrentUserId() {
  console.log("Current UserId = ", currentUserId);
  if (currentUserId == "67e52a900823bba8b74d23fe") {return 1;}
  else if (currentUserId == "67e52a900823bba8b74d23ff") {return 2;}
  else if (currentUserId == "67e52a900823bba8b74d2400") {return 3;}
  else if (currentUserId == "67e52a900823bba8b74d2401") {return 4;}
  else if (currentUserId == "67e52a900823bba8b74d2402") {return 5;}
  else if (currentUserId == "67e52a900823bba8b74d2403") {return 6;}
  else if (currentUserId == "67e52a900823bba8b74d2404") {return 7;}
  else if (currentUserId == "67e52a900823bba8b74d2405") {return 8;}
  else if (currentUserId == "67e52a900823bba8b74d2406") {return 9;}
  else if (currentUserId == "67e52a900823bba8b74d2407") {return 10;}
}

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
  document.getElementById("contentCharCount").textContent = "0/1000";
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
    currentUserId = getCurrentUserId();

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
async function displayBlogs() {
  const blogsList = document.getElementById("blogsList");
  if (!blogsList) return;

  try {
    // Fetch blogs from server
    const response = await fetch("/api/blogs");
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

      // Check if current user has liked/disliked this blog
      const userInteractions = await fetch(
        `/api/blogs/${blog.id}/interactions?userId=${currentUserId}`
      );
      const interactions = await userInteractions.json();

      const isLiked = interactions.liked;
      const isDisliked = interactions.disliked;
      const isAuthor = blog.author_id === currentUserId;

      blogElement.innerHTML = `
                <h3>${blog.title}</h3>
                <p><strong>Author:</strong> ${blog.author_name}</p>
                <p>${blog.content}</p>
                <div class="blog-actions">
                    <div class="buttons">
                        ${
                          isAuthor
                            ? `<button onclick="deleteBlog(${blog.id})">Delete</button>`
                            : ""
                        }
                        <button onclick="likeBlog(${
                          blog.id
                        })" class="like-button ${isLiked ? "liked" : ""}">
                            <i class="${
                              isLiked ? "fas fa-thumbs-up" : "far fa-thumbs-up"
                            }"></i> Like (${blog.likes || 0})
                        </button>
                        <button onclick="dislikeBlog(${
                          blog.id
                        })" class="dislike-button ${
        isDisliked ? "disliked" : ""
      }">
                            <i class="${
                              isDisliked
                                ? "fas fa-thumbs-down"
                                : "far fa-thumbs-down"
                            }"></i> Dislike (${blog.dislikes || 0})
                        </button>
                    </div>
                    <div class="comments-section">
                        <h4>Comments</h4>
                        <div id="comments-${blog.id}"></div>
                        <textarea id="commentInput-${
                          blog.id
                        }" placeholder="Add a comment..."></textarea>
                        <button onclick="addComment(${
                          blog.id
                        })">Add Comment</button>
                    </div>
                </div>
                <hr>
            `;
      blogsList.appendChild(blogElement);

      // Display comments for this blog
      displayComments(blog.id);
    }
  } catch (error) {
    console.error("Error fetching blogs:", error);
    blogsList.innerHTML = "<p>Error loading blogs. Please try again later.</p>";
  }
}

// Like Blog
async function likeBlog(blogId) {
  const currentUserId = getCurrentUserId();

  if (!currentUserId) {
    alert("You must be logged in to like a blog.");
    return;
  }

  try {
    const response = await fetch(`/api/blogs/${blogId}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: currentUserId }),
      credentials: "include",
    });

    const result = await response.json();

    if (result.success) {
      // Refresh the blogs list
      displayBlogs();
    } else {
      alert(result.message || "Failed to like blog");
    }
  } catch (error) {
    console.error("Error liking blog:", error);
    alert("Failed to like blog. Please try again.");
  }
}

// Dislike Blog
async function dislikeBlog(blogId) {
  const currentUserId = getCurrentUserId();

  if (!currentUserId) {
    alert("You must be logged in to dislike a blog.");
    return;
  }

  try {
    const response = await fetch(`/api/blogs/${blogId}/dislike`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: currentUserId }),
      credentials: "include",
    });

    const result = await response.json();

    if (result.success) {
      // Refresh the blogs list
      displayBlogs();
    } else {
      alert(result.message || "Failed to dislike blog");
    }
  } catch (error) {
    console.error("Error disliking blog:", error);
    alert("Failed to dislike blog. Please try again.");
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
        userId: currentUserId,
        text: commentText,
      }),
      credentials: "include",
    });

    const result = await response.json();

    if (result.success) {
      // Clear the comment input
      commentInput.value = "";

      // Refresh the comments section
      displayComments(blogId);
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

      // Process each comment
      for (const comment of comments) {
        // Fetch user info if username is missing
        if (!comment.username) {
          try {
            const userResponse = await fetch(`/api/users/${comment.user_id}`);
            const userData = await userResponse.json();
            comment.username = userData.name; // Assuming the API returns user data with a name field
          } catch (error) {
            console.error("Error fetching user data:", error);
            comment.username = "Unknown User";
          }
        }

        const commentElement = document.createElement("div");
        commentElement.className = "comment";
        const isCommentAuthor = comment.user_id === currentUserId;

        commentElement.innerHTML = `
            <p><strong>${
              comment.username || "Unknown User"
            }</strong> (${formatDate(comment.created_at)}): ${comment.text}</p>
            ${
              isCommentAuthor
                ? `<button onclick="deleteComment(${comment.id})">Delete</button>`
                : ""
            }
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

// Delete a comment
async function deleteComment(commentId) {
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
        body: JSON.stringify({ userId: currentUserId }),
        credentials: "include",
      });

      const result = await response.json();

      if (result.success) {
        // Refresh the page to show updated comments
        displayBlogs();
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
// Example of how your delete function might look
function deleteBlog(blogId) {
  fetch(`/api/blogs/${blogId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    // No need to send userId in the body anymore as your new implementation uses session
    // The credentials option ensures cookies (and thus session) are sent
    credentials: "same-origin",
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((data) => Promise.reject(data));
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        // Remove blog from DOM or refresh the page
        document.getElementById(`blog-${blogId}`).remove();
        // Or: window.location.reload();
      }
    })
    .catch((error) => {
      console.error("Error deleting blog:", error);
      alert("Failed to delete blog: " + (error.message || "Unknown error"));
    });
}

// Filter blogs based on search query
async function filterBlogs() {
  const searchQuery = document
    .getElementById("searchInput")
    .value.toLowerCase();
  const blogsList = document.getElementById("blogsList");
  if (!blogsList) return;

  try {
    // Fetch blogs from server with search query
    const response = await fetch(
      `/api/blogs?search=${encodeURIComponent(searchQuery)}`
    );
    const blogs = await response.json();

    // Clear existing content
    blogsList.innerHTML = "";

    // Display filtered blogs
    if (blogs.length === 0) {
      blogsList.innerHTML = "<p>No matching blogs found.</p>";
    } else {
      const currentUserId = getCurrentUserId();

      for (const blog of blogs) {
        const blogElement = document.createElement("div");
        blogElement.className = "blog-post";

        // Check if current user has liked/disliked this blog
        const userInteractions = await fetch(
          `/api/blogs/${blog.id}/interactions?userId=${currentUserId}`
        );
        const interactions = await userInteractions.json();

        const isLiked = interactions.liked;
        const isDisliked = interactions.disliked;
        const isAuthor = blog.author_id === currentUserId;

        blogElement.innerHTML = `
                    <h3>${blog.title}</h3>
                    <p><strong>Author:</strong> ${blog.author_name}</p>
                    <p>${blog.content}</p>
                    <div class="blog-actions">
                        <div class="buttons">
                            ${
                              isAuthor
                                ? `<button onclick="deleteBlog(${blog.id})">Delete</button>`
                                : ""
                            }
                            <button onclick="likeBlog(${
                              blog.id
                            })" class="like-button ${isLiked ? "liked" : ""}">
                                <i class="${
                                  isLiked
                                    ? "fas fa-thumbs-up"
                                    : "far fa-thumbs-up"
                                }"></i> Like (${blog.likes || 0})
                            </button>
                            <button onclick="dislikeBlog(${
                              blog.id
                            })" class="dislike-button ${
          isDisliked ? "disliked" : ""
        }">
                                <i class="${
                                  isDisliked
                                    ? "fas fa-thumbs-down"
                                    : "far fa-thumbs-down"
                                }"></i> Dislike (${blog.dislikes || 0})
                            </button>
                        </div>
                        <div class="comments-section">
                            <h4>Comments</h4>
                            <div id="comments-${blog.id}"></div>
                            <textarea id="commentInput-${
                              blog.id
                            }" placeholder="Add a comment..."></textarea>
                            <button onclick="addComment(${
                              blog.id
                            })">Add Comment</button>
                        </div>
                    </div>
                    <hr>
                `;
        blogsList.appendChild(blogElement);

        // Display comments for this blog
        displayComments(blog.id);
      }
    }
  } catch (error) {
    console.error("Error filtering blogs:", error);
    blogsList.innerHTML =
      "<p>Error searching blogs. Please try again later.</p>";
  }
}

// Initialize blogs display on community_blogs.html
if (window.location.pathname.includes("community_blogs.html")) {
  displayBlogs();

  // Add event listener for search input
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", filterBlogs);
  }
}
