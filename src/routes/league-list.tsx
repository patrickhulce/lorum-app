import React from 'react'
import {useLeagues} from '../hooks/firebase-hooks'

export function LeagueList() {
  const [loadingState, leagues] = useLeagues()
  if (!leagues) {
    return <h1>Loading {loadingState}...</h1>
  }

  return (
    <ul>
      {leagues.map(league => (
        <li key={league.slug}>{league.name}</li>
      ))}
    </ul>
  )
}
