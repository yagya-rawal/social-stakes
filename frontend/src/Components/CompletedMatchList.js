import React, { useEffect, useState } from 'react'
import { ListGroup } from 'react-bootstrap'

const CompletedMatchList = () => {

    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')

    const [matches, setMatches] = useState([])
    const [options, setOptions] = useState([])
    const [showOption, setShowOption] = useState(null)
    const [betsMatchwise, setBetsMatchwise] = useState([])

    function formatDate(date) {
        if (date) {
            date = new Date(date)
            const temp = { year: 'numeric', month: 'long', day: 'numeric' };
            return date.toLocaleDateString(undefined, temp);
        }
    }

    const handleButtonClick = async (flag, matchId) =>{
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

            const tempBetsMatchWise = {}

            tempBetsMatchWise[matchId] = json

            setBetsMatchwise(tempBetsMatchWise)

            setShowOption(matchId)
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

    const fetchMatches = async () => {

        console.log("fetchMatches api hit in CompletedMatchList")


        const response = await fetch(`/user/${userId}/events/completed`, {
            method: 'GET',
            headers: {
                'authorization': token
            }
        })
        const json = await response.json()
        if (!response.ok)
            return

        else {
            setMatches(json)
        }
    }

    useEffect(() => {
        fetchMatches()
        fetchOptions()
    }, [])


    return <>
        <div className='container-fluid'>
            <ListGroup>
                {
                    matches?.map((match, index) => {

                        return <ListGroup.Item key={index}>
                            <div className={`card border `}>
                                <div className='card-body container-fluid'>
                                    <div className='row'>
                                        <div className='col-md-4 text-center '>{formatDate(match.cutoff)}</div>

                                        <h3 className='col-md-4 card-title text-center'>{match.name}</h3>
                                        <div className='col-md-4 d-flex justify-content-center'>
                                            <div className={`${match.points < 0 ? ' text-danger' : 'text-success'} text-center `} style={{ 'fontWeight': 'bold' }}>{match.points}</div>
                                        </div>
                                    </div>
                                    <div className='container-fluid'>
                                        <div className='row'>
                                            <div className='col-md-4'></div>
                                            <div className='col-md-4 '>
                                                <div className='pt-2 d-flex justify-content-center'><div className='d-flex justify-content-center' style={{ 'fontWeight': 'bold' }}>winner:<div className='text-success mx-2'>{options[match.winner]?.nickname}</div></div> </div>
                                            </div>
                                        </div>
                                    </div>

                                    {showOption !== match.id && <span className='btn text-primary' style={{ display: 'block', width: '100%', height: '100%', fontWeight: 'bold'  }} onClick={() => handleButtonClick(true, match.id)}>
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
                                            <span className='btn text-primary' style={{ display: 'block', width: '100%', height: '100%', fontWeight: 'bold' }} onClick={() => handleButtonClick(false, match.id)}>
                                                Hide
                                                {/* &#9660; */}
                                            </span>
                                        </>}

                                </div>
                            </div>
                        </ListGroup.Item>
                    })
                }
            </ListGroup>
        </div>
    </>
}

export default CompletedMatchList