import { useState } from "react";
import { submitBlog } from "../../api/internal";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./SubmitBlog.module.css";
import TextInput from "../../components/textInput/TextInput";


function SubmitBlog() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [photo, setPhoto] = useState("");
    const navigate = useNavigate();
    const author = useSelector((state) => state.user._id);
    const getPhoto = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPhoto(reader.result)
        }
    };
    const submitHandler = async () => {
        const data = {
            title,
            author,
            content,
            photo
        };
        const response = await submitBlog(data);
        if (response.status === 201) {
            navigate('/blogs')
        }
    }
    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>Create a Blog</div>
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
                {photo !== '' ? <img src={photo} width={100} height={100} /> : ''}
            </div>
            <button className={styles.submit} onClick={submitHandler}
                disabled={title === '' || content === '' || photo === ''}
            >Submit</button>
        </div>
    );
}

export default SubmitBlog;
