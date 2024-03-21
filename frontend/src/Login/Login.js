import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = (props) => {

//  const host = 'http://localhost:3000/'
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [error,setError] = useState('')

  const navigate = useNavigate()

  const token = localStorage.getItem('token')

  if(token){
    navigate('/')
  }

  const onButtonClick = async () => {
    
    if(userName === '' || password === ''){
        setError("All fields required")
        return
    }

    const data = { userName, password}

    const response = await fetch(`/login`, {
        method: 'POST',
        body: JSON.stringify(data) ,
        headers: {
          'Content-Type': 'application/json'
        }
    })

    const json = await response.json()
    if(!response.ok)
        setError(json.error)

    else{

        console.log("login successfull "+ json)

        localStorage.setItem('userName',userName)

        setError(null)
        setUserName('')
        setPassword('')

        console.log(json)

        if(json.token){
        localStorage.setItem('userId', json.userId)
        localStorage.setItem('token',json.token)

        setTimeout(1000)  

        navigate('/')
        }
        else{
          setError("couldn't login, recheck your userName and password")
        }

    }
  }

  return (
    <div className={'mainContainer'}>
      <div className={'titleContainer'}>
        <div>Login</div>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input
          value={userName}
          placeholder="Enter your userName here"
          onChange={(ev) => setUserName(ev.target.value)}
          className={'inputBox'}
        />
        <label className="errorLabel">{error}</label>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input
          value={password}
          type='password'
          placeholder="Enter your password here"
          onChange={(ev) => setPassword(ev.target.value)}
          className={'inputBox'}
        />
        <label className="errorLabel">{error}</label>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input className={'inputButton'} type="button" onClick={onButtonClick} value={'Log in'} />
      </div>
    </div>
  )
}

export default Login