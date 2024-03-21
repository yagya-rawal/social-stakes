import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ChangePassword =  () => {


    const navigate = useNavigate()

    const userId = localStorage.getItem('userId')
    const token = localStorage.getItem('token')

    if(!token || !userId ){
        navigate('/login')
    }

    const [userName,setUserName] = useState('')
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [error, setError] = useState('')


    const onButtonClick = async () => {
        if(userName === '' || oldPassword === '' || newPassword === ''){
            setError("All fields required")
            return
        }

        const data = { userName, oldPassword, newPassword}

        const response = await fetch(`/change-password`, {
            method: 'POST',
            body: JSON.stringify(data), 
            headers:{
                'Content-Type': 'application/json'
            }
        })

        const json = await response.json()

        if(!response.ok)
            setError(json.error)

        else{

            console.log("Password Changed ")

            setError('')
            setUserName('')
            setNewPassword('')
            setOldPassword('')

            navigate('/')
        }
    }


    return (<>

        <div className={'mainContainer'}>
            <div className={'titleContainer'}>
                <div>Change Password</div>
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
                    value={oldPassword}
                    type='password'
                    placeholder="Enter your current Password here"
                    onChange={(ev) => setOldPassword(ev.target.value)}
                    className={'inputBox'}
                />
                <label className="errorLabel">{error}</label>
            </div>
            <br />
            <div className={'inputContainer'}>
                <input
                    value={newPassword}
                    type='password'
                    placeholder="Enter your new password here"
                    onChange={(ev) => setNewPassword(ev.target.value)}
                    className={'inputBox'}
                />
                <label className="errorLabel">{error}</label>
            </div>
            <br />
            <div className={'inputContainer'}>
                <input className={'inputButton'} type="button" onClick={onButtonClick} value={'Submit'} />
            </div>
        </div>

    </>)

}

export default ChangePassword