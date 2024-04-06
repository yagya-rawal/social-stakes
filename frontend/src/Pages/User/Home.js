import React, { useEffect, useState } from 'react'

import Header from '../../Components/Navbar'
import EventList from '../../Components/EventList'
import LeaderBoard from '../../Components/LeaderBoard'
import { useNavigate } from 'react-router-dom'
import MatchList from '../../Components/MatchList'
import { Button } from 'react-bootstrap'
import CompletedMatchList from '../../Components/CompletedMatchList'

const Home = () => {

  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('userId')
  const userName = localStorage.getItem('userName')
  const [previousMatches,setPreviousMatches] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    if (!token || !userId || !userName) {
      // navigate('/login')
    }
  }, [])

  return (
    <>
      <div className="container-fluid">

        <Header />

        <div className="row">

          <div className="col-md-3">
            <LeaderBoard />
          </div>

          <div className="col-md-9">
            
          <div className='d-flex justify-content-end'>
          <button type='button'
           className={`btn ${previousMatches ? 'btn-outline-primary' : 'btn-primary'} p-2 m-1`} 
           onClick={() => {
            if(previousMatches)
              setPreviousMatches(false)
            }}> 
           Current/Upcoming
           </button>
          <button type='button'
           className={`btn ${!previousMatches ? 'btn-outline-primary' : 'btn-primary'} p-2 m-1`} 
           onClick={() => {
            if(!previousMatches)
              setPreviousMatches(true)
            }} > 
           Completed
           </button>
          </div>
            {previousMatches && <><CompletedMatchList/></>}
            {!previousMatches && <>
            <MatchList /></>}
          </div>

        </div>

      </div>

    </>
  )
}

export default Home