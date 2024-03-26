import React, { useEffect, useState } from 'react'
import { Form, Dropdown, ListGroup } from 'react-bootstrap'

const token = localStorage.getItem('token')
const userId = localStorage.getItem('userId')

const MatchList = () => {

    const [betsMatchwise, setBetsMatchwise] = useState({})
    const [showOption, setShowOption] = useState(null)
    const [matches, setMatches] = useState([])
    const [options, setOptions] = useState({})

    function formatDate(date) {
        if (date) {
            date = new Date(date)
            const temp = { year: 'numeric', month: 'long', day: 'numeric' };
            return date.toLocaleDateString(undefined, temp);
        }
    }

    // Function to format time
    function formatTime(date) {
        if (date) {
            date = new Date(date)
            const temp = { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true };
            return date.toLocaleTimeString(undefined, temp);
        }
    }

    const fetchMatches = async () => {
        const response = await fetch(`/user/${userId}/events/upcoming`, {
            method: 'GET',
            headers: {
                'authorization': token
            }
        })
        const json = await response.json()
        if (!response.ok)
            return

        else {


            console.log(json)
            setMatches(json)

        }
    }

    const fetchOptions = async () => {

        const response = await fetch(`/user/${userId}/options`, {
            method: 'GET',
            headers: {
                'authorization': token
            }
        })

        const json = await response.json()
        if (!response.ok)
            return

        const tempOptions = { ...options }

        json.map((option) => {


            tempOptions[option._id] = {
                'name': option.name,
                'nickname': option.nickname
            }

        })

        setOptions(tempOptions)

    }


    useEffect(() => {

        fetchMatches()
        fetchOptions()

    }, [])


    const handleButtonClick = async (flag, matchId) => {
        if (!flag) {
            setShowOption(null)
        }

        else { 

                const response = await fetch(`/event/${matchId}/bets`, {
                    method: 'GET',
                    headers: {
                        'authorization': token
                    }
                })

                if (!response.ok) {
                    console.log("Failed to fetch bets for the match")
                    return null
                }

                const json = await response.json()

                const tempBetsMatchWise = { }

                tempBetsMatchWise[matchId] = json

                setBetsMatchwise(tempBetsMatchWise)

            

            setShowOption(matchId)
        }
    }

    const setBet = async (index,matchId, option) => {

        if(showOption === matchId){
            setShowOption(null)
        }
        
        const data = { option }

        const response = await fetch(`/user/${userId}/events/${matchId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers:{
                'Content-Type' : 'application/json',
                'authorization': token
            }
        })

        const json = await response.json()

        if (!response.ok){
            console.log("Couldn't set your bet")
            return
        }
        await Promise.all(setMatches(prevMatches => {
            const updatedMatches = [...prevMatches];
            updatedMatches[index] = { ...updatedMatches[index], selected: option };
            return updatedMatches;
        }))

       
    }

    const cancelBet = async (index,matchId) => {

        if(showOption === matchId){
            setShowOption(null)
            console.log("showOption is reset")
        }

        const data = {
            'option' : -1
        }

        const response = await fetch(`/user/${userId}/events/${matchId}`,{
            method : 'PUT',
            body   : JSON.stringify(data),
            headers: {
                'Content-Type' : 'application/json',
                'authorization': token
            }
        })

        const json = await response.json()

        if(!response.ok){
            console.log("Couldn't update your bet")
            return 
        }


        
            setMatches(prevMatches => {
            const updatedMatches = [...prevMatches];
            updatedMatches[index] = { ...updatedMatches[index], selected: null };
            return updatedMatches;
        })

       
    }

    return (
        <div className='container-fluid'>
            <ListGroup className=' '>

                {
                    matches && matches.map((match,index) => {
                        { console.log(match.name) }
                        return <ListGroup.Item key={index}>
                            <div  className='card '  >
                                <div className='card-body container-fluid' >
                                    <h4 className='card-title text-center'>{match.name}</h4>
                                    <div className='container-fluid'>
                                        <div className='row'>
                                            <div className='col-md-4'></div>
                                            <div className='col-md-4'>
                                        <div className='text-center'>{formatDate(match.cutoff)}</div>
                                        <div className='text-center'>{formatTime(match.cutoff)}</div>
                                        </div>
                                        <div className='col-md-4'>
                                        {match.selected &&
                                            <div className='d-flex justify-content-end'>
                                                <button
                                                    className='btn m-2 py-2 px-3 btn-danger'
                                                    onClick={() => cancelBet(index, match.id)}
                                                >
                                                    Cancel bet
                                                </button>
                                            </div>
                                        }
                                        </div>
                                        </div>
                                        </div>
                                    <div className='d-flex justify-content-between'>
                                        <div className='d-flex flex-fill text-center justify-content-center'>
                                            <button
                                                className={`1 d-block d-sm-none btn mx-2 mr-2 px-5 py-3  ${match.selected === match.options[0] ? 'btn-success' : 'btn-warning'}`}
                                                onClick={() => match.selected === match.options[0] ? null : setBet(index,match.id, match.options[0])}
                                            >
                                                {options[match.options[0]]?.nickname}
                                            </button>

                                            <button
                                                className={` d-none d-sm-block btn mx-2 mr-2 px-5 py-3  ${match.selected === match.options[0] ? 'btn-success' : 'btn-warning'}`}
                                                onClick={() => match.selected === match.options[0] ? null : setBet(index,match.id, match.options[0])}
                                            >
                                                {options[match.options[0]]?.name}
                                            </button>
                                        </div>
                                        
                                        <div className='d-flex flex-fill text-center justify-content-center'>
                                            <button
                                                className={` d-block d-sm-none btn mx-2 mr-2 px-5 py-3  ${match.selected === match.options[1] ? 'btn-success' : 'btn-warning'}`}
                                                onClick={() => match.selected === match.options[1] ? null : setBet(index,match.id, match.options[1])}
                                            >
                                                {options[match.options[1]]?.nickname}
                                            </button>

                                            <button
                                                className={` d-none d-sm-block btn mx-2 mr-2 px-5 py-3  ${match.selected === match.options[1] ? 'btn-success' : 'btn-warning'}`}
                                                onClick={() => match.selected === match.options[1] ? null : setBet(index,match.id, match.options[1])}
                                            >
                                                {options[match.options[1]]?.name}
                                            </button>
                                        </div>
                                    </div>

                                    {showOption !== match.id && <span className='btn' style={{ display: 'block', width: '100%', height: '100%', fontWeight: 'bold' }} onClick={() => handleButtonClick(true, match.id)}>
                                        Show Bets
                                        {/* &#9660; */}
                                    </span>}

                                    {showOption === match.id &&
                                        <>
                                            <div className='d-flex justify-content-between'>
                                                <table className='table'>
                                                    <tbody>
                                                        {
                                                            betsMatchwise[match.id][match.options[0]]?.map(
                                                                (_user) =>

                                                                (
                                                                    <tr className='text-center'><td>
                                                                        {_user.name}
                                                                    </td></tr>
                                                                )
                                                            )
                                                        }
                                                    </tbody>
                                                </table>
                                                <table className='table'>
                                                    <tbody>
                                                        {
                                                            betsMatchwise[match.id][match.options[1]]?.map(
                                                                (_user) =>
                                                                (
                                                                    <tr className='text-center'><td>
                                                                        {_user.name}
                                                                    </td></tr>
                                                                )
                                                            )
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                            <span className='btn' style={{ display: 'block', width: '100%', height: '100%', fontWeight: 'bold' }} onClick={() => handleButtonClick(false, match.id)}>
                                                Hide
                                                {/* &#9660; */}
                                            </span>
                                        </>}
                                </div>
                            </div>
                        </ListGroup.Item>
                    })}


            </ListGroup>


        </div>
    )


}

export default MatchList