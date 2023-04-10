import { Client as Appwrite, Databases, Account,Query } from "appwrite";
import { json } from "react-router-dom";
import Server from "../Utils/config";

let api = {
  sdk: null,
  provider: () => {
    if (api.sdk) {
      return api.sdk;
    }
    let appwrite = new Appwrite();
    appwrite.setEndpoint(Server.endpoint).setProject(Server.project);
    
    const account = new Account(appwrite);
    const database = new Databases(appwrite);
    api.sdk = {database, account };
    return api.sdk;
  },

//   createAccount: ({username,password}) => {
//     return api.provider().account.create("unique()", email, password, name);
//   },

  getAccount: () => {
    console.log("getAccount");
    let account = api.provider().account;
    let promise= account.get();
    // promise.then((res)=>{
    //   console.log(res);
    // });
    return promise;
  },

  createSession:({email, password}) => {
    let promise= api.provider().account.createEmailSession(email,password);  
    // promise.then((res)=>{
    //   console.log(res);
    // },(err)=>{
    //   console.log(err);
    // });
    return promise;
  },
  deleteCurrentSession: () => {
    const email=JSON.parse(localStorage.getItem("user"));
    console.log(email.name);
    return api.provider().account.deleteSession("current");
  },
  createDocument: (databaseId,collectionId,data) => {
    console.log(data);
    return api.provider().database.createDocument(databaseId,'Surgery','unique()',data);
  },

  listDocuments: (databaseId,collectionId,cat,id=null) => {
    //console.log(cat);
    if(id){
      return api.provider().database.listDocuments(databaseId,collectionId,
        [Query.equal('type',id)],[Query.equal('subjectName',cat)] );
    }
    if(cat){
      // console.log(collectionId);
    return api.provider().database.listDocuments(databaseId,collectionId
      ,[Query.equal('subjectName',cat)]); 
    }
    return null;
  },
  getCard: async(databaseId,collectionID,cat,type,cn) => {
    const res= await api.provider().database.listDocuments(databaseId,collectionID,
      [Query.equal('type',type)],[Query.equal('subjectName',cat)]);
    const ans=res.documents[0].cards.filter((card)=>{
      const data=JSON.parse(card);
      return data.cn==cn
    });
    // console.log(ans);
    return ans
  },
  updateDocument: async(databaseId, collectionId,cat,id,data) => {
    console.log(data);
    const res=await api.provider().database.listDocuments(databaseId,collectionId,
      [Query.equal('type',id)],[Query.equal('subjectName',cat)] );
    if(res.documents.length==0){
      return api.provider().database.createDocument(databaseId,collectionId,'unique()',{type:id,subjectName:cat,cards:[JSON.stringify(data)]});
    }
    else{
      let prevCards=res.documents[0].cards;
      const isPresent=prevCards.filter((card)=>{
        const d=JSON.parse(card);
        return d.cn==data.cn;
      });
      if(isPresent.length>0){
        if(!window.confirm("Do you want to update the card?")){
          return null;
        }
        else{
          await api.deleteCard(databaseId,collectionId,cat,id,data.cn);
          const second=await api.provider().database.listDocuments(databaseId,collectionId,
            [Query.equal('type',id)],[Query.equal('subjectName',cat)] );
          prevCards=second.documents[0].cards;
        }
      }
      prevCards.push(JSON.stringify(data));
      const result={cards:prevCards};
      const did=res.documents[0].$id;
    return api
      .provider()
      .database.updateDocument(databaseId, collectionId,did,result);
    }
      // const prevCards=res.documents[0].cards;
    
  },
  deleteCard:async(databaseId,collectionID,cat,did,pid) => {
    console.log(cat,did,pid);
    const res= await api.provider().database.listDocuments(databaseId,collectionID,
      [Query.equal('type',did)],[Query.equal('subjectName',cat)]);
      // console.log(res);
    const removed=res.documents[0].cards.filter((card)=>{
      const data=JSON.parse(card);
      return data.cn!=pid;
    })
    const id=res.documents[0].$id;
    const data={cards:removed};
    // console.log(data);
    return api.provider().database.updateDocument(databaseId,collectionID,id,data);
  },
};

export default api;