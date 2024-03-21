import React from 'react'

import Header from '../../Components/Navbar'
import EventList from '../../Components/EventList'
import LeaderBoard from '../../Components/LeaderBoard'
import { useNavigate } from 'react-router-dom'

const Home = () => {

  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  if(!token){
    navigate('/login')
  }

  return (
    <>
      <div className="container-fluid">

        <Header />

        <div className="row">

          <div className="col-md-4">
            <LeaderBoard />
          </div>

          <div className="col-md-8">
            <EventList />
          </div>

        </div>

      </div>





    </>
  )
}

export default Home