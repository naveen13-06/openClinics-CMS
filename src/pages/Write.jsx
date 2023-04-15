import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/api"
import Server from "../Utils/config";
import { useMemo, useRef } from "react";

    
const Write = () => {
  //console.log(useLocation());
  const quillRef = useRef();
  const videoHandler = (a) => {
    const editor = quillRef.current.getEditor();
    console.log(editor)
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "video/*");
    input.setAttribute("allowfullscreen", "false");
    input.click();
    input.onchange = async () => {
        const file = input.files? input.files[0]:null;
        if (file && /^video\//.test(file.type)) {
          const formData = new FormData();
          formData.append('video', file);
          const det=await api.uploadMedia(Server.bucketID,input.files[0]);
          const url=`https://appwrite.open-clinics-cms.live/v1/storage/buckets/64343c0ac11d44d86300/files/${det.$id}/view?project=642d6c3be181312b0360&mode=admin`
          setAddresses((prev) => [...prev,det.$id]);
          editor.insertEmbed(editor.getSelection().index, "video", url);
          input.setAttribute("allow", "autoplay; fullscreen; picture-in-picture");
        } else {
            console.warn("You could only upload videos");
        }
    };
  };
  const imageHandler = (a) => {
    const editor = quillRef.current.getEditor();
    console.log(editor)
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = async () => {
        const file = input.files? input.files[0]:null;
        if (file && /^image\//.test(file.type)) {
          const formData = new FormData();
          formData.append('image', file);
          const det=await api.uploadMedia(Server.bucketID,input.files[0]);
          const url=`https://appwrite.open-clinics-cms.live/v1/storage/buckets/64343c0ac11d44d86300/files/${det.$id}/preview?width=200&height=200&project=642d6c3be181312b0360&mode=admin`
          setAddresses((prev) => [...prev,det.$id]);
          editor.insertEmbed(editor.getSelection().index, "image", url)
         
        } else {
            console.warn("You could only upload images.");
        }
    };
  };
    const modules = useMemo(() => ({
        toolbar: {
            container: [
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],  
              ['bold', 'italic', 'underline'],  
              [{ 'list': 'ordered' }, { 'list': 'bullet' },
              { 'indent': '-1' }, { 'indent': '+1' }],  
              [{ 'align': [] }],  
              ['link', 'image','video'],  
              ['clean'],  
              [{ 'color': [] }]  
            ],
            handlers: {
              image: () => {
                imageHandler();
              },
              video: () => {
                videoHandler()
              },
              // insertImage: insertImage,
            },
        },
    }),[]);
    
  const state = useLocation().state;
  const [value, setValue] = useState(state?.desc || "");
  const [title, setTitle] = useState(state?.title || "");
  const [head, setHead] = useState(state?.head || "");
  const [cn, setCn] = useState(state?.cn || "");
  const [cat, setCat] = useState(state?.cat || "Medicine");
  const [subcat, setSubcat] = useState(state?.subcat || "abdomen");
  const [addresses, setAddresses] = useState(state?.files||[]);
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
    const str=JSON.stringify(value);
    var files=addresses.filter((a) =>str.includes(a))
    console.log(files);
    addresses.map(async(a)=>{
      if(!files.includes(a)) await api.deleteFile(Server.bucketID,a);
    })
    const cards={
      cn:cn,
      head:head,
      title:title,
      desc:value,
      files:files
    }
    try {
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
            modules={modules}
            value={value}
            ref={quillRef}
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
