import React, {useState} from 'react'
import {useLeague, LoadingState, createGame} from '../hooks/firebase-hooks'
import {Loader} from '../components/loader'
import {ILeagueRouteParams} from '../types'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import {makeStyles} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import {Link} from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(1),
  },
  formControl: {
    marginBottom: theme.spacing(1),
    display: 'flex',
  },
}))

const PlayerSelect = (props: {
  idx: number
  player: string
  setPlayer: (s: string) => void
  players: string[]
}) => {
  const classes = useStyles()
  return (
    <FormControl className={classes.formControl}>
      <InputLabel htmlFor={`player${props.idx}`}>Player {props.idx}</InputLabel>
      <Select
        value={props.player}
        onChange={e => props.setPlayer(e.target.value as string)}
        inputProps={{
          name: `player${props.idx}`,
          id: `player${props.idx}`,
        }}
      >
        {props.players.map(player => (
          <MenuItem key={player} value={player}>
            {player}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export function GamesNew(props: ILeagueRouteParams) {
  const classes = useStyles()
  const [player1, setPlayer1] = useState('')
  const [player2, setPlayer2] = useState('')
  const [player3, setPlayer3] = useState('')
  const [player4, setPlayer4] = useState('')
  const [isRanked, setIsRanked] = useState(true)
  const [loadingState, league, setLoadingState] = useLeague(props.match.params.slug)
  if (!league) return <Loader loadingState={loadingState} />
  const players = league.players.slice().sort()
  const canStart = new Set([player1, player2, player3, player4].filter(Boolean)).size === 4

  return (
    <>
      <Paper className={classes.paper}>
        <Typography variant="h5" style={{marginBottom: 5}}>
          Start a Game
        </Typography>
        <form
          onSubmit={async e => {
            e.preventDefault()
            setLoadingState(LoadingState.Loading)
            const game = await createGame({
              leagueId: league.id,
              player1,
              player2,
              player3,
              player4,
              isRanked,
              scores: [],
            })

            props.history.push(`./${game.id}/view`)
          }}
        >
          <PlayerSelect players={players} player={player1} setPlayer={setPlayer1} idx={1} />
          <PlayerSelect players={players} player={player2} setPlayer={setPlayer2} idx={2} />
          <PlayerSelect players={players} player={player3} setPlayer={setPlayer3} idx={3} />
          <PlayerSelect players={players} player={player4} setPlayer={setPlayer4} idx={4} />

          <FormControlLabel
            className={classes.formControl}
            control={
              <Switch
                checked={isRanked}
                onChange={e => setIsRanked(!!e.target.checked)}
                color="primary"
              />
            }
            label="Ranked?"
          />
          <FormControl style={{display: 'block', marginBottom: 10, textDecoration: 'underline'}}>
            <Link to="../players/new">Can't find your name? Add a player</Link>
          </FormControl>
          <FormControl>
            <Button variant="contained" color="primary" type="submit" disabled={!canStart}>
              Start
            </Button>
          </FormControl>
        </form>
      </Paper>
    </>
  )
}
