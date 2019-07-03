import React from 'react'
import {useLeague} from '../hooks/firebase-hooks'
import {Loader} from '../components/loader'
import {Link} from 'react-router-dom'
import {IRouteMatch} from '../types'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'

export interface ILeagueViewProps {
  match: IRouteMatch<{slug: string}>
}

export function LeagueView(props: ILeagueViewProps) {
  const [loadingState, league] = useLeague(props.match.params.slug)
  if (!league) return <Loader loadingState={loadingState} />

  return (
    <>
      <Typography variant="h3" style={{marginBottom: 15}}>
        {league.name}
      </Typography>
      <Paper>
        <List component="nav">
          <Link to="./games/new">
            <ListItem button>
              <ListItemText primary="Start a Game" />
            </ListItem>
          </Link>
          <Link to="./games/list">
            <ListItem button>
              <ListItemText primary="View Games" />
            </ListItem>
          </Link>
          <Link to="./players/new">
            <ListItem button>
              <ListItemText primary="Add Players" />
            </ListItem>
          </Link>
        </List>
      </Paper>
    </>
  )
}
