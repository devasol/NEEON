import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styles from "./PostsView.module.css";

// Icons
const EditIcon = () => <span>✏️</span>;
const DeleteIcon = () => <span>🗑️</span>;
const ViewIcon = () => <span>👁️</span>;
const SearchIcon = () => <span>🔍</span>;
const FilterIcon = () => <span>⚡</span>;
const PlusIcon = () => <span>+</span>;
const CloseIcon = () => <span>×</span>;
const CalendarIcon = () => <span>📅</span>;
const EyeIcon = () => <span>👀</span>;
const ChartIcon = () => <span>📊</span>;
const ImageIcon = () => <span>🖼️</span>;
const UploadIcon = () => <span>📤</span>;
const SparkleIcon = () => <span>✨</span>;

const PostsView = () => {
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("content");
  const fileInputRef = useRef(null);

  // new-post modal/form state
  const [newOpen, setNewOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategory, setNewCategory] = useState("Uncategorized");
  const [newStatus, setNewStatus] = useState("Draft");
  const [newImageFile, setNewImageFile] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState(null);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isDragging, setIsDragging] = useState(false);

  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  // Get unique categories
  const categories = ["All", ...new Set(posts.map((post) => post.category))];
  const statuses = ["All", "Published", "Draft", "Scheduled"];

  // fetch blogs from backend on mount
  useEffect(() => {
    let mounted = true;
    axios
      .get("http://localhost:9000/api/v1/blogs")
      .then((res) => {
        if (!mounted) return;
        const blogs = res.data.blogs?.allBlogs || [];
        // map backend blog shape to UI post shape
        const mapped = blogs.map((b) => ({
          id: b._id,
          title: b.newsTitle,
          excerpt: b.newsDescription ? b.newsDescription.slice(0, 140) : "",
          content: b.newsDescription || "",
          category: b.category || "Uncategorized",
          status: b.status || "Draft",
          author: b.postedBy || "Admin",
          date: b.datePosted || b.createdAt || new Date().toISOString(),
          views: b.views || 0,
          comments: b.comments || 0,
          image: b.imageUrl || null,
        }));
        setPosts(mapped);
      })
      .catch((err) => {
        console.debug("Could not fetch blogs:", err.message || err);
        // Fallback dummy data for demonstration
        setPosts([
          {
            id: 1,
            title: "Welcome to Your Blog",
            excerpt:
              "This is your first post. Start creating amazing content for your audience...",
            content:
              "This is your first post. Start creating amazing content for your audience...",
            category: "Uncategorized",
            status: "Published",
            author: "Admin",
            date: new Date().toISOString(),
            views: 42,
            comments: 3,
            image: null,
          },
        ]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // listen for global 'open-new-post' events (dispatched from Header)
  // Store the full blog data to access when editing
  const [fullBlogData, setFullBlogData] = useState([]);

  useEffect(() => {
    const handleOpen = () => setNewOpen(true);
    window.addEventListener("open-new-post", handleOpen);
    return () => window.removeEventListener("open-new-post", handleOpen);
  }, []);

  // fetch blogs from backend on mount
  useEffect(() => {
    let mounted = true;
    axios
      .get("http://localhost:9000/api/v1/blogs")
      .then((res) => {
        if (!mounted) return;
        const blogs = res.data.blogs?.allBlogs || [];
        setFullBlogData(blogs); // Store full blog data
        // map backend blog shape to UI post shape
        const mapped = blogs.map((b) => ({
          id: b._id,
          title: b.newsTitle,
          excerpt: b.newsDescription ? b.newsDescription.slice(0, 140) : "",
          content: b.newsDescription || "",
          category: b.category || "Uncategorized",
          status: b.status || "Draft",
          author: b.postedBy || "Admin",
          date: b.datePosted || b.createdAt || new Date().toISOString(),
          views: b.views || 0,
          comments: b.comments || 0,
          image: b.imageUrl || null,
        }));
        setPosts(mapped);
      })
      .catch((err) => {
        console.debug("Could not fetch blogs:", err.message || err);
        // Fallback dummy data for demonstration
        setPosts([
          {
            id: 1,
            title: "Welcome to Your Blog",
            excerpt:
              "This is your first post. Start creating amazing content for your audience...",
            content:
              "This is your first post. Start creating amazing content for your audience...",
            category: "Uncategorized",
            status: "Published",
            author: "Admin",
            date: new Date().toISOString(),
            views: 42,
            comments: 3,
            image: null,
          },
        ]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Filter and sort posts
  const filteredPosts = posts
    .filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((post) => statusFilter === "All" || post.status === statusFilter)
    .filter(
      (post) => categoryFilter === "All" || post.category === categoryFilter
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.date) - new Date(a.date);
        case "oldest":
          return new Date(a.date) - new Date(b.date);
        case "views":
          return b.views - a.views;
        case "comments":
          return b.comments - a.comments;
        default:
          return 0;
      }
    });

  const handleViewPost = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const handleEditPost = (post) => {
    // Find the original blog data to populate imageUrl
    const originalBlog = fullBlogData.find(b => b._id === post.id);
    
    // open the create/edit modal in edit mode and populate fields
    setIsEditing(true);
    setNewTitle(post.title || "");
    setNewDescription(post.content || "");
    setNewCategory(post.category || "Uncategorized");
    setNewStatus(post.status || "Draft");
    // image handling: we keep preview if available
    setNewImagePreview(post.image || null);
    setNewImageUrl(originalBlog?.imageUrl || ""); // Set imageUrl field if it exists in the original blog data
    setNewImageFile(null); // clear file input until user selects new file
    setFormErrors({});
    setActiveTab("content");
    setNewOpen(true);
    // store the editing post id in selectedPost for PATCH
    setSelectedPost(post);
  };

  const handleDeletePost = async (post) => {
    if (window.confirm(`Are you sure you want to delete "${post.title}"?`)) {
      try {
        await axios.delete(`http://localhost:9000/api/v1/blogs/${post.id}`);
        setPosts(posts.filter((p) => p.id !== post.id));
        // Show success message with animation
        const deleteEvent = new CustomEvent("showToast", {
          detail: { message: "Post deleted successfully!", type: "success" },
        });
        window.dispatchEvent(deleteEvent);
      } catch (err) {
        console.error("Error deleting post:", err);
        const errorEvent = new CustomEvent("showToast", {
          detail: { message: "Error deleting post", type: "error" },
        });
        window.dispatchEvent(errorEvent);
      }
    }
  };

  const handleNewPost = () => {
    setNewOpen(true);
    setFormErrors({});
    setActiveTab("content");
  };

  // Enhanced image handling with drag & drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith("image/")) {
      handleImageSelect(files[0]);
    }
  };

  const handleImageSelect = (file) => {
    if (file.size > 5 * 1024 * 1024) {
      setFormErrors((prev) => ({
        ...prev,
        image: "Image size should be less than 5MB",
      }));
      return;
    }
    setNewImageFile(file);
    setNewImagePreview(URL.createObjectURL(file));
    setFormErrors((prev) => ({ ...prev, image: null }));
  };

  const onImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setNewImageFile(null);
    setNewImagePreview(null);
  };

  const validateForm = () => {
    const errors = {};
    if (!newTitle.trim()) errors.title = "Title is required";
    if (!newDescription.trim()) errors.description = "Description is required";
    if (newDescription.length < 50)
      errors.description = "Description should be at least 50 characters";
    if (!newCategory.trim()) errors.category = "Category is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submitNewPost = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const form = new FormData();
      form.append("newsTitle", newTitle);
      form.append("newsDescription", newDescription);
      form.append("category", newCategory);
      form.append("status", newStatus);
      form.append("postedBy", "Admin");
      if (newImageFile) form.append("image", newImageFile);
      if (newImageUrl) form.append("imageUrl", newImageUrl);

      let res;
      if (isEditing && selectedPost && selectedPost.id) {
        // PATCH existing post
        res = await axios.patch(
          `http://localhost:9000/api/v1/blogs/${selectedPost.id}`,
          form,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        res = await axios.post("http://localhost:9000/api/v1/blogs", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (res.status >= 200 && res.status < 300) {
        const b =
          res.data.blog || res.data.blog?.updatedBlog || res.data.blog?.blog;
        // If editing, update the existing post in state
        if (isEditing && selectedPost && selectedPost.id) {
          const updated = {
            id: selectedPost.id,
            title: form.get("newsTitle") || newTitle,
            excerpt: (form.get("newsDescription") || newDescription).slice(
              0,
              140
            ),
            content: form.get("newsDescription") || newDescription,
            category: form.get("category") || newCategory,
            status: form.get("status") || newStatus,
            author: selectedPost.author || "Admin",
            date: selectedPost.date || new Date().toISOString(),
            views: selectedPost.views || 0,
            comments: selectedPost.comments || 0,
            image:
              newImagePreview ||
              newImageUrl ||
              (b && (b.imageUrl || b.image)) ||
              selectedPost.image,
          };
          setPosts((prev) =>
            prev.map((p) => (p.id === selectedPost.id ? updated : p))
          );
          resetForm();
          setNewOpen(false);
          setIsEditing(false);
          setSelectedPost(null);
        } else {
          const newPost = {
            id: b._id || b.id,
            title: b.newsTitle,
            excerpt: b.newsDescription ? b.newsDescription.slice(0, 140) : "",
            content: b.newsDescription || "",
            category: b.category || newCategory,
            status: b.status || newStatus,
            author: b.postedBy || "Admin",
            date: b.datePosted || new Date().toISOString(),
            views: 0,
            comments: 0,
            image: newImagePreview || newImageUrl || b.imageUrl || null,
          };
          setPosts((prev) => [newPost, ...prev]);
          resetForm();
          setNewOpen(false);
        }

        // Success message
        const successEvent = new CustomEvent("showToast", {
          detail: { message: "Post created successfully! 🎉", type: "success" },
        });
        window.dispatchEvent(successEvent);
      }
    } catch (err) {
      console.error("Error creating post:", err);
      const errorEvent = new CustomEvent("showToast", {
        detail: {
          message:
            "Error creating post: " +
            (err.response?.data?.message || err.message),
          type: "error",
        },
      });
      window.dispatchEvent(errorEvent);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setNewTitle("");
    setNewDescription("");
    setNewCategory("Uncategorized");
    setNewStatus("Draft");
    setNewImageFile(null);
    setNewImagePreview(null);
    setNewImageUrl("");
    setFormErrors({});
    setActiveTab("content");
    setIsEditing(false);
    setSelectedPost(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
    document.body.style.overflow = "unset";
  };

  const closeNewPostModal = () => {
    setNewOpen(false);
    resetForm();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Published":
        return "#10b981";
      case "Draft":
        return "#f59e0b";
      case "Scheduled":
        return "#3b82f6";
      default:
        return "#6b7280";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Published":
        return "✅";
      case "Draft":
        return "📝";
      case "Scheduled":
        return "⏰";
      default:
        return "📄";
    }
  };

  const characterCount = newDescription.length;
  const wordCount = newDescription.trim()
    ? newDescription.trim().split(/\s+/).length
    : 0;

  // Fallback image for posts without images
  const getPostImage = (post) => {
    return post.image || `https://picsum.photos/100/60?random=${post.id}`;
  };

  return (
    <section className={styles.postsView}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h2>Blog Posts</h2>
          <p>Manage and organize your blog content efficiently</p>
        </div>
        <button className={styles.newPostBtn} onClick={handleNewPost}>
          <PlusIcon />
          New Post
        </button>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <SearchIcon />
          <input
            type="text"
            placeholder="Search posts by title or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filters}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterSelect}
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={styles.filterSelect}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="views">Most Views</option>
            <option value="comments">Most Comments</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>{posts.length}</span>
          <span className={styles.statLabel}>Total Posts</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>
            {posts.filter((p) => p.status === "Published").length}
          </span>
          <span className={styles.statLabel}>Published</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>
            {posts.filter((p) => p.status === "Draft").length}
          </span>
          <span className={styles.statLabel}>Drafts</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>
            {posts.reduce((sum, post) => sum + post.views, 0).toLocaleString()}
          </span>
          <span className={styles.statLabel}>Total Views</span>
        </div>
      </div>

      {/* Posts Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableContainer}>
          <table className={styles.postsTable}>
            <thead>
              <tr>
                <th>Post</th>
                <th>Category</th>
                <th>Status</th>
                <th>Metrics</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post) => (
                <tr key={post.id} className={styles.postRow}>
                  <td>
                    <div className={styles.postInfo}>
                      <img
                        src={getPostImage(post)}
                        alt={post.title}
                        className={styles.postImage}
                        onError={(e) => {
                          e.target.src = `https://picsum.photos/100/60?random=${post.id}`;
                        }}
                      />
                      <div className={styles.postDetails}>
                        <div className={styles.postTitle}>{post.title}</div>
                        <div className={styles.postExcerpt}>
                          {post.excerpt}...
                        </div>
                        <div className={styles.postAuthor}>
                          By {post.author}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={styles.categoryBadge}>
                      {post.category}
                    </span>
                  </td>
                  <td>
                    <span
                      className={styles.statusBadge}
                      style={{ backgroundColor: getStatusColor(post.status) }}
                    >
                      {getStatusIcon(post.status)} {post.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles.metrics}>
                      <span className={styles.metric}>
                        <EyeIcon /> {post.views.toLocaleString()}
                      </span>
                      <span className={styles.metric}>💬 {post.comments}</span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.date}>
                      <CalendarIcon />
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={`${styles.actionBtn} ${styles.viewBtn}`}
                        onClick={() => handleViewPost(post)}
                        title="View Post"
                      >
                        <ViewIcon />
                      </button>
                      <button
                        className={`${styles.actionBtn} ${styles.editBtn}`}
                        onClick={() => handleEditPost(post)}
                        title="Edit Post"
                      >
                        <EditIcon />
                      </button>
                      <button
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        onClick={() => handleDeletePost(post)}
                        title="Delete Post"
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredPosts.length === 0 && (
            <div className={styles.noPosts}>
              <div className={styles.noPostsIcon}>📝</div>
              <h3>No posts found</h3>
              <p>Try adjusting your search or filters</p>
              <button className={styles.newPostBtn} onClick={handleNewPost}>
                <PlusIcon />
                Create Your First Post
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Post Detail Modal */}
      {isModalOpen && selectedPost && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeModal}>
              <CloseIcon />
            </button>

            <div className={styles.modalHeader}>
              <img
                src={getPostImage(selectedPost)}
                alt={selectedPost.title}
                className={styles.modalImage}
                onError={(e) => {
                  e.target.src = `https://picsum.photos/400/200?random=${selectedPost.id}`;
                }}
              />
              <div className={styles.modalTitleSection}>
                <h2>{selectedPost.title}</h2>
                <div className={styles.modalMeta}>
                  <span className={styles.modalCategory}>
                    {selectedPost.category}
                  </span>
                  <span
                    className={styles.modalStatus}
                    style={{ color: getStatusColor(selectedPost.status) }}
                  >
                    {getStatusIcon(selectedPost.status)} {selectedPost.status}
                  </span>
                  <span className={styles.modalDate}>
                    <CalendarIcon />{" "}
                    {new Date(selectedPost.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.modalContent}>
              <div className={styles.modalStats}>
                <div className={styles.modalStat}>
                  <span className={styles.modalStatNumber}>
                    {selectedPost.views.toLocaleString()}
                  </span>
                  <span className={styles.modalStatLabel}>Views</span>
                </div>
                <div className={styles.modalStat}>
                  <span className={styles.modalStatNumber}>
                    {selectedPost.comments}
                  </span>
                  <span className={styles.modalStatLabel}>Comments</span>
                </div>
                <div className={styles.modalStat}>
                  <span className={styles.modalStatNumber}>
                    {selectedPost.author}
                  </span>
                  <span className={styles.modalStatLabel}>Author</span>
                </div>
              </div>

              <div className={styles.modalExcerpt}>
                <h3>Excerpt</h3>
                <p>{selectedPost.excerpt}...</p>
              </div>

              <div className={styles.modalFullContent}>
                <h3>Full Content</h3>
                <p>{selectedPost.content}</p>
              </div>

              <div className={styles.modalActions}>
                <button
                  className={styles.modalBtnPrimary}
                  onClick={() => handleEditPost(selectedPost)}
                >
                  Edit Post
                </button>
                <button className={styles.modalBtnSecondary}>
                  View Analytics
                </button>
                <button
                  className={styles.modalBtnDanger}
                  onClick={() => handleDeletePost(selectedPost)}
                >
                  Delete Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced New Post Modal */}
      {newOpen && (
        <div className={styles.modalOverlay} onClick={closeNewPostModal}>
          <div
            className={`${styles.createPostModal} ${
              newOpen ? styles.modalEnter : ""
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div className={styles.headerContent}>
                <SparkleIcon />
                <h3>{isEditing ? "Edit Post" : "Create New Post"}</h3>
                {!isEditing && <span className={styles.badge}>New</span>}
              </div>
              <button
                className={styles.closeButton}
                onClick={closeNewPostModal}
              >
                <CloseIcon />
              </button>
            </div>

            <div className={styles.modalTabs}>
              <button
                className={`${styles.tab} ${
                  activeTab === "content" ? styles.activeTab : ""
                }`}
                onClick={() => setActiveTab("content")}
              >
                📝 Content
              </button>
              <button
                className={`${styles.tab} ${
                  activeTab === "settings" ? styles.activeTab : ""
                }`}
                onClick={() => setActiveTab("settings")}
              >
                ⚙️ Settings
              </button>
              <button
                className={`${styles.tab} ${
                  activeTab === "preview" ? styles.activeTab : ""
                }`}
                onClick={() => setActiveTab("preview")}
              >
                👁️ Preview
              </button>
            </div>

            <form onSubmit={submitNewPost} className={styles.newPostForm}>
              <div className={styles.formContent}>
                {activeTab === "content" && (
                  <div className={styles.tabContent}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        <span>Post Title *</span>
                        <span className={styles.charCount}>
                          {newTitle.length}/120
                        </span>
                      </label>
                      <input
                        value={newTitle}
                        onChange={(e) => {
                          if (e.target.value.length <= 120)
                            setNewTitle(e.target.value);
                          setFormErrors((prev) => ({ ...prev, title: null }));
                        }}
                        className={`${styles.formInput} ${
                          formErrors.title ? styles.error : ""
                        }`}
                        placeholder="Enter a captivating title..."
                        maxLength={120}
                      />
                      {formErrors.title && (
                        <span className={styles.errorText}>
                          {formErrors.title}
                        </span>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        <span>Description *</span>
                        <span className={styles.charCount}>
                          {wordCount} words, {characterCount}/2000 chars
                        </span>
                      </label>
                      <textarea
                        value={newDescription}
                        onChange={(e) => {
                          if (e.target.value.length <= 2000)
                            setNewDescription(e.target.value);
                          setFormErrors((prev) => ({
                            ...prev,
                            description: null,
                          }));
                        }}
                        className={`${styles.formTextarea} ${
                          formErrors.description ? styles.error : ""
                        }`}
                        placeholder="Write your post content here..."
                        rows={8}
                        maxLength={2000}
                      />
                      {formErrors.description && (
                        <span className={styles.errorText}>
                          {formErrors.description}
                        </span>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Featured Image</label>
                      <div className={styles.imageOptions}>
                        <div className={styles.imageUpload} 
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onClick={triggerFileInput}
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={onImageChange}
                            className={styles.fileInput}
                          />

                          {newImagePreview ? (
                            <div className={styles.imagePreview}>
                              <img src={newImagePreview} alt="Preview" />
                              <button
                                type="button"
                                className={styles.removeImage}
                                onClick={removeImage}
                              >
                                ×
                              </button>
                            </div>
                          ) : (
                            <div className={styles.uploadPlaceholder}>
                              <UploadIcon />
                              <p>Drag & drop an image or click to browse</p>
                              <small>Supports JPG, PNG, WEBP - Max 5MB</small>
                            </div>
                          )}
                        </div>
                        
                        <div className={styles.orSeparator}>
                          <div className={styles.line}></div>
                          <span>OR</span>
                          <div className={styles.line}></div>
                        </div>
                        
                        <div className={styles.urlInputContainer}>
                          <label className={styles.formLabel}>Or enter image URL</label>
                          <input
                            type="url"
                            value={newImageUrl}
                            onChange={(e) => setNewImageUrl(e.target.value)}
                            className={styles.formInput}
                            placeholder="https://example.com/image.jpg"
                          />
                          <p className={styles.urlHelper}>Enter a direct link to an image (URL)</p>
                        </div>
                      </div>
                      {formErrors.image && (
                        <span className={styles.errorText}>
                          {formErrors.image}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "settings" && (
                  <div className={styles.tabContent}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Category</label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className={styles.formSelect}
                      >
                        <option value="Uncategorized">Uncategorized</option>
                        <option value="Technology">Technology</option>
                        <option value="Lifestyle">Lifestyle</option>
                        <option value="Business">Business</option>
                        <option value="Health">Health</option>
                        <option value="Entertainment">Entertainment</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Status</label>
                      <div className={styles.statusOptions}>
                        {["Draft", "Published", "Scheduled"].map((status) => (
                          <label key={status} className={styles.radioOption}>
                            <input
                              type="radio"
                              value={status}
                              checked={newStatus === status}
                              onChange={(e) => setNewStatus(e.target.value)}
                            />
                            <span className={styles.radioCustom}></span>
                            {status}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className={styles.featuredSettings}>
                      <h4>Additional Settings</h4>
                      <label className={styles.checkboxOption}>
                        <input type="checkbox" defaultChecked />
                        <span className={styles.checkboxCustom}></span>
                        Feature this post on homepage
                      </label>
                      <label className={styles.checkboxOption}>
                        <input type="checkbox" defaultChecked />
                        <span className={styles.checkboxCustom}></span>
                        Allow comments
                      </label>
                    </div>
                  </div>
                )}

                {activeTab === "preview" && (
                  <div className={styles.tabContent}>
                    <div className={styles.preview}>
                      <h4>Post Preview</h4>
                      <div className={styles.previewCard}>
                        {newImagePreview && (
                          <img
                            src={newImagePreview}
                            alt="Preview"
                            className={styles.previewImage}
                          />
                        )}
                        <div className={styles.previewContent}>
                          <h3>
                            {newTitle || "Your post title will appear here"}
                          </h3>
                          <p>
                            {newDescription ||
                              "Post content will be displayed here..."}
                          </p>
                          <div className={styles.previewMeta}>
                            <span className={styles.previewCategory}>
                              {newCategory}
                            </span>
                            <span
                              className={styles.previewStatus}
                              style={{ color: getStatusColor(newStatus) }}
                            >
                              {newStatus}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.formFooter}>
                <div className={styles.footerActions}>
                  <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={closeNewPostModal}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>

                  <div className={styles.actionButtons}>
                    <button
                      type="button"
                      className={styles.saveDraftBtn}
                      onClick={() => setNewStatus("Draft")}
                    >
                      Save Draft
                    </button>
                    <button
                      type="submit"
                      className={styles.publishBtn}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className={styles.loadingSpinner}>⏳</span>
                      ) : (
                        <SparkleIcon />
                      )}
                      {isSubmitting ? "Publishing..." : "Publish Post"}
                    </button>
                  </div>
                </div>

                <div className={styles.formProgress}>
                  <div
                    className={styles.progressBar}
                    style={{
                      width: `${
                        activeTab === "content"
                          ? 33
                          : activeTab === "settings"
                          ? 66
                          : 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default PostsView;
