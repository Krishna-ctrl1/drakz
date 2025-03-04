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

// Open the form
function openForm() {
    const formContainer = document.getElementById('blogFormContainer');
    if (formContainer) {
        formContainer.scrollIntoView({ behavior: 'smooth' });
    }
}

// Close the form
function closeForm() {
    console.log('closeForm() called'); // Debugging
    const formContainer = document.getElementById('blogFormContainer');
    if (formContainer) {
        formContainer.style.display = 'none';
    } else {
        console.error('blogFormContainer not found');
    }
}

// Handle form submission
const blogForm = document.getElementById('blogForm');
if (blogForm) {
    console.log('blogForm found'); // Debugging
    blogForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Prevent default form submission
    
        // Get form data
        const blogTitle = document.getElementById('blogTitle').value.trim();
        const blogContent = document.getElementById('blogContent').value.trim();
    
        // Validate data
        if (!blogTitle || !blogContent) {
            alert('Please fill in all fields.');
            return;
        }
    
        // Create blog post object with default properties
        const blogPost = {
            title: blogTitle,
            author: document.getElementById('authorName').textContent,
            content: blogContent,
            date: new Date().toLocaleDateString(), // Add date
            comments: [], // Initialize comments array
            likes: 0, // Initialize likes
            dislikes: 0, // Initialize dislikes
        };
    
        // Save to localStorage
        let blogs = JSON.parse(localStorage.getItem('blogs')) || [];
        blogs.push(blogPost);
        localStorage.setItem('blogs', JSON.stringify(blogs));
    
        // Close the form
        closeForm();
    
        // Display success message
        alert('Blog post submitted successfully!');
    
        // Refresh the blogs list
        viewBlogs();
    });
} else {
    console.error('blogForm not found');
}

// Update character count for blog title
document.getElementById('blogTitle').addEventListener('input', function () {
    const charCount = this.value.length;
    document.getElementById('titleCharCount').textContent = `${charCount}/50`;
});

// Update character count for blog content
document.getElementById('blogContent').addEventListener('input', function () {
    const charCount = this.value.length;
    document.getElementById('contentCharCount').textContent = `${charCount}/1000`;
});

// Display all blogs
function openForm() {
    const formContainer = document.getElementById('blogFormContainer');
    if (formContainer) {
        formContainer.scrollIntoView({ behavior: 'smooth' });
    }
}


function viewBlogs() {
    const blogsSection = document.getElementById('blogsSection');
    if (blogsSection) {
        blogsSection.scrollIntoView({ behavior: 'smooth' });
    }
    const blogs = JSON.parse(localStorage.getItem('blogs')) || [];
    const blogsList = document.getElementById('blogsList');
    if (!blogsList) return;

    blogsList.innerHTML = '';

    if (blogs.length === 0) {
        blogsList.innerHTML = '<p>No blogs found.</p>';
        return;
    }
    blogs.forEach((blog, index) => {
        const blogElement = document.createElement('div');
        blogElement.className = 'blog-post';
        blogElement.innerHTML = `
            <h3>${blog.title}</h3>
            <p><strong>Author:</strong> ${blog.author}</p>
            <p>${blog.content}</p>
            <div class="blog-actions">
            <div class="buttons">
                <button onclick="deleteBlog(${index})">Delete</button>
                <button onclick="likeBlog(${index})">Like (${blog.likes || 0})</button>
                <button onclick="dislikeBlog(${index})">Dislike (${blog.dislikes || 0})</button>
            </div>

            <div class="comments-section">
                <h4>Comments</h4>
                <div id="comments-${index}"></div>
                <textarea id="commentInput-${index}" placeholder="Add a comment..."></textarea>
                <button onclick="addComment(${index})">Add Comment</button>
            </div>

            <div>
            <hr>
        `;
        blogsList.appendChild(blogElement);

        // Display comments for this blog
        displayComments(index);
    });
}
const blogPost = {
    title: blogTitle,
    author: document.getElementById('authorName').textContent,
    content: blogContent,
    date: new Date().toLocaleDateString(), // Add date
    comments: [], // Initialize comments array
    likes: 0, // Initialize likes
    dislikes: 0, // Initialize dislikes
};
//search
// Filter blogs based on search query
function filterBlogs() {
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    const blogs = JSON.parse(localStorage.getItem('blogs')) || [];

    // Get the blogs list container
    const blogsList = document.getElementById('blogsList');
    if (!blogsList) {
        console.error('blogsList not found');
        return;
    }

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
            blogElement.innerHTML = `
                <h3>${blog.title}</h3>
                <p><strong>Author:</strong> ${blog.author}</p>
                <p>${blog.content}</p>
                <div class="blog-actions">
                    <button onclick="editBlog(${index})">Edit</button>
                    <button onclick="deleteBlog(${index})">Delete</button>
                </div>
                <hr>
            `;
            blogsList.appendChild(blogElement);
        });
    }
}

//comments
// Display each blog
blogs.forEach((blog, index) => {
    const blogElement = document.createElement('div');
    blogElement.className = 'blog-post';
    blogElement.innerHTML = `
        <h3>${blog.title}</h3>
        <p><strong>Author:</strong> ${blog.author}</p>
        <p>${blog.content}</p>
         <div class="buttons">
                <button onclick="deleteBlog(${index})">Delete</button>
                <button onclick="likeBlog(${index})">Like (${blog.likes || 0})</button>
                <button onclick="dislikeBlog(${index})">Dislike (${blog.dislikes || 0})</button>
            </div>

            <div class="comments-section">
                <h4>Comments</h4>
                <div id="comments-${index}"></div>
                <textarea id="commentInput-${index}" placeholder="Add a comment..."></textarea>
                <button onclick="addComment(${index})">Add Comment</button>
            </div>

            <div>
        <hr>
    `;
    blogsList.appendChild(blogElement);

    // Display comments for this blog
    displayComments(index);
});
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
        author: "Current User", // Replace with actual user
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
            commentElement.innerHTML = `
                <p><strong>${comment.author}</strong> (${comment.date}): ${comment.text}</p>
                <button onclick="deleteComment(${blogIndex}, ${commentIndex})">Delete</button>
            `;
            commentsContainer.appendChild(commentElement);
        });
    }
}
// Delete a comment
function deleteComment(blogIndex, commentIndex) {
    // Fetch blogs from localStorage
    const blogs = JSON.parse(localStorage.getItem('blogs')) || [];

    /* // Check if the current user is the author of the comment
    if (blogs[blogIndex].comments[commentIndex].author !== "Current User") {
        alert('You can only delete your own comments.');
        return;
    } */

    // Remove the comment
    blogs[blogIndex].comments.splice(commentIndex, 1);

    // Save updated blogs to localStorage
    localStorage.setItem('blogs', JSON.stringify(blogs));

    // Refresh the comments section
    displayComments(blogIndex);
}

//like or dislike

// Like Blog
function likeBlog(index) {
    const blogs = JSON.parse(localStorage.getItem('blogs')) || [];
    blogs[index].likes = (blogs[index].likes || 0) + 1; // Increment likes
    localStorage.setItem('blogs', JSON.stringify(blogs)); // Save updated blogs
    viewBlogs(); // Refresh the blogs list
}

// Dislike Blog
function dislikeBlog(index) {
    const blogs = JSON.parse(localStorage.getItem('blogs')) || [];
    blogs[index].dislikes = (blogs[index].dislikes || 0) + 1; // Increment dislikes
    localStorage.setItem('blogs', JSON.stringify(blogs)); // Save updated blogs
    viewBlogs(); // Refresh the blogs list
}
// Display each blog

// Function to delete a blog
function deleteBlog(index) {
    console.log('Delete button clicked for index:', index); // Debugging

    if (confirm('Are you sure you want to delete this blog?')) {
        let blogs = JSON.parse(localStorage.getItem('blogs')) || [];
        console.log('Blogs before deletion:', blogs); // Debugging

        if (index >= 0 && index < blogs.length) {
            blogs.splice(index, 1);
            console.log('Blogs after deletion:', blogs); // Debugging

            localStorage.setItem('blogs', JSON.stringify(blogs));
            viewBlogs(); // Refresh UI after deletion
        } else {
            console.error('Invalid index:', index);
        }
    }
}
    