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

  listDocuments: (databaseId,cat,id=null) => {
    // console.log(cat);
    if(id){
      // console.log(id);
      return api.provider().database.listDocuments(databaseId,cat,
        [Query.equal('$id',id)]);
    }
    
    return api.provider().database.listDocuments(databaseId,cat);
  },
  getCard: async(databaseId,cat,type,cn) => {
    const res= await api.provider().database.listDocuments(databaseId,cat,
      [Query.equal('$id',type)]);
    return res.documents[0].Cards[cn-1];
  },
  updateDocument: (databaseId, collectionId,did, data) => {
    console.log(data);
    return api
      .provider()
      .database.updateDocument(databaseId, collectionId,did,data);
  },
  deleteCard:async(databaseId,cat,did,pid) => {
    const res= await api.provider().database.listDocuments(databaseId,cat,
      [Query.equal('$id',did)]);
    const card=res.documents[0].Cards;
    card[pid-1]=null;
    const data={Cards:card};
    return api.provider().database.updateDocument(databaseId,cat,did,data);
  },
};

export default api;