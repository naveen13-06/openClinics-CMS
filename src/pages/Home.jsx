import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import api from "../api/api";
import Server from "../Utils/config";
import LoadingSpinner from "../components/LoadingSpinner";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location=useLocation();
  const path=location.pathname.split("/")[1];
 const [params]=useSearchParams();
  const cat = path!='questions'?params.get("domain"):params.get("subject");
  const type1= path!='questions'? params.get("type"):params.get("lesson");
  var type=type1;
  if(type!=null) type=type1.replace(/%20/g," ");
  if(localStorage.getItem("user")==='null') window.location.href="/login";
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res =path!='questions'? await api.listDocuments(Server.databaseID,Server.collectionID,cat,type)
        :await api.listQuestions(Server.databaseID,'64413ea96acba3fd2ee7',cat,type);
        path!='questions'?res.documents[0].cards.map((card)=>{
          if(card!=null) setPosts((prev)=>{return [...prev,JSON.parse(card)]});
        }) :
        res.documents.map((doc)=>{
          if(doc!=null) setPosts((prev)=>{return [...prev,doc]});
        });
        console.log(res);
        // res.documents.map((types) =>{
        //   if(types.cards.length!=0){
        //     types.cards.map((cards) =>{
        //       console.log(JSON.parse(cards));
        //       setPosts((prev)=>{return [...prev,JSON.parse(cards)]});
        //     })
        //   }
        // })
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };
    setPosts([]);
    
    fetchData();
  }, [cat,type]);
 
  const getText = (html) =>{
    const doc = new DOMParser().parseFromString(html, "text/html")
    return doc.body.textContent
  }

  return (
    <>
    {loading ? <LoadingSpinner/> :
    <div className="home">
      <div className="posts">
        {posts.map((post) => (
          <div className="post" key={path!='questions'?post.cn:post.$id}>
            <div className="content">
              <Link className="link" to={path!='questions'?`/post/${cat}/${type}/${post.cn}`:`/questions/${cat}/${type}/${post.$id}`}>
              {path!='questions' && <span>Card Number {post.cn}</span>}
                <span>{path!='questions'?post.title:post.questionText.slice(0,30)+'...'}</span>
                <span>{path!='questions'?post.head:getText(post.answerText).slice(0,20)+'...'}</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
    }
    </>
  );
};

export default Home;
