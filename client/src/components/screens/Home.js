import React, {useState,useEffect,useContext} from 'react'
import {useHistory,Link} from 'react-router-dom'
import {UserContext} from '../../App'

const Home = () =>{
    const [data,setData] = useState([])
    const {state,dispatch} = useContext(UserContext)
    const history = useHistory()
    useEffect(()=>{
        fetch('/allpost',{
            headers:{
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            setData(result)
        })
    },[])

    const likePost = (id) =>{
        fetch('/like',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result)
            const newData = data.map(item=>{
                if(item._id===result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }

    const unlikePost = (id) =>{
        fetch('/unlike',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            //console.log(result)
            const newData = data.map(item=>{
                if(item._id===result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        })
    }

    const makeComment = (text,postId) =>{
        fetch('/comment',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId,
                text
            })
        }).then(res=>res.json())
            .then(result=>{
                //console.log(result)
                const newData = data.map(item=>{
                    if(item._id===result._id){
                        return result
                    }else{
                        return item
                    }
                })
                setData(newData)
                document.getElementById("commentForm").reset();
            }).catch(err=>{
                console.log(err)
            })
    }

    const deletePost = (postId) =>{
        if(window.confirm("Do you want to delete this post?")){
            fetch(`/deletepost/${postId}`,{
                method:"delete",
                headers:{
                    Authorization:"Bearer "+localStorage.getItem("jwt")
                }
            }).then(res=>res.json())
            .then(result=>{
                console.log(result)
                const newData = data.filter(item=>{
                    return item._id !== result._id
                })
                setData(newData)
            })
        }
    }

    const deleteComment = (postId,commentId) =>{
        console.log("delete comment")
        fetch(`/deletecomment/${postId}/${commentId}`,{
            method:"put",
            headers:{
                Authorization:"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                commentId
            })
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData = data.filter(item=>{
                if(item._id.toString()===result._id.toString()){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        })
    }


    return (
        <>
        {data.length ?
        <div className="home">
            {   
                data.map(item=>{
                    return(
                        <div className="card home-card" key={item._id}>
                            <h5 style = {{padding:"10px"}}><Link to={ item.postedBy._id != state._id? "/profile/"+item.postedBy._id : "/profile"} >
                                <img style={{width:"40px",height:"40px",borderRadius:"80px"}}
                                    src = {item.postedBy.pic} />
                                 <span style={{paddingLeft:"20px"}}>{item.postedBy.name}</span>
                                </Link> {item.postedBy._id == state._id
                            && <i className="material-icons pointer"
                            style={{float:'right'}}
                            onClick={()=>deletePost(item._id)}>delete</i>
                            }</h5>
                            <div className="card-image">
                                <img src={item.photo} />
                            </div>
                            <div className="card-content">
                                {item.likes.includes(state._id) 
                                    ?
                                    <i className="material-icons pointer"
                                    onClick = {()=>{unlikePost(item._id)}}
                                    style={{color:"red"}}>favorite</i>
                                    :
                                    <i className="material-icons pointer"
                                    onClick = {()=>{likePost(item._id)}}>favorite_border</i>
                                }
                                
                                
                                <h6>{item.likes.length} likes</h6>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                {
                                    item.comments.map(record =>{
                                        return(
                                            <h6 key = {record._id}>
                                                <span style={{fontWeight : "500"}}>
                                                    {record.postedBy.name} </span>
                                                    {record.text} {record.postedBy._id == state._id
                                                    && <i className="material-icons pointer"
                                                    style={{float:'right'}}
                                                    onClick={()=>deleteComment(item._id,record._id)}>delete</i>
                                                    }</h6>
                                        )
                                    })
                                }
                                <form id="commentForm"
                                onSubmit = {(e) =>{
                                    e.preventDefault()
                                    makeComment(e.target[0].value,item._id)
                                }} >
                                    <input 
                                    type="text" 
                                    placeholder="add a coment"
                                    />
                                </form>
                            </div>
                        </div>
                    )
                })
                
            }
            
        </div>
        :<h2>loading....</h2>
        }
        </>
    )
}

export default Home
