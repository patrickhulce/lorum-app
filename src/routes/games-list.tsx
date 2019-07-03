import React from 'react'
import {useLeague, useGames} from '../hooks/firebase-hooks'
import {Loader} from '../components/loader'
import {ILeagueRouteParams} from '../types'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import {makeStyles} from '@material-ui/core/styles'
import {Link} from 'react-router-dom'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(1),
  },
}))

export function GamesList(props: ILeagueRouteParams) {
  const classes = useStyles()
  const [loadingState, league] = useLeague(props.match.params.slug)
  const [loadingStateB, games] = useGames(league && league.id)
  if (!league) return <Loader loadingState={loadingState} />
  if (!games) return <Loader loadingState={loadingStateB} />

  return (
    <>
      <Paper className={classes.paper}>
        <Typography variant="h5" style={{marginBottom: 5}}>
          Games
        </Typography>
        <List component="nav">
          {games.map(game => (
            <Link key={game.id} to={`./${game.id}/view`}>
              <ListItem button key={game.id}>
                <ListItemText primary={`Game with ${game.player1}`} />
              </ListItem>
            </Link>
          ))}
        </List>
      </Paper>
    </>
  )
}
