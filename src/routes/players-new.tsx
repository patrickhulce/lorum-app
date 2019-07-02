import React, {useState} from 'react'
import {useLeague, saveLeague, LoadingState} from '../hooks/firebase-hooks'
import {Loader} from '../components/loader'
import {Link} from 'react-router-dom'
import {ILeagueRouteParams} from '../types'

export function PlayersNew(props: ILeagueRouteParams) {
  const [playerName, setPlayerName] = useState('')
  const [loadingState, league, setLoadingState] = useLeague(props.match.params.slug)
  if (!league) return <Loader loadingState={loadingState} />

  return (
    <>
      <Link to="../view">Back to League</Link>
      <pre>{JSON.stringify(league.players, null, 2)}</pre>
      <input
        type="text"
        placeholder="Player name"
        value={playerName}
        onChange={e => setPlayerName(e.target.value)}
      />
      <button
        type="button"
        onClick={async () => {
          setLoadingState(LoadingState.Loading)
          await saveLeague({...league, players: [...league.players, playerName]})
          props.history.goBack()
        }}
      >
        Add Player
      </button>
    </>
  )
}
