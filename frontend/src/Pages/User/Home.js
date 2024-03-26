import React, { useEffect } from 'react'

import Header from '../../Components/Navbar'
import EventList from '../../Components/EventList'
import LeaderBoard from '../../Components/LeaderBoard'
import { useNavigate } from 'react-router-dom'
import MatchList from '../../Components/MatchList'

const Home = () => {

  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('userId')
  const userName = localStorage.getItem('userName')

  const navigate = useNavigate()

  useEffect(() => {
    if (!token || !userId || !userName) {
      navigate('/login')
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
            <MatchList />
          </div>

        </div>

      </div>

    </>
  )
}

export default Home