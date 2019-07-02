import React from 'react'
import {useLeagues} from '../hooks/firebase-hooks'
import {Link} from 'react-router-dom'

export function LeagueList() {
  const [loadingState, leagues] = useLeagues()
  if (!leagues) {
    return <h1>Loading {loadingState}...</h1>
  }

  return (
    <ul>
      {leagues.map(league => (
        <li key={league.slug}>
          <Link to={`/leagues/${league.slug}`}>{league.name}</Link>
        </li>
      ))}
    </ul>
  )
}
