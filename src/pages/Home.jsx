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
        console.log(cat,type);
        const res =path!='questions'? await api.listDocuments(Server.databaseID,Server.collectionID,cat,type)
        :await api.listQuestions(Server.databaseID,'64413ea96acba3fd2ee7',cat,type);
        path=='questions'&& res.documents.sort((a, b) => {
          return a.marks-b.marks;
      });
        path!='questions'?res.documents[0].cards.map((card)=>{
          if(card!=null) setPosts((prev)=>{return [...prev,JSON.parse(card)]});
        }) :
        res.documents.map((doc)=>{
          if(doc!=null) setPosts((prev)=>{return [...prev,doc]});
        });
        
   
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
        {posts.map((post,index) => (
          <div className="post" key={path!='questions'?post.cn:post.$id}>
            <div className="content">
              <Link className={`${path==='questions'&&post.answerText.length<=6?"link":"link1"}`} to={path!='questions'?`/write?edit=2`:`/questions/write?edit=2`} state={path!='questions'?{...post,cat:cat,subcat:type}:post}>
              {path!='questions'&&<span>{index+1}</span>}
                <span>{path!='questions'?post.head:post.questionText}</span>
                <span>{path!='questions' ? post.title:post.marks+"m"}</span>
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
