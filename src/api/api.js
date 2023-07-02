import {
  Client as Appwrite,
  Databases,
  Account,
  Query,
  Storage,
} from "appwrite";
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
    const storage = new Storage(appwrite);
    api.sdk = { database, account, storage };
    return api.sdk;
  },

  //   createAccount: ({username,password}) => {
  //     return api.provider().account.create("unique()", email, password, name);
  //   },

  getAccount: () => {
    //console.log("getAccount");
    let account = api.provider().account;
    let promise = account.get();
    // promise.then((res)=>{
    //   console.log(res);
    // });
    return promise;
  },

  createSession: ({ email, password }) => {
    let promise = api.provider().account.createEmailSession(email, password);
    // promise.then((res)=>{
    //   console.log(res);
    // },(err)=>{
    //   console.log(err);
    // });
    return promise;
  },
  deleteCurrentSession: () => {
    const email = JSON.parse(localStorage.getItem("user"));
    //console.log(email.name);
    return api.provider().account.deleteSession("current");
  },
  // createDocument: (databaseId,collectionId,data) => {
  //   console.log(data);
  //   return api.provider().database.createDocument(databaseId,'Surgery','unique()',data);
  // },

  listDocuments: (databaseId, collectionId, cat, id = null) => {
    //console.log(cat);
    if (id) {
      return api
        .provider()
        .database.listDocuments(databaseId, collectionId, [
          Query.equal("examinationName", id),
          Query.equal("subjectName", cat),
        ]);
    }
    if (cat) {
      // console.log(collectionId);
      return api
        .provider()
        .database.listDocuments(databaseId, collectionId, [
          Query.equal("subjectName", cat),
        ]);
    }
    return null;
  },
  listQuestions: (databaseId, collectionId, cat, id = null) => {
    console.log(id);
    if (id) {
      return api
        .provider()
        .database.listDocuments(databaseId, collectionId, [
          Query.equal("subject", cat),
          Query.equal("lesson", id),
          Query.limit(100),
        ]);
    }
    // if(cat){
    //   // console.log(collectionId);
    // return api.provider().database.listDocuments(databaseId,collectionId
    //   ,[Query.equal('subject',cat)]);
    // }
    return null;
  },
  getCard: async (databaseId, collectionID, cat, type, cn) => {
    const res = await api
      .provider()
      .database.listDocuments(databaseId, collectionID, [
        Query.equal("examinationName", type),
        Query.equal("subjectName", cat),
      ]);
    const ans = res.documents[0].cards.filter((card) => {
      const data = JSON.parse(card);
      return data.cn === cn;
    });
    // console.log(ans);
    return ans;
  },
  getQuestion: async (databaseId, collectionID, did) => {
    return await api
      .provider()
      .database.getDocument(databaseId, collectionID, did);
  },
  deleteQuestion: async (databaseId, collectionID, did) => {
    return await api
      .provider()
      .database.deleteDocument(databaseId, collectionID, did);
  },
  updateDocument: async (databaseId, collectionId, cat, id, data, cn) => {
    console.log(data);
    const res = await api
      .provider()
      .database.listDocuments(databaseId, collectionId, [
        Query.equal("examinationName", id),
        Query.equal("subjectName", cat),
      ]);
    if (res.documents.length === 0) {
      return api
        .provider()
        .database.createDocument(databaseId, collectionId, "unique()", {
          examinationName: id,
          subjectName: cat,
          cards: [JSON.stringify(data)],
        });
    } else {
      let prevCards = res.documents[0].cards;
      let datas = [];
      prevCards.map((card) => {
        const d = JSON.parse(card);
        //let t=parseInt(d.cn,10);
        datas[d.cn] = d;
      });

      console.log(datas);
      // const isPresent=prevCards.filter((card)=>{
      //   const d=JSON.parse(card);
      //   return d.cn==data.cn;
      // });
      if (datas[data.cn] != null && cn === data.cn) {
        if (!window.confirm("Do you want to update the card?")) {
          return null;
        } else {
          datas[data.cn] = data;
        }
      }
      if (cn !== null && cn !== data.cn) {
        if (datas[data.cn] == null) {
          if (
            !window.confirm(
              "You are trying to change the card number to another.This will move the entire card. Do you want to continue?"
            )
          ) {
            return null;
          } else {
            datas[data.cn] = data;
            datas[cn] = null;
          }
        } else {
          if (
            !window.confirm(
              "You are trying to change the card number to another.There is already a card present.This will move this card before the specified card. Do you want to continue?"
            )
          ) {
            return null;
          } else {
            let k = data.cn;
            datas[cn] = null;
            let prev = data;
            while (true) {
              if (datas[k] == null) {
                datas[k] = prev;
                break;
              }
              let tmp = datas[k];
              datas[k] = prev;
              tmp.cn = parseInt(tmp.cn, 10) + 1 + "";
              prev = tmp;
              k++;
            }
            // console.log(prevCards);
            // let before=prevCards.filter((card)=>{
            //   const d=JSON.parse(card);
            //   return d.cn>=data.cn;
            // });

            // before.map((card)=>{
            //   const d=JSON.parse(card);
            //   d.cn++;
            //   return JSON.stringify(d);
            // });

            // prevCards=prevCards.filter((card)=>{
            //   const d=JSON.parse(card);
            //   return d.cn<cn;
            // });
            // prevCards.map((card)=>{
            //   const d=JSON.parse(card);
            //   if(d.cn<cn){
            //     before.push(card);
            //   }
            // });
            // prevCards=before;
            // console.log(prevCards);
            // return null;
          }
        }
      }
      if (cn === null) {
        if (datas[data.cn] != null) {
          window.alert(
            "Card number already exists. Go to the particular card to edit it."
          );
          return null;
        }
        datas[data.cn] = data;
      }
      let ans = datas
        .filter((card) => {
          return card != null;
        })
        .map((card) => {
          return JSON.stringify(card);
        });
      const result = { cards: ans };
      const did = res.documents[0].$id;
      return api
        .provider()
        .database.updateDocument(databaseId, collectionId, did, result);
    }
    // const prevCards=res.documents[0].cards;
  },
  insertQuestion: async (databaseId, collectionID, data) => {
    return api
      .provider()
      .database.createDocument(databaseId, collectionID, "unique()", data);
  },
  updateQuestion: async (databaseId, collectionID, did, data) => {
    return api
      .provider()
      .database.updateDocument(databaseId, collectionID, did, data);
  },

  deleteCard: async (databaseId, collectionID, cat, did, pid) => {
    console.log(cat, did, pid);
    const res = await api
      .provider()
      .database.listDocuments(
        databaseId,
        collectionID,
        [Query.equal("examinationName", did)],
        [Query.equal("subjectName", cat)]
      );
    // console.log(res);
    const removed = res.documents[0].cards.filter((card) => {
      const data = JSON.parse(card);
      return data.cn !== pid;
    });
    const id = res.documents[0].$id;
    const data = { cards: removed };
    // console.log(data);
    return api
      .provider()
      .database.updateDocument(databaseId, collectionID, id, data);
  },
  uploadMedia: async (bucketID, fd) => {
    console.log(fd);
    return await api.provider().storage.createFile(bucketID, "unique()", fd);
  },
  deleteFile: async (bid, fileId) => {
    return await api.provider().storage.deleteFile(bid, fileId);
  },
};

export default api;
