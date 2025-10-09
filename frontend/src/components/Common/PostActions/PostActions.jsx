import React, { useEffect, useMemo, useState } from "react";
import styles from "./PostActions.module.css";
import useAuth from "../../../hooks/useAuth";
import api from "../../../utils/api";

function PostActions({
	postId,
	postTitle,
	postUrl,
	initialLikes = 0,
	initialComments = 0,
	onComment,
}) {
	const { token } = useAuth();
	const [liked, setLiked] = useState(false);
	const [likeCount, setLikeCount] = useState(initialLikes);
	const [commentCount, setCommentCount] = useState(initialComments);
	const [message, setMessage] = useState("");
	const [showCommentBox, setShowCommentBox] = useState(false);
	const [commentText, setCommentText] = useState("");

	useEffect(() => {
		if (!message) return;
		const t = setTimeout(() => setMessage(""), 2200);
		return () => clearTimeout(t);
	}, [message]);

	const shareData = useMemo(() => {
		return {
			title: postTitle || "Check this out",
			text: postTitle || "",
			url:
				postUrl || (typeof window !== "undefined" ? window.location.href : ""),
		};
	}, [postTitle, postUrl]);

	const requireAuthOr = (fn) => () => {
		if (!token) {
			setMessage("Please sign in first");
			return;
		}
		fn();
	};

	const handleLike = requireAuthOr(async () => {
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikeCount((c) => (nextLiked ? c + 1 : Math.max(0, c - 1)));
    try {
      const endpoint = nextLiked ? `/api/v1/blogs/${postId}/like` : `/api/v1/blogs/${postId}/unlike`;
      const res = await api.post(endpoint, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (typeof res?.data?.likes === "number") {
        setLikeCount(res.data.likes);
      }
    } catch (e) {
      // revert on failure
      setLiked(!nextLiked);
      setLikeCount((c) => (nextLiked ? Math.max(0, c - 1) : c + 1));
      setMessage("Couldn't update like");
    }
	});

	const handleShare = requireAuthOr(async () => {
    try {
			if (navigator.share) {
				await navigator.share(shareData);
				setMessage("Shared!");
			} else {
        try {
          await navigator.clipboard.writeText(shareData.url);
        } catch {
          // some browsers require HTTPS/user gesture; show the URL fallback
          setMessage("Copy this link: " + shareData.url);
          return;
        }
				setMessage("Link copied");
			}
		} catch {
			setMessage("Couldn't share");
		}
	});

	const handleComment = requireAuthOr(() => {
		const url = `/comments/${postId}`;
		window.open(url, "_blank", "noopener,noreferrer");
	});

	const submitComment = requireAuthOr(async () => {
		const text = commentText.trim();
		if (!text) return setMessage("Write something first");
		try {
			await api.post(`/api/v1/blogs/${postId}/comments`, { text }, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setCommentText("");
			setShowCommentBox(false);
			setCommentCount((c) => c + 1);
			setMessage("Comment added");
		} catch {
			setMessage("Couldn't comment");
		}
	});

	useEffect(() => {
		let ignore = false;
		(async () => {
			try {
				const res = await api.get(`/api/v1/blogs/${postId}`);
				const blog = res?.data?.blog?.blog;
				if (!ignore && blog) {
					if (typeof blog.likes === "number") setLikeCount(blog.likes);
					if (typeof blog.comments === "number") setCommentCount(blog.comments);
				}
			} catch {
				// ignore load failures
			}
		})();
		return () => { ignore = true };
	}, [postId]);

	return (
		<div className={styles.actions}>
			{/* Removed header-like auth indicator from post actions per request */}
			<button
				className={`${styles.actionBtn} ${liked ? styles.liked : ""}`}
				onClick={handleLike}
				aria-pressed={liked}
				title={liked ? "Unlike" : "Like"}
			>
				<i className="fa-solid fa-heart"></i>
				<span className={styles.label}>Like</span>
				<span className={styles.count}>{likeCount}</span>
			</button>
			<button className={styles.actionBtn} onClick={handleShare} title="Share">
				<i className="fa-solid fa-share-nodes"></i>
				<span className={styles.label}>Share</span>
			</button>
			<button className={styles.actionBtn} onClick={handleComment} title="Comment">
				<i className="fa-solid fa-comment-dots"></i>
				<span className={styles.label}>Comment</span>
				<span className={styles.count}>{commentCount}</span>
			</button>
			{message && <div className={styles.message}>{message}</div>}
			{showCommentBox && (
				<div className={styles.commentBox}>
					<textarea
						value={commentText}
						onChange={(e) => setCommentText(e.target.value)}
						className={styles.commentInput}
						placeholder="Write your comment..."
						rows={3}
					></textarea>
					<div className={styles.commentActions}>
						<button className={styles.cancelComment} onClick={() => setShowCommentBox(false)}>Cancel</button>
						<button className={styles.submitComment} onClick={submitComment}>Post Comment</button>
					</div>
				</div>
			)}
		</div>
	);
}

export default PostActions;


