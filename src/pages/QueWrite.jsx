import React, { useEffect, useState } from "react";
import { Editor } from '@tinymce/tinymce-react';
// import "react-quill/dist/quill.snow.css";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/api"
import Server from "../Utils/config";
import { useRef } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import subjects from '../components/subjects'
const QueWrite = () => {
  const editorRef = useRef();
  const [loading, setLoading] = useState(false);
  const state = useLocation().state;
  const [ans, setAns] = useState(state?.ans || "");
  const [que, setQue] = useState(state?.que || "");
  const [board, setBoard] = useState(state?.board || "MGR");
  const [marks, setMarks] = useState(state?.marks || "5");
  const [subject, setSubject] = useState(state?.subject || subjects[0].subject);
  const [lesson, setLesson] = useState(state?.lesson || subjects[0].submenu[0].title);
  const [year, setYear] = useState(state?.year || "");
  const [items, setItems] = useState(subjects[0].submenu);
  const [bookItems, setBookItems]=useState(subjects[0].books);
  const [book,setBook]=useState(state?.book || "");
  const [page,setPage]=useState(state?.page || "");
  const [booklist,setBooklist]=useState([]);
  var max = new Date().getFullYear()
  var min = max - 100
  var years = []
  for(var i = max; i >= min; i--) {
    years.push({ value: i, label: i});
  }
  const navigate = useNavigate()
  // useEffect(()=>{
  //   console.log(que);
  // },[que])
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
    var bookAndPages=[];
    booklist.map((item)=>{
        bookAndPages.push(JSON.stringify(item));
    })
    const data = {
      answerText:JSON.stringify(ans),
      questionText: que,
      board: board,
      marks: marks,
      subject: subject,
      lesson: lesson,
      years: year.split(","),
      pageNum:[...bookAndPages],
    }
    try {
        const res = await api.insertQuestion(Server.databaseID, "64413ea96acba3fd2ee7",data);
        setLoading(false);
        if (res == null) return;
        navigate("/questions");
      } catch (err) {
        console.log(err);
      } 
    console.log(data);
  }
  //console.log(years);
  return (
    <>
      {loading ? <LoadingSpinner /> :
        <div className="add">
          <div className="content">
          
            <textarea
              type="text"
              placeholder="Question"
              value={que}
              onChange={(e) => setQue(e.target.value)}
              required
            />
            <label htmlFor="board">Choose board:</label>
                <select value={board} onChange={(e) => { setBoard(e.target.value) }}>
                    <option value="MGR">MGR</option>
                </select>
            <label htmlFor="marks">Choose marks:</label>
            <select value={marks} onChange={(e) => { setMarks(e.target.value) }}>
                    <option value="5"  >5 marks</option>
                    <option value="15" >15 marks</option>
            </select>
            <label htmlFor="subjects">Choose Subject:</label>
            <select value={subject} onChange={(e) => {setSubject(e.target.value);
                        setItems(subjects[e.target.options.selectedIndex].submenu)
                        setBookItems(subjects[e.target.options.selectedIndex].books);
                        }}>
                    {subjects.map((s,index)=>(
                        <option key={index} value={s.subject}>{s.subject}</option>
                    ))}
            </select>
            <label htmlFor="Lessons">Choose Lesson:</label>
            <select value={lesson} onChange={(e) => { setLesson(e.target.value) }}>
                {items.map((s,index)=>(
                    <option key={index} value={s.title}>{s.title}</option>
                ))}
            </select>
            <div>
            {booklist.map((b,index)=>(
                <div key={index}>
                    <span>{b.bookName}</span>
                    <span style={{padding:10+'px'}}>{b.page}</span>
                    <button onClick={(e)=>deleteBook(index)}>Delete</button>
                </div>
            ))}
            <label htmlFor="book">Choose Books:  </label>
            <select value={book} onChange={(e) => { setBook(e.target.value) }}>
                  {bookItems.map((s,index)=>(
                          <option key={index} value={s}>{s}</option>
                      ))}
            </select>
            <input
              type="text"
              placeholder="Page"
              value={page}
              onChange={(e) => setPage(e.target.value)}
              required
            />
            <button onClick={addBook}>Add Book</button>
            </div>
            
            <input
              type="text"
              placeholder="Write years seperated by comma"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
            />
           
            

            <div className="editorContainer">
            <p>Answer</p>
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
                    'removeformat | link',
                  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                }}
              />
            </div>
            <button style={{width:'200px'}} onClick={publish}>Submit</button>
          </div>
        </div>
      }
    </>
  );
};

export default QueWrite;

