import React, { useEffect, useState } from "react";
import api from "../api/api";
import Server from "../Utils/config";
import { Link, useLocation } from "react-router-dom";
const Menu = ({props}) => {
  const [posts, setPosts] = useState([]);
  const cat = props[0];
  const type=props[1];
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(cat);
        const res = await api.listDocuments(Server.databaseID,cat,type);
        res.documents[0].Cards.map((card)=>{
          if(card!=null) setPosts((prev)=>{return [...prev,JSON.parse(card)]});
        })
      } catch (err) {
        console.log(err);
      }
    };
    setPosts([]);
    fetchData();
  }, [cat]);

  return (
    <div className="menu">
      <h1>Other posts you may like</h1>
      {posts.map((post) => (
        <div className="post" key={post.Cn}>
          <h2>{post.Title}</h2>
          <Link className="link" to={`/post/${cat}/${type}/${post.Cn}`}>
                  <button>Read More</button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Menu;
