import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
    getBlogById,
    deleteBlog,
    postComment,
    getCommentById,
} from "../../api/internal";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import styles from "./BlogDetails.module.css";
import CommentList from "../../components/commentList/CommentList";
function BlogDetails() {
    const [blog, setBlog] = useState([]);
    const [comments, setComments] = useState([]);
    const [ownsBlog, setOwnsBlog] = useState(false);
    const [newComment, setNewComment] = useState("");
    const navigate = useNavigate();
    const params = useParams();
    const blogId = params.id;
    const userId = useSelector((state) => state.user._id);
    const [reload, setReload] = useState(false);
    useEffect(() => {
        async function getBlogDetails() {
            const commentResponse = await getCommentById(blogId)
            if (commentResponse.status === 200) {
                setComments(commentResponse.data.data)
            }
            const blogResponse = await getBlogById(blogId);
            if (blogResponse.status === 200) {
                //set ownership
                setOwnsBlog(userId === blogResponse.data.Blog.authorId);
                setBlog(blogResponse.data.Blog)
            }
        }
        getBlogDetails();
    }, [reload])
    if (blog.length === 0) {
        return <Loader text="Blog Details" />
    }
    const postCommentHandler = async () => {
        const data = {
            author: userId,
            blog: blogId,
            content: newComment
        }

        const response = await postComment(data)
        if (response.status === 201) {
            setNewComment("");
            setReload(!reload)

        }
    }
    const deleteBlogHandler = async () => {
        const response = await deleteBlog(blogId);
        if (response.status === 200) {
            navigate("/blogs");
        }
    }

    return (
        <div className={styles.detailsWrapper}>
            <div className={styles.left}>
                <h1 className={styles.title}>{blog.title}</h1>
                <div className={styles.meta}>
                    <p>@{blog.authorUsername + " on " + new Date(blog.createdAt).toDateString()}</p>
                </div>
                <div className={styles.photo}>
                    <img src={blog.photo} width={200} height={200} />
                </div>
                <p className={styles.content}>{blog.content}</p>
                {ownsBlog && (
                    <div className={styles.controls}>
                        <button className={styles.editButton} onClick={() => { navigate(`/blog-update/${blog.id}`) }}>Edit</button>
                        <button className={styles.deleteButton} onClick={deleteBlogHandler}>Delete</button>
                    </div>
                )}
            </div>
            <div className={styles.right}>
                <div className={styles.commentWrapper}>
                    <CommentList comments={comments} />
                    <div className={styles.postComment}>
                        <input
                            className={styles.input}
                            placeholder="Comment goes here"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button className={styles.postCommentButton} onClick={postCommentHandler}>Post</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BlogDetails;
