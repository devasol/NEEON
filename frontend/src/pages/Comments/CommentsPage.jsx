import React, { useEffect, useMemo, useState } from "react";
import styles from "./CommentsPage.module.css";
import api from "../../utils/api";
import useAuth from "../../hooks/useAuth";

function CommentsPage() {
	const { token, logout } = useAuth();
	const postId = useMemo(() => {
		if (typeof window === "undefined") return "";
		const parts = window.location.pathname.split("/");
    return parts[2] || ""; // /comments/:id
	}, []);

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [blog, setBlog] = useState(null);
	const [commentText, setCommentText] = useState("");
	const [posting, setPosting] = useState(false);
	const [message, setMessage] = useState("");

	useEffect(() => {
		let ignore = false;
		(async () => {
			setLoading(true);
			setError("");
			try {
				const res = await api.get(`/api/v1/blogs/${postId}`);
				if (!ignore) setBlog(res?.data?.blog?.blog || null);
			} catch {
				if (!ignore) setError("Failed to load post");
			} finally {
				if (!ignore) setLoading(false);
			}
		})();
		return () => { ignore = true };
	}, [postId]);

	useEffect(() => {
		if (!message) return;
		const t = setTimeout(() => setMessage(""), 2200);
		return () => clearTimeout(t);
	}, [message]);

	const like = async () => {
		if (!token) return setMessage("Please sign in first");
		if (!blog) return;
		try {
			const res = await api.post(`/api/v1/blogs/${postId}/like`, {}, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setBlog((b) => ({ ...b, likes: res?.data?.likes ?? (b?.likes || 0) }));
		} catch {
			setMessage("Couldn't like");
		}
	};

	const submitComment = async () => {
		if (!token) return setMessage("Please sign in first");
		const text = commentText.trim();
		if (!text) return setMessage("Write something first");
		setPosting(true);
		try {
			await api.post(`/api/v1/blogs/${postId}/comments`, { text }, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setCommentText("");
			// reload minimal fields
			const res = await api.get(`/api/v1/blogs/${postId}`);
			setBlog(res?.data?.blog?.blog || null);
			setMessage("Comment added");
		} catch {
			setMessage("Couldn't comment");
		} finally {
			setPosting(false);
		}
	};

	if (loading) return <div className={styles.page}>Loading…</div>;
	if (error) return <div className={styles.page}>{error}</div>;
	if (!blog) return <div className={styles.page}>Post not found</div>;

	return (
		<div className={styles.page}>
			<div className={styles.card}>
				<div className={styles.headerRow}>
					<h2 className={styles.title}>{blog.newsTitle || "Post"}</h2>
					{!token ? (
						<button
							className={`${styles.authBtn} ${styles.loginBtn}`}
							onClick={() => (window.location.href = "/")}
						>
							<i className="fa-solid fa-right-to-bracket"></i>
							<span>Login</span>
						</button>
					) : (
                <button
                  className={`${styles.authBtn} ${styles.logoutBtn}`}
                  onClick={() => {
                    logout();
                  }}
                >
							<i className="fa-solid fa-right-from-bracket"></i>
							<span>Logout</span>
						</button>
					)}
				</div>
				<div className={styles.metaRow}>
					<div className={styles.stat}><i className="fa-solid fa-heart"></i><span>{blog.likes || 0}</span></div>
					<div className={styles.stat}><i className="fa-solid fa-comment-dots"></i><span>{blog.comments || 0}</span></div>
					<button className={styles.likeBtn} onClick={like}>Like</button>
				</div>
				<div className={styles.separator}></div>
				<div className={styles.commentEditor}>
					<textarea
						className={styles.textarea}
						rows={4}
						placeholder={token ? "Write your comment…" : "Sign in to comment"}
						value={commentText}
						onChange={(e) => setCommentText(e.target.value)}
						disabled={!token || posting}
					></textarea>
					<div className={styles.actionRow}>
						<button className={styles.postBtn} disabled={!token || posting} onClick={submitComment}>Post Comment</button>
					</div>
					{message && <div className={styles.toast}>{message}</div>}
				</div>
				<div className={styles.commentsList}>
					{Array.isArray(blog.commentsList) && blog.commentsList.length > 0 ? (
						blog.commentsList.slice().reverse().map((c, idx) => (
							<div key={idx} className={styles.commentItem}>
								<div className={styles.commentText}>{c.text}</div>
								<div className={styles.commentTime}>{new Date(c.createdAt).toLocaleString()}</div>
							</div>
						))
					) : (
						<div className={styles.empty}>No comments yet. Be the first!</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default CommentsPage;


