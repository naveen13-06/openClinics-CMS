import React, { useEffect, useState } from "react";
import { Editor } from '@tinymce/tinymce-react';
// import "react-quill/dist/quill.snow.css";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/api"
import Server from "../Utils/config";
import { useRef } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
const Write = () => {
  const editorRef = useRef();
  const [loading, setLoading] = useState(false);
  const state = useLocation().state;
  const [value, setValue] = useState(state?.desc || "");
  const [title, setTitle] = useState(state?.title || "");
  const [head, setHead] = useState(state?.head || "");
  const [cn, setCn] = useState(state?.cn || "");
  const [cat, setCat] = useState(state?.cat || "Medicine");
  const [subcat, setSubcat] = useState(state?.subcat || "abdomen");
  const initialCn = state?.cn || null;
  const [addresses, setAddresses] = useState(state?.files || []);
  // console.log(state?.subcat);
  const med = ["abdomen", "cns", "cvs", "renal", "rs"];
  const og = ["obstetric", "gynaecology"];
  const pediatrics = ["abdomen", "cns", "cvs", "anthropometry", "rs", "newborn", "headtofoot"];
  const surgery = ["breast", "varicose_vein", "swelling", "ulcer", "abdomen", "hernia", "peripheral_arterial_disease"];
  const [items, setItems] = useState(med);
  useEffect(() => {
    if (cat === "medicine") setItems(med);
    else if (cat === "og") setItems(og);
    else if (cat === "pediatrics") setItems(pediatrics);
    else if (cat === "surgery") setItems(surgery);
  }, [cat])
  useEffect(() => {
    if (!state?.subcat) setSubcat(items[0]);
  }, [items])
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
    setLoading(true);
    const str = JSON.stringify(value);
    var files = addresses.filter((a) => str.includes(a))
    console.log(files);
    addresses.map(async (a) => {
      if (!files.includes(a)) await api.deleteFile(Server.bucketID, a);
    })
    const cards = {
      cn: cn,
      head: head,
      title: title,
      desc: value,
      files: files
    }
    try {
      const res = await api.updateDocument(Server.databaseID, Server.collectionID, cat, subcat, cards, initialCn);
      setLoading(false);
      if (res == null) return;

      navigate("/")
    } catch (err) {
      console.log(err);
    }
  };
  async function example_image_upload_handler(blobInfo, success, failure, progress) {
    var formData;
    const det = await api.uploadMedia(Server.bucketID, blobInfo.blob());
    const url = `https://appwrite.open-clinics-cms.live/v1/storage/buckets/64343c0ac11d44d86300/files/${det.$id}/view?project=642d6c3be181312b0360&mode=admin`
    success(url);
    formData = new FormData();
    formData.append('file', blobInfo.blob(), blobInfo.filename());
    console.log(blobInfo);
    return url
  };
  return (
    <>
      {loading ? <LoadingSpinner /> :
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
              <Editor
                onInit={(evt, editor) => editorRef.current = editor}
                value={value}
                onEditorChange={(newValue, editor) => { setValue(newValue); }}
                init={{
                  height: 500,
                  menubar: false,
                  menubar: 'file edit view insert format tools table help',
                  plugins: [
                    'advlist autolink lists link image charmap print preview anchor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table paste code wordcount'
                  ],
                  toolbar: 'insertfile undo redo | formatselect | ' +
                    'bold italic backcolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | link image media',
                  images_upload_handler: example_image_upload_handler,
                  file_picker_types: 'file media',
                  file_picker_callback: function (cb, value, meta) {
                    var input = document.createElement('input');
                    input.setAttribute('type', 'file');
                    input.setAttribute('accept', ['video/*', 'audio/*']);

                    input.onchange = function () {
                      var file = this.files[0];
                      var reader = new FileReader();

                      reader.onload = async function () {
                        var id = 'blobid' + (new Date()).getTime();
                        var blobCache = editorRef.current.editorUpload.blobCache;
                        //var base64 = reader.result.split(',')[1];
                        var blobInfo = blobCache.create(id, file, 'application/octet-stream');
                        const url = await example_image_upload_handler(blobInfo, function () { }, function () { }, function () { });
                        cb(url, { title: file.name });
                      };
                      reader.readAsDataURL(file);
                    };

                    input.click();
                  },
                  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                }}
              />
            </div>
          </div>
          <div className="menu">
            <div className="item">
              <h1>Publish</h1>
              <div className="cat">
                <label>

                  Subject

                  <select value={cat} onChange={(e) => { setCat(e.target.value) }}>
                    {/* {console.log(cat==='Og')} */}
                    <option value="medicine"  >Medicine</option>

                    <option value="og" >OG</option>

                    <option value="pediatrics" >Pediatrics</option>

                    <option value="surgery" >Surgery</option>

                  </select>
                </label>
                <label>
                  Types of Examination
                  <select value={subcat} onChange={(e) => { setSubcat(e.target.value) }}>
                    {items.map((item, index) => (
                      (
                        <option key={index} value={item}>{item}</option>
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
      }
    </>
  );
};

export default Write;
