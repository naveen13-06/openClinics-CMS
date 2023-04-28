import React, { useEffect, useState } from "react";
import Edit from "../img/edit.png";
import Delete from "../img/delete.png";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import DOMPurify from "dompurify";
import api from "../api/api";
import Server from "../Utils/config";
import LoadingSpinner from "../components/LoadingSpinner";

const QueDisplay = () => {
  const navigate = useNavigate();
  const params=useParams();
  
  const postId = params.id;
  const type=params.lesson.replace(/%20/g," ");
  const cat =params.subject
  const [post, setPost] = useState({});
  const[loading,setLoading]=useState(true);

  const { currentUser } = useContext(AuthContext);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log(cat,type,postId);
        const res = await api.getQuestion(Server.databaseID,'64413ea96acba3fd2ee7',postId)
        // console.log(res);
        setPost(res);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [postId]);

  const handleDelete = async ()=>{
    setLoading(true);
      try {
        post.files?.map(async (a)=>{
          await api.deleteFile(Server.bucketID,a);
        })
        await api.deleteQuestion(Server.databaseID,'64413ea96acba3fd2ee7',postId);
        setLoading(false);
        navigate("/")
      } catch (err) {
        console.log(err);
      }
  }

  const getText = (html) =>{
    const doc = new DOMParser().parseFromString(html, "text/html")
    return doc.body.textContent
  }

  return (
    <div className="single">
      <div className="content">
        <div className="user">
          <div className="info">
            <span>{post.username}</span>
            <p>Posted {post.$createdAt}</p>
          </div>
          {/* {console.log(getText(post.answerText))} */}
            <div className="edit">
              <Link to={`/questions/write?edit=2`} state={post}>
                <img src={Edit} alt="" />
              </Link>
              <img onClick={()=>{ if (window.confirm('Are you sure you wish to delete this item?'))handleDelete() }} src={Delete} alt="" />
            </div>
        </div>
        {loading?<LoadingSpinner />:
        <><h1>{post.questionText}</h1>
        <p
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize((post.answerText.replace(/"|'/g,'')),{ ADD_TAGS: ["iframe"], ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'] }),
          }}
        ></p> </>
        }
      </div>
      </div>
  );
};

export default QueDisplay;