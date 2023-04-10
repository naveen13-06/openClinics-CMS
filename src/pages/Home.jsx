import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/api";
import Server from "../Utils/config";

const Home = () => {
  const [posts, setPosts] = useState([]);
 const [params]=useSearchParams();
  const cat = params.get("domain");
  const type=params.get("type");
  if(localStorage.getItem("user")==='null') window.location.href="/login";
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res =await api.listDocuments(Server.databaseID,Server.collectionID,cat,type);
        console.log(res);
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
    };
    setPosts([]);
    
    fetchData();
  }, [cat,type]);
 
  const getText = (html) =>{
    const doc = new DOMParser().parseFromString(html, "text/html")
    return doc.body.textContent
  }

  return (
    <div className="home">
      <div className="posts">
        {posts.map((post) => (
          <div className="post" key={post.cn}>
            <div className="img">
              
            </div>
            <div className="content">
              <h3>Card Number {post.cn}</h3>
              <Link className="link" to={`/post/${cat}/${type}/${post.cn}`}>
                <h1>{post.title}</h1>
              </Link>
              <p>{getText(post.desc)}</p>
              <Link className="link" to={`/post/${cat}/${type}/${post.cn}`}>
                  <button>Read More</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
