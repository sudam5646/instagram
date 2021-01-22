import React, {useContext} from 'react'
import {Link,useHistory} from 'react-router-dom'
import {UserContext} from '../App'

const Navbar = () =>{
    const {state,dispatch} = useContext(UserContext)
    const history = useHistory()
    const renderList = ()=>{
        if(state){
            return[
                <li><Link to="/profile">Profile</Link></li>,
                <li><Link to="/createpost">Create Post</Link></li>,
                <li><Link to="/myfollowingposts">My following Post</Link></li>,
                <li>
                    <button className="btn #c62828 red darken-3"
                onClick = {()=>{
                    localStorage.clear()
                    dispatch({type:"CLEAR"})
                    history.push('/signin')
                }}>
                    Logout
                </button>
                </li>
            ]
        }else{
            return[
                <li><Link to="/signin">Signin</Link></li>,
                <li><Link to="/signup">Signup</Link></li>
            ]
        }
    }

    return (
        <div>
            <nav>
                <div
                className="nav-wrapper white">
                        <Link to={state?'/':'/signin'} className="brand-logo left">Instagram</Link>
                        <ul id="nav-mobile" className="right">
                            {renderList()}
                        </ul>
                </div>
            </nav>
        </div>
    )
}

export default Navbar