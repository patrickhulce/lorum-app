import React, {useState} from 'react'
import {useLeague, saveLeague, LoadingState} from '../hooks/firebase-hooks'
import {Loader} from '../components/loader'
import {ILeagueRouteParams} from '../types'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import {makeStyles} from '@material-ui/core/styles'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(theme => ({
  form: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  errorDisplay: {
    backgroundColor: theme.palette.error.dark,
    marginBottom: 10,
  },
}))

const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, '')

export function PlayersNew(props: ILeagueRouteParams) {
  const classes = useStyles()
  const [playerName, setPlayerName] = useState('')
  const [loadingState, league, setLoadingState] = useLeague(props.match.params.slug)
  if (!league) return <Loader loadingState={loadingState} />
  const normalizedPlayer = normalize(playerName)
  const normalizedPlayers = league.players.map(normalize)
  const matchedPlayers = league.players.filter(p => normalize(p).includes(normalizedPlayer)).sort()

  let disabledMessage: string | undefined
  if (normalizedPlayers.includes(normalizedPlayer)) {
    disabledMessage = 'Player already exists!'
  }

  return (
    <>
      <Typography variant="h4" style={{marginBottom: 15}}>
        Add a Player
      </Typography>
      <Paper>
        <form
          className={classes.form}
          onSubmit={async e => {
            e.preventDefault()
            setLoadingState(LoadingState.Loading)
            await saveLeague({...league, players: [...league.players, playerName]})
            props.history.goBack()
          }}
        >
          <TextField
            label="Player Name"
            margin="normal"
            variant="outlined"
            placeholder="Attila Bardos"
            value={playerName}
            onChange={e => setPlayerName(e.target.value)}
          />
          {disabledMessage && (
            <SnackbarContent className={classes.errorDisplay} message={disabledMessage} />
          )}
          <Button type="submit" variant="contained" color="primary" disabled={!!disabledMessage}>
            Add Player
          </Button>
        </form>
      </Paper>
      <Typography variant="body1" style={{margin: 10}}>
        Existing Players
      </Typography>
      <ul>
        {matchedPlayers.slice(0, 10).map(player => (
          <li key={player}>{player}</li>
        ))}
      </ul>
    </>
  )
}
