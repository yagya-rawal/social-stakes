import { useEffect } from 'react'

const Home = () => {
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    const userName = localStorage.getItem('userName')

    return <>
    <div> MatchList </div>
    <div> LeaderBoard </div>
    <div> Completed Matchlist </div>
    </>
}

export default Home