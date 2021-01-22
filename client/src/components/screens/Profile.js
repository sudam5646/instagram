import React, {useState,useEffect, useContext} from 'react'
import {UserContext} from '../../App'

const Profile = () =>{
    const [mypics,setPics] = useState([])
    const {state,dispatch} = useContext(UserContext)
    const [image,setImage] = useState("")
    useEffect(()=>{
        console.log(1)
        fetch('/mypost',{
            headers:{
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            setPics(result.mypost)
        })
    },[])

    useEffect(()=>{
        console.log(2)
        if(image){
            console.log(3)
            const data = new FormData()
            data.append("file",image)
            data.append("upload_preset","insta-clone")
            data.append("cloud_name","dpyh4930b")
            fetch("https://api.cloudinary.com/v1_1/dpyh4930b/image/upload",{
                method:"post",
                body:data
            }).then(res=>res.json())
            .then(data=>{
                console.log(data)
                // localStorage.setItem("user",JSON.stringify({...state,pic:data.url}))
                // dispatch({type:"UPDATEPIC",payload:data.url},window.location.reload())
                fetch('/updatepic',{
                    method:"put",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":"Bearer "+localStorage.getItem("jwt")
                    },
                    body:JSON.stringify({
                        pic:data.url
                    })

                }).then(res=>res.json())
                .then(result=>{
                    console.log(result)
                    localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
                    dispatch({type:"UPDATEPIC",payload:result.pic},window.location.reload())
                })
                
            }).catch(err=>{
                console.log(err)
            })
        }
    },[image])

    return (
        <div style={{maxWidth:"1000px",margin:"0px auto"}}>
            <div 
            style={{
                margin:"18px 0px",
                borderBottom:"1px solid grey"}}>
            <div style ={{
                display:"flex",
                justifyContent:"space-around"
            }}> 
                <div>
                    <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
                    src = {state?state.pic:"loading"} />
                </div> 
                        
                <div>
                <h4>{state?state.name:"loading"}</h4>
                <h5>{state?state.email:"loading"}</h5>
                <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                    <h5>{mypics.length} posts</h5>
                    <h5>{state?state.followers.length:"0"} followers</h5>
                    <h5>{state?state.following.length:"0"} following</h5>
                </div>
            </div>
            </div>
            <div className="file-field input-field">
                <div className="btn #64b5f6 blue darken-1">
                    <span>Upload Pic</span>
                    <input 
                    type="file" 
                    onChange={(e=>{
                        setImage(e.target.files[0])
                    })}/>
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            </div>
            <div className="gallery">
                {
                    mypics.map(item=>{
                        return(
                            <img key={item._id} src={item.photo} alt={item.title} width="30%" height="auto" />
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Profile
