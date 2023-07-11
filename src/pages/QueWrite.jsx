import React, { useEffect, useState } from "react";
import { Editor } from '@tinymce/tinymce-react';
// import "react-quill/dist/quill.snow.css";
import { useLocation,useNavigate } from "react-router-dom";
import api from "../api/api"
import Server from "../Utils/config";
import { useRef } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import subjects from '../components/subjects';
import Delete from "../img/delete.png";
const QueWrite = () => {
  const editorRef = useRef();
  const [loading, setLoading] = useState(false);
  const state = useLocation().state;
  const [ans, setAns] = useState(state?.answerText.replace(/"|'/g,'') || "");
  const [que, setQue] = useState(state?.questionText || "");
  const [board, setBoard] = useState(state?.board || "MGR");
  const [marks, setMarks] = useState(state?.marks || "5");
  const [subject, setSubject] = useState(state?.subject || subjects[0].subject);
  const [lesson, setLesson] = useState(state?.lesson || subjects[0].submenu[0].title);
  const [year, setYear] = useState(state?.years?.join() || "");
  const [items, setItems] = useState(state?subjects.filter((s)=>{return s.subject===state.subject})[0].submenu:subjects[0].submenu);
  const [bookItems, setBookItems]=useState(state?subjects.filter((s)=>{return s.subject===state.subject})[0].books:subjects[0].books);
  const [book,setBook]=useState(bookItems[0]);
  const [page,setPage]=useState("");
  const [post,setPost]=useState(state);
  const [booklist,setBooklist]=useState(state?.pageNum.map((s)=>JSON.parse(s)) || []);
  const [addresses, setAddresses] = useState(state?.files || []);
  const navigate = useNavigate()

  useEffect(()=>{
    console.log();
  },[])
  function addBook(){
    setBooklist((prev)=>[...prev,{bookName:book,page:page}]);
    setBook(bookItems[0]);
    setPage("");
  }
  function deleteBook(k){
    setBooklist((prev)=>prev.filter((item,index)=>index!==k));
  }
  async function publish(){
    setLoading(true);
    const str = JSON.stringify(ans);
    var files = addresses.filter((a) => str.includes(a))
    console.log(files);
    addresses.map(async (a) => {
      if (!files.includes(a)) await api.deleteFile(Server.bucketID, a);
    })
    var bookAndPages=[];
    booklist.map((item)=>{
        bookAndPages.push(JSON.stringify(item));
    })
    const data = {
      answerText:ans,
      questionText: que,
      board: board,
      marks: marks,
      subject: subject,
      lesson: lesson,
      years: year.split(","),
      pageNum:[...bookAndPages],
      files: files
    }
    try {
        var res;
        if(!state) res = await api.insertQuestion(Server.databaseID, "64413ea96acba3fd2ee7",data);
        else res=await api.updateQuestion(Server.databaseID, "64413ea96acba3fd2ee7",state.$id,data);   
        setLoading(false);
        if (res == null) return;
        navigate(`/questions/?subject=${subject}&lesson=${lesson}`);
      } catch (err) {
        console.log(err);
      } 
    console.log(data);
  }
  const handleDelete = async ()=>{
    setLoading(true);
      try {
        post.files?.map(async (a)=>{
          await api.deleteFile(Server.bucketID,a);
        })
        await api.deleteQuestion(Server.databaseID,'64413ea96acba3fd2ee7',post.$id);
        setLoading(false);
        navigate("/questions")
      } catch (err) {
        console.log(err);
      }
  }
  async function example_image_upload_handler(blobInfo, success, failure, progress) {
    var formData;
    const det = await api.uploadMedia(Server.bucketID, blobInfo.blob());
    const url = `https://appwrite.open-clinics-cms.live/v1/storage/buckets/64343c0ac11d44d86300/files/${det.$id}/view?project=642d6c3be181312b0360&mode=admin`
    addresses.push(det.$id);
    success(url);
    formData = new FormData();
    formData.append('file', blobInfo.blob(), blobInfo.filename());
    console.log(blobInfo);
    return url
  };
  //console.log(years);
  return (
    <>
      {loading ? <LoadingSpinner /> :
        <div className="add1">
        {state && <img onClick={()=>{ if (window.confirm('Are you sure you wish to delete this item?'))handleDelete() }} src={Delete} alt="" />
        }  
          <div className="content1">
           <textarea
              type="text"
              placeholder="Question"
              value={que}
              onChange={(e) => setQue(e.target.value)}
              required
            />
            <span>
            <label htmlFor="board">Choose board:
                <select value={board} onChange={(e) => { setBoard(e.target.value) }}>
                    <option value="MGR">MGR</option>
                </select>
                </label>
            <label htmlFor="marks">Choose marks:
            <select value={marks} onChange={(e) => { setMarks(e.target.value) }}>
                    <option value="2"  >2 marks</option>
                    <option value="5"  >5 marks</option>
                    <option value="10"  >10 marks</option>
                    <option value="15" >15 marks</option>
            </select>
            </label>
            </span>
            <span>
            <label htmlFor="subjects">Choose Subject:
            <select value={subject} onChange={(e) => {setSubject(e.target.value);
                        setItems(subjects[e.target.options.selectedIndex].submenu)
                        setBookItems(subjects[e.target.options.selectedIndex].books);
                        setLesson(subjects[e.target.options.selectedIndex].submenu[0].title)
                        setBook(subjects[e.target.options.selectedIndex].books[0]);
                        setBooklist([]);
                        }}>
                    {subjects.map((s,index)=>(
                        <option key={index} value={s.subject}>{s.subject}</option>
                    ))}
            </select>
            </label>
            <label >
            Choose Lesson:
            <select  value={lesson}  onChange={(e) => { setLesson(e.target.value) }}>
                {items.map((s,index)=>(
                    <option key={index} value={s.title}>{s.title}</option>
                ))}
            </select>
            </label>
            </span>
            <div >
            {booklist.map((b,index)=>(
                <div key={index}>
                    <span>{b.bookName}</span>
                    <span style={{padding:10+'px'}}>{b.page}</span>
                    <button onClick={(e)=>deleteBook(index)}>Delete</button>
                </div>
            ))}
            <label htmlFor="book" className="books">Choose Books:  
            <select  value={book} onChange={(e) => { setBook(e.target.value) }}>
                  {bookItems.map((s,index)=>(
                          <option key={index} value={s}>{s}</option>
                      ))}
            </select>
            <input
            className="page"
              type="text"
              placeholder="Page"
              value={page}
              onChange={(e) => setPage(e.target.value)}
              required
            />
            <button className="addBook" onClick={addBook}>Add Book</button>
            </label>
            </div>
            
            <input
            className="yearsInput"
              type="text"
              placeholder="Write years seperated by comma"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
            />
           
            

            <div className="editorContainer">
            <h3>Answer</h3>
              <Editor
                onInit={(evt, editor) => editorRef.current = editor}
                value={ans}
                onEditorChange={(newValue, editor) => { setAns(newValue); }}
                init={{
                  height: 600,
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
                        addresses.push(url.$id);
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
            <div className="btn"><button className="btn1"  onClick={publish}>Submit</button></div>
          </div>
        </div>
      }
    </>
  );
};

export default QueWrite;

