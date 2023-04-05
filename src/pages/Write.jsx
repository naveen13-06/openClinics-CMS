import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { json, useLocation, useNavigate } from "react-router-dom";
import api from "../api/api"
import Server from "../Utils/config";
const Write = () => {
  // console.log(useLocation());
  const state = useLocation().state;
  const [value, setValue] = useState(state?.Desc || "");
  const [title, setTitle] = useState(state?.Title || "");
  const [head, setHead] = useState(state?.Head || "");
  const [cn, setCn] = useState(state?.Cn || "");
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState(state?.cat || "");
  const [subcat, setSubcat] = useState(state?.subcat || "");
 
  const med=["abdomen","cns","cvs","renal","rs"];
  const og=["obstetric","gynaecology"];
  const pediatrics=["abdomen","cns","cvs","anthropometry","RS","Newborn","HeadtoFoot"];
  const surgery=["breast","Varicose_vein","swelling","ulcer","abdomen","hernia","peripheral_arterial_disease"];
  const [items,setItems]=useState(med);
  useEffect(()=>{ 
    if(cat==="Medicine") setItems(med);
    else if(cat==="Og") setItems(og);
    else if(cat==="Pediatrics") setItems(pediatrics);
    else if(cat==="Surgery") setItems(surgery);
  },[cat])
  useEffect(()=>{
    setSubcat(items[0]);
  },[items])
  const navigate = useNavigate()

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const cards={
      Cn:cn,
      Head:head,
      Title:title,
      Desc:value
    }
    try {
      
      const res=await api.listDocuments(Server.databaseID,cat,subcat);
      const prevCards=res.documents[0].Cards;
      if(prevCards[cn-1]!=null){
        if(!window.confirm(`Are you sure you want to override the data present in the card number ${cn}`)){
          return;
        }
      }
      prevCards[cn-1]=JSON.stringify(cards);
      const data={
        Cards:prevCards
      }
      console.log(data);
      await api.updateDocument(Server.databaseID,cat,subcat,data)
      navigate("/")
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="add">
      <div className="content">
        <input
          type="text"
          placeholder="Head"
          value={head}
          onChange={(e) => setHead(e.target.value)}
        />
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="number"
          placeholder="Card Number"
          value={cn}
          onChange={(e) => setCn(e.target.value)}
        />
        <div className="editorContainer">
          <ReactQuill
            className="editor"
            theme="snow"
            value={value}
            onChange={setValue}
          />
        </div>
      </div>
      <div className="menu">
        <div className="item">
          <h1>Publish</h1>
          <div className="cat">
            <label>

              Subject

              <select value={cat} onChange={(e) => {setCat(e.target.value)}}>

                <option value="Medicine">Medicine</option>

                <option value="Og">OG</option>

                <option value="Pediatrics">Pediatrics</option>

                <option value="Surgery">Surgery</option>

              </select>
              </label>
              <label>
              Types of Examination
              <select value={subcat} onChange={(e) => setSubcat(e.target.value)}>
                {items.map((item,index) => (
                  <option key={index} value={item}>{item}</option>
                ))}
              </select>
              </label>
          </div>
          <div className="buttons">
            {/* <button>Save as a draft</button> */}
            <button onClick={handleClick}>Publish</button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Write;
