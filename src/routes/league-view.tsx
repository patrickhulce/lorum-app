import React from 'react'
import {useLeague} from '../hooks/firebase-hooks'
import {Loader} from '../components/loader'

export interface ILeagueViewProps {
  match: {params: {slug: string}}
}

export function LeagueView(props: ILeagueViewProps) {
  const [loadingState, league] = useLeague(props.match.params.slug)
  if (!league) return <Loader loadingState={loadingState} />

  return (
    <>
      <pre>{JSON.stringify(league, null, 2)}</pre>
    </>
  )
}
