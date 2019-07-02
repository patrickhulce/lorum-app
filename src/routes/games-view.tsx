import React, {useState} from 'react'
import {useLeague, LoadingState, createGame, useGame} from '../hooks/firebase-hooks'
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

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(1),
  },
}))

export function GamesView(props: ILeagueRouteParams<{slug: string; gameId: string}>) {
  const classes = useStyles()
  const [loadingState, game, setLoadingState] = useGame(props.match.params.gameId)
  if (!game || loadingState !== LoadingState.Loaded) return <Loader loadingState={loadingState} />

  return (
    <>
      <Paper className={classes.paper}>
        <Typography variant="h5" style={{marginBottom: 5}}>
          Game with {game.player1}, {game.player2}
        </Typography>
      </Paper>
    </>
  )
}
