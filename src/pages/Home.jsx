import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/api";
import Server from "../Utils/config";
import LoadingSpinner from "../components/LoadingSpinner";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
 const [params]=useSearchParams();
  const cat = params.get("domain");
  const type=params.get("type");
  if(localStorage.getItem("user")==='null') window.location.href="/login";
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res =await api.listDocuments(Server.databaseID,Server.collectionID,cat,type);
        res.documents[0].cards.map((card)=>{
          if(card!=null) setPosts((prev)=>{return [...prev,JSON.parse(card)]});
        })        
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
          <div className="post" key={post.cn}>
            <div className="content">
              <Link className="link" to={`/post/${cat}/${type}/${post.cn}`}>
              <span>Card Number {post.cn}</span>
                <span>{post.title}</span>
                <span>{post.head}</span>
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
