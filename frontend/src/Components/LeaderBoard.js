import React, { useEffect, useState } from 'react'

// const host = 'http://localhost:3000/'
const token = localStorage.getItem('token')
const userId = localStorage.getItem('userId')


const LeaderBoard = () => {


  const [leaderBoard, setLeaderBoard] = useState([])

  const leaderboardData = [
    { rank: 1, userName: 'User1', score: 1000 },
    { rank: 2, userName: 'User2', score: 900 },
    { rank: 3, userName: 'User3', score: 800 },
    // Add more data as needed
  ];

  const fetchLeaderBoard = async () => {
    const response = await fetch(`/user/${userId}/leaderboard`, {
      method: 'GET',
      headers: {
          'authorization': token
      }
    })

    const json = await response.json()

    if (response.ok) {

      console.log(json)

      setLeaderBoard(json)

    }
  }

  useEffect(() => {

    fetchLeaderBoard()

  }, [])

  return (
    <>
      <div className="container">
        <h2>Leaderboard</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Rank</th>
              <th scope="col">Username</th>
              <th scope="col">Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderBoard.map((entry,index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{entry.userName}</td>
                <td>{entry.currentScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default LeaderBoard