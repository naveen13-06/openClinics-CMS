import React from "react"
import Img1 from "../img/DeleteStep0.jpg";
import Img2 from "../img/DeleteStep1.jpg";
import Img3 from "../img/DeleteStep2.jpg";

const Delete =()=>{
    return(
        <div>
            <h1>Steps to delete the account:</h1>
            <br></br>
            <ul>
            <img src={Img1} alt="Delete-step-1" width={150}></img>
                <li>
                Tap the hamburger icon present at the top left of OpenClinic app's  home screen</li>
                <br>
                </br>
                <br />
                <img src={Img2} alt="Delete-step-2" width={150}></img>
                <li>
                Tap at the "delete account" option from the list of options</li><br></br>
                <br />
                <img src={Img3} alt="Delete-step-3" width={150}></img>
                <li>
                
                Tap yes in the confirmation dialog</li>
            </ul>
            <br />
            <br />
        </div>
    )
}
export default Delete;