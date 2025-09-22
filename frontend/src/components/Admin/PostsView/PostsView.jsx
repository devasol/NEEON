import React, { useState, useEffect } from "react";
import styles from "./PostsView.module.css";

// Icons (you can replace with actual icon components)
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

const PostsView = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "How to get the best deals on flights",
      status: "Published",
      category: "Travel",
      author: "Admin",
      date: "2024-03-15",
      views: 1245,
      comments: 23,
      excerpt:
        "Discover expert tips and strategies for finding the best flight deals and saving money on your travels.",
      content: "Full content about flight deals...",
      image:
        "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400",
    },
    {
      id: 2,
      title: "Top 10 Hidden Gems in Southeast Asia",
      status: "Published",
      category: "Travel",
      author: "Admin",
      date: "2024-03-10",
      views: 2897,
      comments: 45,
      excerpt:
        "Explore these incredible hidden destinations that offer authentic experiences away from tourist crowds.",
      content: "Full content about Southeast Asia...",
      image:
        "https://images.unsplash.com/photo-1528181304800-259b08848526?w=400",
    },
    {
      id: 3,
      title: "Traditional Cooking Techniques Making a Comeback",
      status: "Draft",
      category: "Food",
      author: "Admin",
      date: "2024-03-05",
      views: 0,
      comments: 0,
      excerpt:
        "Ancient cooking methods are finding new life in modern kitchens as chefs rediscover traditional techniques.",
      content: "Full content about cooking techniques...",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400",
    },
    {
      id: 4,
      title: "The Future of Sustainable Energy Solutions",
      status: "Published",
      category: "Technology",
      author: "Admin",
      date: "2024-03-01",
      views: 3456,
      comments: 67,
      excerpt:
        "Innovative approaches to sustainable energy that are shaping our future.",
      content: "Full content about sustainable energy...",
      image:
        "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400",
    },
    {
      id: 5,
      title: "Mindfulness Practices for Daily Life",
      status: "Scheduled",
      category: "Health",
      author: "Admin",
      date: "2024-03-20",
      views: 0,
      comments: 0,
      excerpt:
        "Simple mindfulness techniques to incorporate into your daily routine for better mental health.",
      content: "Full content about mindfulness...",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    },
  ]);

  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  // Get unique categories
  const categories = ["All", ...new Set(posts.map((post) => post.category))];
  const statuses = ["All", "Published", "Draft", "Scheduled"];

  // Filter and sort posts
  const filteredPosts = posts
    .filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (statusFilter === "All" || post.status === statusFilter) &&
        (categoryFilter === "All" || post.category === categoryFilter)
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
    alert(`Editing post: ${post.title}`);
    // Add edit logic here
  };

  const handleDeletePost = (post) => {
    if (window.confirm(`Are you sure you want to delete "${post.title}"?`)) {
      setPosts(posts.filter((p) => p.id !== post.id));
      alert("Post deleted successfully!");
    }
  };

  const handleNewPost = () => {
    alert("Creating new post...");
    // Add new post logic here
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
    document.body.style.overflow = "unset";
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

  return (
    <section className={styles.postsView}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h2>All Posts</h2>
          <p>Manage and organize your blog posts efficiently</p>
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
            placeholder="Search posts..."
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
                        src={post.image}
                        alt={post.title}
                        className={styles.postImage}
                      />
                      <div className={styles.postDetails}>
                        <div className={styles.postTitle}>{post.title}</div>
                        <div className={styles.postExcerpt}>{post.excerpt}</div>
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
                        <EyeIcon /> {post.views}
                      </span>
                      <span className={styles.metric}>💬 {post.comments}</span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.date}>
                      <CalendarIcon />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.actionBtn}
                        onClick={() => handleViewPost(post)}
                        title="View Post"
                      >
                        <ViewIcon />
                      </button>
                      <button
                        className={styles.actionBtn}
                        onClick={() => handleEditPost(post)}
                        title="Edit Post"
                      >
                        <EditIcon />
                      </button>
                      <button
                        className={styles.actionBtn}
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
              <p>No posts found matching your criteria</p>
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
                src={selectedPost.image}
                alt={selectedPost.title}
                className={styles.modalImage}
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
                    {selectedPost.views}
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
                <p>{selectedPost.excerpt}</p>
              </div>

              <div className={styles.modalActions}>
                <button className={styles.modalBtnPrimary}>Edit Post</button>
                <button className={styles.modalBtnSecondary}>
                  View Analytics
                </button>
                <button className={styles.modalBtnDanger}>Delete Post</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PostsView;
