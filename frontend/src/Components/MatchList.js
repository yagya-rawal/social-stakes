import React, { useEffect, useState } from 'react'
import { ListGroup } from 'react-bootstrap'

const token = localStorage.getItem('token')
const userId = localStorage.getItem('userId')

const MatchList = () => {

    
    const [matches, setMatches] = useState([
        {
            'name': 'CSK vs RCB',
            'cutoff': new Date(),
            'options': [
                'RCB', 'CSK'
            ],
            'selected': 'RCB'
        }
    ])

    function formatDate(date) {
        if (date) {
            const temp = { year: 'numeric', month: 'long', day: 'numeric' };
            return date.toLocaleDateString(undefined, temp);
        }
    }

    // Function to format time
    function formatTime(date) {
        if (date) {
            const temp = { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true };
            return date.toLocaleTimeString(undefined, temp);
        }
    }


    useEffect(() => {
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

             
                // console.log("fetch api : " + json)
                setMatches(json)

            }
        }

        fetchMatches()
    }, [])


    return (
        <div className='container-fluid'>
            <ListGroup className=' '>

                {
                    matches.map((match) => {
                        { console.log(match.name) }
                        return <ListGroup.Item>
                            <div key={match.id} className='card '  >
                                <div className='card-body container-fluid' >
                                    <h4 className='card-title text-center'>{match.name}</h4>
                                    <div className='text-center'>{formatDate(match.cutoff)}</div>
                                    <div className='text-center'>{formatTime(match.cutoff)}</div>
                                    <div className='d-flex justify-content-between'>

                                        <button
                                            className={`btn m-2 py-2 px-3 ${match.selected === match.options[0] ? 'btn-success' : 'btn-warning'}`}
                                        >
                                            {match.options[0]}
                                        </button>

                                        {match.selected &&
                                            <button
                                                className='btn m-2 py-2 px-3 btn-danger'
                                            >
                                                Cancel bet
                                            </button>
                                        }
                                        <button
                                            className={`btn m-2 px-3 py-2 ${match.selected === match.options[1] ? 'btn-success' : 'btn-warning'}`}
                                        >
                                            {match.options[1]}
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </ListGroup.Item>
                    })}


            </ListGroup>

                    
        </div>
    )


}

export default MatchList