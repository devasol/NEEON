import React, { useEffect, useMemo, useState } from "react";
import styles from "./PostActions.module.css";
import useAuth from "../../../hooks/useAuth";
import api from "../../../utils/api";
import FloatingToast from "../../Ui/FloatingToast.jsx";
import CommentModal from "../../Comments/ModernCommentModal";

function PostActions({
	postId,
	postTitle,
	postUrl,
	initialLikes = 0,
	initialComments = 0,
}) {
	const { token } = useAuth();
	const [liked, setLiked] = useState(false);
	const [likeCount, setLikeCount] = useState(initialLikes);
	const [commentCount, setCommentCount] = useState(initialComments);
	const [toastMessage, setToastMessage] = useState("");
	const [toastType, setToastType] = useState("info"); 
	const [showCommentBox, setShowCommentBox] = useState(false);
	const [commentText, setCommentText] = useState("");
	const [comments, setComments] = useState([]);
	const [showComments, setShowComments] = useState(false);
	const [commentModalOpen, setCommentModalOpen] = useState(false);

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
			setToastMessage("Please sign in first");
			setToastType("error");
			return;
		}
		fn();
	};

	const handleLike = requireAuthOr(async () => {
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikeCount((c) => (nextLiked ? c + 1 : Math.max(0, c - 1)));
    try {
      const endpoint = `/api/v1/blogs/${postId}/like`;
      const res = await api.post(endpoint, {}, token);
      if (typeof res?.data?.likes === "number") {
        setLikeCount(res.data.likes);
      }
    } catch {
      
      setLiked(!nextLiked);
      setLikeCount((c) => (nextLiked ? Math.max(0, c - 1) : c + 1));
      setToastMessage("Couldn't update like");
      setToastType("error");
    }
	});

	const handleShare = async () => {
    try {
			if (navigator.share) {
				await navigator.share(shareData);
				setToastMessage("Shared!");
				setToastType("success");
			} else {
        try {
          await navigator.clipboard.writeText(shareData.url);
        } catch {
          
          setToastMessage("Copy this link: " + shareData.url);
          setToastType("info");
          return;
        }
				setToastMessage("Link copied");
				setToastType("success");
			}
		} catch {
			setToastMessage("Couldn't share");
			setToastType("error");
		}
	};

	const handleComment = () => {
		if (!token) {
			setToastMessage("Please sign in first");
			setToastType("error");
			return;
		}
		
		
		setCommentModalOpen(true);
		setShowCommentBox(false);
	};

	const fetchComments = async () => {
		try {
			const res = await api.get(`/api/v1/blogs/${postId}`);
			const blog = res?.data?.blog?.blog;
			if (blog && blog.commentsList) {
				setComments(blog.commentsList);
			}
		} catch (error) {
			console.error("Failed to fetch comments:", error);
		}
	};

	const submitComment = requireAuthOr(async () => {
		const text = commentText.trim();
		if (!text) {
			setToastMessage("Write something first");
			setToastType("error");
			return;
		}
		try {
			await api.post(`/api/v1/blogs/${postId}/comment`, { text }, token);
			setCommentText("");
			setCommentCount((c) => c + 1);
			setToastMessage("Comment added");
			setToastType("success");
			fetchComments(); 
		} catch {
			setToastMessage("Couldn't comment");
			setToastType("error");
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
					
					
					if (blog.likedBy && token) {
						try {
							const userRes = await api.get('/api/v1/users/me', !!token);
							const userId = userRes?.data?.data?.user?._id;
							if (userId && blog.likedBy.includes(userId)) {
								setLiked(true);
							}
						} catch (error) {
							console.error("Failed to check like status:", error);
						}
					}
				}
			} catch {
				
			}
		})();
		return () => { ignore = true };
	}, [postId, token]);

	return (
		<div className={styles.postActionsContainer}>
			<div className={styles.actions}>
				<button
					className={`${styles.actionBtn} ${liked ? styles.liked : ""}`}
					onClick={handleLike}
					aria-pressed={liked}
					title={token ? (liked ? "Unlike" : "Like") : "Sign in to like"}
				>
					<i className="fa-solid fa-heart"></i>
					<span className={styles.label}>Like</span>
					<span className={styles.count}>{likeCount}</span>
				</button>
				<button className={styles.actionBtn} onClick={handleShare} title="Share">
					<i className="fa-solid fa-share-nodes"></i>
					<span className={styles.label}>Share</span>
				</button>
				<button 
					className={`${styles.actionBtn} ${showComments ? styles.active : ""}`} 
					onClick={handleComment} 
					title={token ? "Comment" : "Sign in to comment"}
				>
					<i className="fa-solid fa-comment-dots"></i>
					<span className={styles.label}>Comment</span>
					<span className={styles.count}>{commentCount}</span>
				</button>
				<FloatingToast message={toastMessage} type={toastType} onClose={() => setToastMessage("")} />
			</div>
			
			{}
			<CommentModal 
				postId={postId} 
				postTitle={postTitle} 
				isOpen={commentModalOpen} 
				onClose={() => setCommentModalOpen(false)} 
			/>
		</div>
	);
}

export default PostActions;


