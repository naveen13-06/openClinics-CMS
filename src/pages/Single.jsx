import React, { useEffect, useState } from "react";
import Edit from "../img/edit.png";
import Delete from "../img/delete.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import DOMPurify from "dompurify";
import api from "../api/api";
import Server from "../Utils/config";
import LoadingSpinner from "../components/LoadingSpinner";

const Single = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const postId = location.pathname.split("/")[4];
  const type1 = location.pathname.split("/")[3];
  const type=type1.replace(/%20/g," ");
  const cat = location.pathname.split("/")[2];
  const [post, setPost] = useState({cat:cat,subcat:type});
  const[loading,setLoading]=useState(true);

  
  const { currentUser } = useContext(AuthContext);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log(cat,type,postId);
        const res = await api.getCard(Server.databaseID,Server.collectionID,cat,type,postId)
        // console.log(res);
        setPost((prev)=>{return {...prev,...JSON.parse(res)}});
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
        post.files.map(async (a)=>{
          await api.deleteFile(Server.bucketID,a);
        })
        await api.deleteCard(Server.databaseID,Server.collectionID,cat,type,postId);
        setLoading(false);
        navigate("/")
      } catch (err) {
        console.log(err);
      }
  }

  // const getText = (html) =>{
  //   const doc = new DOMParser().parseFromString(html, "text/html")
  //   return doc.body.textContent
  // }

  return (
    <div className="single">
      <div className="content">
        <div className="user">
          
          <div className="info">
            <span>{post.username}</span>
            <p>Posted {moment(post.date).fromNow()}</p>
          </div>
            <div className="edit">
              <Link to={`/write?edit=2`} state={post}>
                <img src={Edit} alt="" />
              </Link>
              <img onClick={()=>{ if (window.confirm('Are you sure you wish to delete this item?'))handleDelete() }} src={Delete} alt="" />
            </div>
         
        </div>
        {loading?<LoadingSpinner />:
        <><h1>{post.title}</h1>
        <p
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(post.desc,{ ADD_TAGS: ["iframe"], ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'] }),
          }}
        ></p></> 
        }
      </div>
      </div>
  );
};

export default Single;
