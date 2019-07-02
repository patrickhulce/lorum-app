import React from 'react'
import {useLeague} from '../hooks/firebase-hooks'
import {Loader} from '../components/loader'
import {Link} from 'react-router-dom'
import {IRouteMatch} from '../types'

export interface ILeagueViewProps {
  match: IRouteMatch<{slug: string}>
}

export function LeagueView(props: ILeagueViewProps) {
  const [loadingState, league] = useLeague(props.match.params.slug)
  if (!league) return <Loader loadingState={loadingState} />

  return (
    <>
      <Link to="./games/list">View Games</Link>
      <Link to="./games/new">Start a Game</Link>
      <Link to="./players/new">Add Players</Link>
      <pre>{JSON.stringify(league, null, 2)}</pre>
    </>
  )
}
