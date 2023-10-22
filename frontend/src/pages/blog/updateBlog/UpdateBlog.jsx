import { useState, useEffect } from "react";
import { getBlogById } from "../../../api/internal";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import TextInput from "../../../components/textInput/TextInput";
import styles from "./UpdateBlog.module.css";
import { updateBlog } from "../../../api/internal";

function UpdateBlog() {
    const params = useParams();
    const blogId = params.id;
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [photo, setPhoto] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        async function getBlogDetails() {
            const response = await getBlogById(blogId);
            if (response.status === 200) {
                setTitle(response.data.Blog.title);
                setContent(response.data.Blog.content);
                setPhoto(response.data.Blog.photo);
            }
        }
        getBlogDetails()
    }, []);
    const getPhoto = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPhoto(reader.result)
        }
    };
    const author = useSelector(state => state.user._id)
    const updateHandler = async () => {
        let data
        if (photo.includes('http')) {
            data = {
                title,
                author,
                content,
                blogId
            };
        } else {
            data = {
                title,
                author,
                content,
                photo,
                blogId
            };
        }

        const response = await updateBlog(data);
        if (response.status === 200) {
            navigate('/blogs')
        }
    }
    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>Update a Blog</div>
            <TextInput
                type="text"
                name="title"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: "60%" }}
            />
            <textarea
                className={styles.content}
                placeholder="Your content goes here"
                maxLength={400}
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <div className={styles.photoPrompt}>
                <p>Choose a photo</p>
                <input
                    type="file"
                    name="photo"
                    id="photo"
                    accept="image/jpg, image/jpeg, image/png"
                    onChange={getPhoto}
                />
                <img src={photo} width={100} height={100} />
            </div>
            <button className={styles.update} onClick={updateHandler}
            >Update</button>
        </div>
    )
}

export default UpdateBlog;
