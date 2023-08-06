import React from "react"
import api from "../api/api";
import Server from "../Utils/config";
import LoadingSpinner from "../components/LoadingSpinner";
import { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import { Pie } from "react-chartjs-2";


const Data =()=>{
    const [loading, setLoading] = useState(true);
    const [values, setValues] = useState([]);
    let hm= new Map();
    const labels=[];
    const data=[];
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await api.getData('642d6e222288b93aea6a','643166e25a2c932bbe3e');
                res.map((doc)=>{
                   if(hm.has(doc.collegeName)){
                       hm.set(doc.collegeName,hm.get(doc.collegeName)+1);
                   }
                   else{
                        hm.set(doc.collegeName,1);
                    }
                });
                hm[Symbol.iterator] = function* () {
                    yield* [...this.entries()].sort((a, b) => b[1] - a[1]);
                }
                
                for(let [key,value] of hm){
                    // console.log(key,value);
                    values.push({key,value});
                }
                
            } catch (err) {
                console.log(err);
            }
            setLoading(false);
        };
        fetchData();
        console.log(values);
    }, []);
    const pieChart = values[0]? (
        <Pie
          data={{
            labels: values.map((val) => val.key),
            datasets: [
              {
                data: values.map((val) => val.value),
                borderColor: "rgb(255,255,255)",
                backgroundColor: "#0175c2",
              },
            ],
          }}
        />
      ) : null;
    
    return(
        <>
        {loading ? <LoadingSpinner/> :
       <div>
        {pieChart}
      </div>
        }
    </>
    )
    
}
export default Data;