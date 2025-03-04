// Open the form
function openForm() {
    document.getElementById('blogForm').style.display = 'flex';
  }
  
  // Close all forms
  function closeAllForms() {
    document.querySelectorAll('.modal').forEach((modal) => {
        modal.style.display = 'none';
    });
  }
  
  // Close form when clicking outside
  window.addEventListener('click', function (event) {
    if (event.target.classList.contains('modal')) {
        closeAllForms();
    }
  });
  
  // Navigate to Form 2
  function goToForm2() {
    const blogTitle = document.getElementById('blogTitle').value.trim();
    if (blogTitle === '') {
        alert('Please fill in the blog title.');
        return;
    }
    closeAllForms();
    document.getElementById('blogForm2').style.display = 'flex';
  }
  
  // Navigate to Form 3
  function goToForm3() {
    const displayName = document.getElementById('DisplayName').value.trim();
    if (displayName === '') {
        alert('Please enter a display name.');
        return;
    }
    closeAllForms();
    document.getElementById('blogForm3').style.display = 'flex';
  }
  
  // Submit Blog
  document.getElementById("form3").addEventListener("submit", function (e) {
    e.preventDefault();
    const title = document.getElementById("blogTitle").value.trim();
    const author = document.getElementById("DisplayName").value.trim();
    const content = document.getElementById("content").value.trim();
    if (content === '') {
        alert('Please write some content.');
        return;
    }
  
    const blog = {
        title,
        author,
        content,
        likes: 0,
        liked: false,
        bookmarked: false,
        comments: []
    };
  
    const blogs = JSON.parse(localStorage.getItem("blogs")) || [];
    blogs.push(blog);
    localStorage.setItem("blogs", JSON.stringify(blogs));
  
    alert("Blog submitted successfully!");
    closeAllForms();
    viewBlogs(); // Refresh blog view
  });
  
  // Add Comment
  function addComment(index) {
      let blogs = JSON.parse(localStorage.getItem("blogs")) || [];
      if (!blogs[index]) return;
  
      const comment = prompt("Enter your comment:");
      if (comment) {
          blogs[index].comments.push(comment);
          localStorage.setItem("blogs", JSON.stringify(blogs));
          viewBlogs();
      }
  }
  
  // Delete Comment
  function deleteComment(blogIndex, commentIndex) {
      let blogs = JSON.parse(localStorage.getItem("blogs")) || [];
      if (!blogs[blogIndex]) return;
  
      blogs[blogIndex].comments.splice(commentIndex, 1);
      localStorage.setItem("blogs", JSON.stringify(blogs));
      viewBlogs();
  }
  
  // View Blogs (Updated to Show Comments Stacked)
  function viewBlogs() {
    const blogsContainer = document.getElementById("blogsContainer");
  
    if (!blogsContainer) {
        console.error("Error: blogsContainer not found in HTML.");
        return;
    }
  
    blogsContainer.innerHTML = "";
  
    const blogs = JSON.parse(localStorage.getItem("blogs")) || [];
  
    if (blogs.length === 0) {
        blogsContainer.innerHTML = "<p>No blogs available. Start by adding one!</p>";
        return;
    }
  
    blogs.forEach((blog, index) => {
        const blogPost = document.createElement("div");
        blogPost.classList.add("blog-post");
  
        blogPost.innerHTML = `
            <div class="blog-content">
                <h3>${blog.title}</h3>
                <p><strong>Written by:</strong> ${blog.author}</p>
                <p>${blog.content.slice(0, 100)}...</p>
                <button onclick="toggleReadMore(${index})">Read More</button>
                <div class="full-blog-content" style="display: none;">
                    <p>${blog.content}</p>
                </div>
            </div>
            <div class="blog-actions">
                <button onclick="toggleLike(${index})">${blog.liked ? "Unlike" : "Like"} 👍 ${blog.likes}</button>
                <button onclick="deleteBlog(${index})">🗑️ Delete</button>
                <button onclick="addComment(${index})">💬 Comment</button>
            </div>
            <div id="comments-${index}" class="comments-container">
                ${blog.comments.map((comment, cIndex) => `
                    <div class="comment-item">
                        <p>💬 ${comment}</p>
                        <button onclick="deleteComment(${index}, ${cIndex})">❌</button>
                    </div>
                `).join("")}
            </div>
        `;
  
        blogsContainer.appendChild(blogPost);
    });
  }
  
  // Toggle Like Button
  function toggleLike(index) {
    let blogs = JSON.parse(localStorage.getItem("blogs")) || [];
    if (!blogs[index]) return;
  
    blogs[index].liked = !blogs[index].liked;
    blogs[index].likes += blogs[index].liked ? 1 : -1;
  
    localStorage.setItem("blogs", JSON.stringify(blogs));
    setTimeout(viewBlogs, 0);
  }
  
  // Delete Blog
  function deleteBlog(index) {
    const confirmation = confirm("Are you sure you want to delete this blog?");
    if (confirmation) {
        const blogs = JSON.parse(localStorage.getItem("blogs")) || [];
        blogs.splice(index, 1);
        localStorage.setItem("blogs", JSON.stringify(blogs));
        viewBlogs();
    }
  }