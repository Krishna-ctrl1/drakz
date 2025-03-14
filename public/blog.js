// Sidebar Functions
function openNav() {
    const sidebar = document.getElementById("mySidebar");
    const closeButton = document.getElementById("close-button");

    sidebar.style.width = "180px"; // Open sidebar to full width
    document.getElementById("main").style.marginLeft = "180px"; // Adjust main content
    closeButton.innerHTML = '<img width="25" src="assets/icons/sidebarclose.png">'; // Set close button image
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
   openNav(); // Start with the sidebar collapsed
});

// Overlay Form Functions
function openForm() {
    const overlay = document.getElementById('overlay');
    overlay.classList.add('active');
}

function closeForm() {
    const overlay = document.getElementById('overlay');
    overlay.classList.remove('active');

    // Reset form fields
    document.getElementById('blogTitle').value = '';
    document.getElementById('blogContent').value = '';
    document.getElementById('titleCharCount').textContent = '0/50';
    document.getElementById('contentCharCount').textContent = '0/1000';
}

// Handle form submission
const blogForm = document.getElementById('blogForm');
if (blogForm) {
    blogForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Prevent default form submission

        // Get form data
        const blogTitle = document.getElementById('blogTitle').value.trim();
        const blogContent = document.getElementById('blogContent').value.trim();
        const username = localStorage.getItem('username') || 'Anonymous'; // Get username or default to 'Anonymous'

        // Validate data
        if (!blogTitle || !blogContent) {
            alert('Please fill in all fields.');
            return;
        }

        // Create blog post object
        const blogPost = {
            title: blogTitle,
            author: username, // Use the username from localStorage
            content: blogContent,
            date: new Date().toLocaleDateString(),
            comments: [],
            likes: 0,
            dislikes: 0,
            likedBy: [], // Track users who liked the blog
            dislikedBy: [], // Track users who disliked the blog
        };

        // Save to localStorage
        let blogs = JSON.parse(localStorage.getItem('blogs')) || [];
        blogs.push(blogPost);
        localStorage.setItem('blogs', JSON.stringify(blogs));

        // Close the form
        closeForm();

        // Display success message
        alert('Blog post submitted successfully!');
    });
}

// Redirect to blogs.html for "Read Blogs"
function viewBlogs() {
    window.location.href = 'blogs.html';
}

// Display all blogs (for blogs.html)
function displayBlogs() {
    const blogs = JSON.parse(localStorage.getItem('blogs')) || [];
    const blogsList = document.getElementById('blogsList');
    if (!blogsList) return;

    blogsList.innerHTML = '';

    if (blogs.length === 0) {
        blogsList.innerHTML = '<p>No blogs found.</p>';
        return;
    }

    const currentUser = localStorage.getItem('username'); // Get the current user's username

    blogs.forEach((blog, index) => {
        const blogElement = document.createElement('div');
        blogElement.className = 'blog-post';
        const isLiked = blog.likedBy && blog.likedBy.includes(currentUser); // Check if the user has liked the blog
        const isDisliked = blog.dislikedBy && blog.dislikedBy.includes(currentUser); // Check if the user has disliked the blog
        const isAuthor = blog.author === currentUser; // Check if the current user is the author

        blogElement.innerHTML = `
            <h3>${blog.title}</h3>
            <p><strong>Author:</strong> ${blog.author}</p>
            <p>${blog.content}</p>
            <div class="blog-actions">
                <div class="buttons">
                    ${isAuthor ? `<button onclick="deleteBlog(${index})">Delete</button>` : ''}
                    <button onclick="likeBlog(${index})" class="like-button ${isLiked ? 'liked' : ''}">
                        <i class="${isLiked ? 'fas fa-thumbs-up' : 'far fa-thumbs-up'}"></i> Like (${blog.likes || 0})
                    </button>
                    <button onclick="dislikeBlog(${index})" class="dislike-button ${isDisliked ? 'disliked' : ''}">
                        <i class="${isDisliked ? 'fas fa-thumbs-down' : 'far fa-thumbs-down'}"></i> Dislike (${blog.dislikes || 0})
                    </button>
                </div>
                <div class="comments-section">
                    <h4>Comments</h4>
                    <div id="comments-${index}"></div>
                    <textarea id="commentInput-${index}" placeholder="Add a comment..."></textarea>
                    <button onclick="addComment(${index})">Add Comment</button>
                </div>
            </div>
            <hr>
        `;
        blogsList.appendChild(blogElement);

        // Display comments for this blog
        displayComments(index);
    });
}

// Like Blog
function likeBlog(index) {
    const blogs = JSON.parse(localStorage.getItem('blogs')) || [];
    const userId = localStorage.getItem('username'); // Get the current user's username

    // Initialize likedBy array if it doesn't exist
    if (!blogs[index].likedBy) {
        blogs[index].likedBy = [];
    }

    // Check if the user has already liked the blog
    const userIndex = blogs[index].likedBy.indexOf(userId);

    if (userIndex === -1) {
        // User hasn't liked the blog yet
        blogs[index].likes = (blogs[index].likes || 0) + 1; // Increment likes
        blogs[index].likedBy.push(userId); // Add user to likedBy array
    } else {
        // User has already liked the blog, so remove their like
        blogs[index].likes = (blogs[index].likes || 0) - 1; // Decrement likes
        blogs[index].likedBy.splice(userIndex, 1); // Remove user from likedBy array
    }

    // Save updated blogs to localStorage
    localStorage.setItem('blogs', JSON.stringify(blogs));

    // Refresh the blogs list
    displayBlogs();
}

// Dislike Blog
function dislikeBlog(index) {
    const blogs = JSON.parse(localStorage.getItem('blogs')) || [];
    const userId = localStorage.getItem('username'); // Get the current user's username

    // Initialize dislikedBy array if it doesn't exist
    if (!blogs[index].dislikedBy) {
        blogs[index].dislikedBy = [];
    }

    // Check if the user has already disliked the blog
    const userIndex = blogs[index].dislikedBy.indexOf(userId);

    if (userIndex === -1) {
        // User hasn't disliked the blog yet
        blogs[index].dislikes = (blogs[index].dislikes || 0) + 1; // Increment dislikes
        blogs[index].dislikedBy.push(userId); // Add user to dislikedBy array

        // If the user previously liked the blog, remove their like
        if (blogs[index].likedBy && blogs[index].likedBy.includes(userId)) {
            blogs[index].likes = (blogs[index].likes || 0) - 1; // Decrement likes
            blogs[index].likedBy.splice(blogs[index].likedBy.indexOf(userId), 1); // Remove user from likedBy array
        }
    } else {
        // User has already disliked the blog, so remove their dislike
        blogs[index].dislikes = (blogs[index].dislikes || 0) - 1; // Decrement dislikes
        blogs[index].dislikedBy.splice(userIndex, 1); // Remove user from dislikedBy array
    }

    // Save updated blogs to localStorage
    localStorage.setItem('blogs', JSON.stringify(blogs));

    // Refresh the blogs list
    displayBlogs();
}

// Add a comment to a blog
function addComment(blogIndex) {
    const commentInput = document.getElementById(`commentInput-${blogIndex}`);
    const commentText = commentInput.value.trim();

    if (!commentText) {
        alert('Please enter a comment.');
        return;
    }

    // Fetch blogs from localStorage
    const blogs = JSON.parse(localStorage.getItem('blogs')) || [];

    // Add the comment
    if (!blogs[blogIndex].comments) {
        blogs[blogIndex].comments = [];
    }
    blogs[blogIndex].comments.push({
        text: commentText,
        author: localStorage.getItem('username') || 'Anonymous', // Use the current user's username
        date: new Date().toLocaleDateString(),
    });

    // Save updated blogs to localStorage
    localStorage.setItem('blogs', JSON.stringify(blogs));

    // Clear the comment input
    commentInput.value = '';

    // Refresh the comments section
    displayComments(blogIndex);
}

// Display comments for a blog
function displayComments(blogIndex) {
    const blogs = JSON.parse(localStorage.getItem('blogs')) || [];
    const commentsContainer = document.getElementById(`comments-${blogIndex}`);
    if (!commentsContainer) return;

    // Clear existing comments
    commentsContainer.innerHTML = '';

    // Display each comment
    if (blogs[blogIndex].comments) {
        blogs[blogIndex].comments.forEach((comment, commentIndex) => {
            const commentElement = document.createElement('div');
            commentElement.className = 'comment';
            const isCommentAuthor = comment.author === localStorage.getItem('username'); // Check if the current user is the comment author

            commentElement.innerHTML = `
                <p><strong>${comment.author}</strong> (${comment.date}): ${comment.text}</p>
                ${isCommentAuthor ? `<button onclick="deleteComment(${blogIndex}, ${commentIndex})">Delete</button>` : ''}
            `;
            commentsContainer.appendChild(commentElement);
        });
    }
}

// Delete a comment
function deleteComment(blogIndex, commentIndex) {
    const blogs = JSON.parse(localStorage.getItem('blogs')) || [];
    const currentUser = localStorage.getItem('username'); // Get the current user's username
    const commentAuthor = blogs[blogIndex].comments[commentIndex].author; // Get the comment's author username

    // Check if the current user is the author of the comment
    if (currentUser === commentAuthor) {
        if (confirm('Are you sure you want to delete this comment?')) {
            blogs[blogIndex].comments.splice(commentIndex, 1); // Remove the comment from the array
            localStorage.setItem('blogs', JSON.stringify(blogs)); // Save updated blogs to localStorage
            displayComments(blogIndex); // Refresh the comments section
        }
    } else {
        alert('You are not authorized to delete this comment.'); // Show error message
    }
}

// Delete a blog
function deleteBlog(index) {
    const blogs = JSON.parse(localStorage.getItem('blogs')) || [];
    const currentUser = localStorage.getItem('username'); // Get the current user's username
    const blogAuthor = blogs[index].author; // Get the blog's author username

    // Check if the current user is the author of the blog
    if (currentUser === blogAuthor) {
        if (confirm('Are you sure you want to delete this blog?')) {
            blogs.splice(index, 1); // Remove the blog from the array
            localStorage.setItem('blogs', JSON.stringify(blogs)); // Save updated blogs to localStorage
            displayBlogs(); // Refresh the blogs list
        }
    } else {
        alert('You are not authorized to delete this blog.'); // Show error message
    }
}

// Filter blogs based on search query
function filterBlogs() {
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    const blogs = JSON.parse(localStorage.getItem('blogs')) || [];
    const blogsList = document.getElementById('blogsList');
    if (!blogsList) return;

    // Clear existing content
    blogsList.innerHTML = '';

    // Filter blogs
    const filteredBlogs = blogs.filter(blog => {
        return (
            blog.title.toLowerCase().includes(searchQuery) ||
            blog.author.toLowerCase().includes(searchQuery) ||
            blog.content.toLowerCase().includes(searchQuery)
        );
    });

    // Display filtered blogs
    if (filteredBlogs.length === 0) {
        blogsList.innerHTML = '<p>No matching blogs found.</p>';
    } else {
        filteredBlogs.forEach((blog, index) => {
            const blogElement = document.createElement('div');
            blogElement.className = 'blog-post';
            const isLiked = blog.likedBy && blog.likedBy.includes(localStorage.getItem('username')); // Check if the user has liked the blog
            const isDisliked = blog.dislikedBy && blog.dislikedBy.includes(localStorage.getItem('username')); // Check if the user has disliked the blog
            const isAuthor = blog.author === localStorage.getItem('username'); // Check if the current user is the author

            blogElement.innerHTML = `
                <h3>${blog.title}</h3>
                <p><strong>Author:</strong> ${blog.author}</p>
                <p>${blog.content}</p>
                <div class="blog-actions">
                    <div class="buttons">
                        ${isAuthor ? `<button onclick="deleteBlog(${index})">Delete</button>` : ''}
                        <button onclick="likeBlog(${index})" class="like-button ${isLiked ? 'liked' : ''}">
                            <i class="${isLiked ? 'fas fa-thumbs-up' : 'far fa-thumbs-up'}"></i> Like (${blog.likes || 0})
                        </button>
                        <button onclick="dislikeBlog(${index})" class="dislike-button ${isDisliked ? 'disliked' : ''}">
                            <i class="${isDisliked ? 'fas fa-thumbs-down' : 'far fa-thumbs-down'}"></i> Dislike (${blog.dislikes || 0})
                        </button>
                    </div>
                    <div class="comments-section">
                        <h4>Comments</h4>
                        <div id="comments-${index}"></div>
                        <textarea id="commentInput-${index}" placeholder="Add a comment..."></textarea>
                        <button onclick="addComment(${index})">Add Comment</button>
                    </div>
                </div>
                <hr>
            `;
            blogsList.appendChild(blogElement);

            // Display comments for this blog
            displayComments(index);
        });
    }
}

// Initialize blogs display on community_blogs.html
if (window.location.pathname.includes('community_blogs.html')) {
    displayBlogs();
}