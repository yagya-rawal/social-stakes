import React from 'react'

import Header from '../../Components/Navbar'
import EventList from '../../Components/EventList'
import LeaderBoard from '../../Components/LeaderBoard'
import { useNavigate } from 'react-router-dom'

const Home = () => {

  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('userId')
  const userName = localStorage.getItem('userName')

  const navigate = useNavigate()

  if(!token || !userId || !userName){
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