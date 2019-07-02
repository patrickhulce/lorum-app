import React from 'react'
import {useLeague} from '../hooks/firebase-hooks'

export interface ILeagueViewProps {
  match: {params: {slug: string}}
}

export function LeagueView(props: ILeagueViewProps) {
  const [loadingState, league] = useLeague(props.match.params.slug)
  if (!league) {
    return <h1>Loading {loadingState}...</h1>
  }

  return <pre>{JSON.stringify(league, null, 2)}</pre>
}
