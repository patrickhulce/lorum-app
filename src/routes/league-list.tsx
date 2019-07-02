import React from 'react'
import {useLeagues} from '../hooks/firebase-hooks'
import {Link} from 'react-router-dom'
import {Loader} from '../components/loader'

export function LeagueList() {
  const [loadingState, leagues] = useLeagues()
  if (!leagues) return <Loader loadingState={loadingState} />

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
