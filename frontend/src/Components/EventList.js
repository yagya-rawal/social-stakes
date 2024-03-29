import React, { useState } from 'react'
import ListGroup from 'react-bootstrap/ListGroup';
import { useEffect } from 'react'

const host = 'http://localhost:3000/'
const token = localStorage.getItem('token')
const userId = localStorage.getItem('userId')

const EventList = () => {

    const [matches, setMatches] = useState([])
    const [options, setOptions] = useState({})
    const [cutoffs, setCutoffs] = useState({})
    const [selectedOptions, setSelectedOptions] = useState({})
    const [betsMatchwise, setBetsMatchwise ] = useState({})

    const expandOptionName = {
        'CSK' : 'Chennai Super Kings',
        'MI' : 'Mumbai Indians',
        'DC' : 'Delhi Capitals',
        'SRH' : 'Sunrisers Hyderabad',
        'LSG' : 'Lucknow Super Giants',
        'KKR' : 'Kolkata Knight Riders',
        'RCB' : 'Royal Challengers Bangalore',
        'PBKS': 'Punjab Kings',
        'RR'  : 'Rajasthan Royals',
        'GT'  : 'Gujarat Titans'
    }


    // Function to format date
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





    const fetchBetsMatchwise = async () => {
        try {
            // Create an array of promises for each fetch operation
            const fetchPromises = matches.map(async match => {
                // console.log("\n eventId:: " + match._id);
                const response = await fetch(`/user/${userId}/event/${match._id}/bets`, {
                    method: 'GET',
                    headers: {
                        'authorization': token
                    }
                });
    
                if (!response.ok) {
                    // Handle the case when the response is not OK
                    console.error('Failed to fetch bets for match:', match._id);
                    return null; // Return null to keep track of failed requests
                }
    
                const json = await response.json();
                return { matchId: match._id, data: json }; // Return an object with matchId and data
            });
    
            // Wait for all fetch operations to complete
            const results = await Promise.all(fetchPromises);
    
            // Filter out null values (failed requests)
            const successfulResults = results.filter(result => result !== null);
    
            // Update state with the successful results
            setBetsMatchwise(previousState => {
                const newState = { ...previousState };
                successfulResults.forEach(result => {
                    newState[result.matchId] = result.data;
                });
                // console.log(newState)
                return newState;
            });
        } catch (error) {
            console.error('Error fetching bets matchwise:', error);
        }
    };

    
    useEffect(() => {


        const fetchOptions = async () => {
            const tempOptions = { ...options };

            for (const match of matches) {
                for (const option of match.options) {
                    if (!tempOptions[option]) {
                        // console.log("api called " + option);
                        const response = await fetch(`/user/${userId}/option/${option}`, {
                            method: 'GET',
                            headers: {
                                'authorization': token
                            }
                        });
                        const json = await response.json();
                        tempOptions[option] = json.nickname;
                    }
                }
            }

            setOptions(tempOptions);
        };

        fetchOptions()

        const setCutoffTime = () => {

            const tempCutoffs = { ...cutoffs }

            matches.map(match => {

                const tempCutoff = new Date(match.cutoff)

                tempCutoffs[match._id] = tempCutoff

            })

            setCutoffs(tempCutoffs)

        }

        setCutoffTime()
        fetchBetsMatchwise()

    }, [matches])

    useEffect(() => {
        const fetchSelectedOptions = async () => {

            const response = await fetch(`/user/${userId}/bets`, {
                method: 'GET',
                headers: {
                    'authorization': token
                }
            })

            if (response.ok) {

                try {
                    const data = await response.json();
                    
                    
                    const tmp = {...selectedOptions}

                    data.map(match => {
                        tmp[match.eventId]=match.optionId
                        console.log(tmp)
                    })
                    
                    setSelectedOptions(tmp)

                } catch (error) {
                    console.error('Error processing response:', error);
                }

            }
        }

        fetchSelectedOptions()

    }, [matches])

    useEffect(() => {
        console.log(selectedOptions);
    }, [selectedOptions]);
    useEffect(() => {

        const fetchMatches = async () => {
            const response = await fetch(`/user/${userId}/events/new`, {
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


    const setBet = async (matchId, option, otherOption) => {

        // console.log(option)

        const data = { option }
        const response = await fetch(`/user/${userId}/events/${matchId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'authorization': token
            }

        })

        const json = response.json()

        if (response.ok) {
            const tempSelectedOptions = { ...selectedOptions }

            if(option != -1){
            if(tempSelectedOptions[matchId] == otherOption)
                {
                    betsMatchwise[matchId][otherOption]--
                }

            if(tempSelectedOptions[matchId] != option)
            {
                betsMatchwise[matchId][option]++
            }
            }

            if(option == -1){
                
                if(betsMatchwise[matchId][tempSelectedOptions[matchId]])
                    betsMatchwise[matchId][tempSelectedOptions[matchId]]--

            }

            if (option == -1)
                tempSelectedOptions[matchId] = null

            else
                tempSelectedOptions[matchId] = option

            setSelectedOptions(tempSelectedOptions)

            
            
        }

    }


    return (
        <>
            <ListGroup >

                {console.log(token)}

                {matches.map((team) => (
                    <ListGroup.Item >
                        <div key={team.id} className="card">
                            <div className="card-body container-fluid " >
                                <h4 className="card-title"> {team.name}</h4>
                                <h5>{formatDate(cutoffs[team._id])}</h5>
                                <h6>{formatTime(cutoffs[team._id])}</h6>
                                <div className='d-flex justify-content-between'>
                                    <button
                                        className={`flex-grow-1 d-block d-sm-none btn mx-2 mr-2 p-3 ${selectedOptions[team._id] == team.options[0] ? 'btn-success' : 'btn-warning'}`}
                                        onClick={() => setBet(team._id, team.options[0], team.options[1])}
                                    >
                                        {options[team.options[0]]}

                                    </button>
                                    <button
                                        className={`d-none d-sm-block btn mx-2 mr-2 px-5 py-3 ${selectedOptions[team._id] == team.options[0] ? 'btn-success' : 'btn-warning'}`}
                                        onClick={() => setBet(team._id, team.options[0], team.options[1])}
                                    >
                                        {expandOptionName[options[team.options[0]]]}

                                    </button>
                                    {
                                        selectedOptions[team._id] &&
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => setBet(team._id, -1)}
                                        >
                                            Cancel bet
                                        </button>

                                    }

                                    <button
                                        className={`flex-grow-1 d-block d-sm-none btn mx-2 mr-2 p-3 ${selectedOptions[team._id] == team.options[1] ? 'btn-success' : 'btn-warning'}`}
                                        onClick={() => setBet(team._id, team.options[1], team.options[0])}
                                    >
                                        {options[team.options[1]]}
                                    </button>
                                    <button
                                        className={`d-none d-sm-block btn mx-2 mr-2 px-5 py-3 ${selectedOptions[team._id] == team.options[1] ? 'btn-success' : 'btn-warning'}`}
                                        onClick={() => setBet(team._id, team.options[1], team.options[0])}
                                    >
                                        {expandOptionName[options[team.options[1]]]}
                                    </button>

                                    

                                </div>
                                <div className='d-flex justify-content-between my-1'>
                                {betsMatchwise && betsMatchwise[team._id] && <div
                                        className={`  mr-2 p-3 `}
                                    >

                                        {betsMatchwise[team._id]['option1']}
                                        
                                    </div>
                                }
                                   
                                        <div
                                            className=' mr-2 p-3 text-dark '
                                            >
                                            Bets Placed
                                        </div>
                                        {betsMatchwise && betsMatchwise[team._id] &&
                                    <div
                                        className={`  mr-2 p-3 `}
                                    >
                                    {betsMatchwise[team._id]['option2']}
                                    </div>

                                        }   

                                </div>
                            </div>
                        </div>

                    </ListGroup.Item>
                ))}



            </ListGroup>
        </>
    )
}

export default EventList