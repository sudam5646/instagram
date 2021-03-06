import React, {useState,useContext} from 'react'
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css'
import {UserContext} from '../../App'

const Signin = () =>{
    const {state,dispatch} = useContext(UserContext)
    const [password,setPassword] = useState("")
    const [email,setEmail] = useState("")
    const history = useHistory()
    
    const PostData = ()=>{
        if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)){
            M.toast({html:"Invalid Email",classes:"#f44336 red"})
            return
        }
        fetch("/signin",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password,
                email
            })
            }).then(res =>res.json())
            .then(data =>{
                if(data.error){
                    M.toast({html: data.error,classes:"#f44336 red"})
                }
                else{
                    localStorage.setItem("jwt",data.token)
                    localStorage.setItem("user",JSON.stringify(data.user))
                    dispatch({type:"USER",payload:data.user})
                    M.toast({html:"signedin successfully",classes:"#8bc34a light-green"})
                    console.log(data)
                    history.push('/')
                }
        }).catch(err=>{
            console.log(err)
        })
    }
    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>Instagram</h2>   
                <input
                type = "text"
                placeholder = "email"
                value={email}
                onChange={(e) =>setEmail(e.target.value)}
                />
                <input
                type = "password"
                placeholder = "password"
                value={password}
                onChange={(e) =>setPassword(e.target.value)}
                />    
                <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
                onClick = {PostData}>
                    Login
                </button> 
                <h5>
                    <Link to='/signup'>Dont have an account?</Link>    
                </h5>       
            </div>
        </div>
    )
}

export default Signin
