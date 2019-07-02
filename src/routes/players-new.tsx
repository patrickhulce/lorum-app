import React, {useState} from 'react'
import {useLeague, saveLeague, LoadingState} from '../hooks/firebase-hooks'
import {Loader} from '../components/loader'
import {Link} from 'react-router-dom'
import {ILeagueRouteParams} from '../types'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import ListItemText from '@material-ui/core/ListItemText'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import {makeStyles} from '@material-ui/core/styles'
import SnackbarContent from '@material-ui/core/SnackbarContent'

const useStyles = makeStyles(theme => ({
  form: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  errorDisplay: {
    backgroundColor: theme.palette.error.dark,
  },
}))

const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, '')

export function PlayersNew(props: ILeagueRouteParams) {
  const classes = useStyles()
  const [playerName, setPlayerName] = useState('')
  const [loadingState, league, setLoadingState] = useLeague(props.match.params.slug)
  if (!league) return <Loader loadingState={loadingState} />

  let disabledMessage: string | undefined
  if (league.players.some(p => normalize(p) === normalize(playerName))) {
    disabledMessage = 'Player already exists!'
  }

  return (
    <>
      <Paper>
        <List component="nav">
          <Link to="../view">
            <ListItem button>
              <ListItemIcon>
                <ArrowBackIcon />
              </ListItemIcon>
              <ListItemText primary="Back to League" />
            </ListItem>
          </Link>
        </List>
      </Paper>
      <Paper>
        <form
          className={classes.form}
          onSubmit={async () => {
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
    </>
  )
}
