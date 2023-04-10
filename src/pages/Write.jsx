import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/api"
import Server from "../Utils/config";
import { useMemo, useRef } from "react";


// const imageHandler = (a) => {
//   const input = document.createElement("input");
//   input.setAttribute("type", "file");
//   input.setAttribute("accept", "image/*");
//   input.click();

//   input.onchange = () => {
//       const file = input.files[0];
//       if (/^image\//.test(file.type)) {
//           saveToServer(file);
//       } else {
//           console.warn("You could only upload images.");
//       }
//   };
// };
    
const Write = () => {
  // console.log(useLocation());
  // const editorRef = useRef(null);
  //   const modules = useMemo(() => ({
  //       toolbar: {
  //           container: [
  //             [{ 'header': [1, 2, 3, 4, 5, 6, false] }],  
  //             ['bold', 'italic', 'underline'],  
  //             [{ 'list': 'ordered' }, { 'list': 'bullet' }],  
  //             [{ 'align': [] }],  
  //             ['link', 'image'],  
  //             ['clean'],  
  //             [{ 'color': [] }]  
  //           ],
  //           handlers: {
  //               image: imageHandler,
  //           },
  //       },
  //   }));
  const state = useLocation().state;
  const [value, setValue] = useState(state?.desc || "");
  const [title, setTitle] = useState(state?.title || "");
  const [head, setHead] = useState(state?.head || "");
  const [cn, setCn] = useState(state?.cn || "");
  const [cat, setCat] = useState(state?.cat || "Medicine");
  const [subcat, setSubcat] = useState(state?.subcat || "abdomen");
// console.log(state?.subcat);
  const med=["abdomen","cns","cvs","renal","rs"];
  const og=["obstetric","gynaecology"];
  const pediatrics=["abdomen","cns","cvs","anthropometry","rs","newborn","headtofoot"];
  const surgery=["breast","varicose_vein","swelling","ulcer","abdomen","hernia","peripheral_arterial_disease"];
  const [items,setItems]=useState(med);
  useEffect(()=>{
    if(cat==="medicine") setItems(med);
    else if(cat==="og") setItems(og);
    else if(cat==="pediatrics") setItems(pediatrics);
    else if(cat==="surgery") setItems(surgery);
  },[cat])
  useEffect(()=>{
    if(!state?.subcat)setSubcat(items[0]);
  },[items])
  const navigate = useNavigate()

  // const upload = async () => {
  //   try {
  //     const formData = new FormData();
  //     formData.append("file", file);
  //     const res = await axios.post("/upload", formData);
  //     return res.data;
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
 
  const handleClick = async (e) => {
    e.preventDefault();
    const cards={
      cn:cn,
      head:head,
      title:title,
      desc:value
    }
    try {
      // const res=await api.listDocuments(Server.databaseID,Server.collectionID,cat,subcat);
      // const prevCards=res.documents[0].cards;
      // // if(prevCards[cn-1]!=null){
      // //   if(!window.confirm(`Are you sure you want to override the data present in the card number ${cn}`)){
      // //     return;
      // //   }
      // // }
      // prevCards[cn-1]=JSON.stringify(cards);
      // const data={
      //   cards:prevCards
      // }
      // console.log(data);
      const res=await api.updateDocument(Server.databaseID,Server.collectionID,cat,subcat,cards)
      if(res==null) return;
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
            // modules={modules}
            // forwardedRef={editorRef}
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
              {/* {console.log(cat==='Og')} */}
                <option value="medicine" selected={cat===value} >Medicine</option>

                <option value="og" selected={cat===value}>OG</option>

                <option value="pediatrics" selected={cat===value}>Pediatrics</option>

                <option value="surgery" selected={cat===value}>Surgery</option>

              </select>
              </label>
              <label>
              Types of Examination
              <select value={subcat} onChange={(e) => {setSubcat(e.target.value)}}>
                {items.map((item,index) => (
                  (
                    <option key={index} value={item} selected={subcat === value}>{item}</option>
                  )
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
