import React from 'react'
import {useLeagues} from '../hooks/firebase-hooks'
import {Link} from 'react-router-dom'
import {Loader} from '../components/loader'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import DashboardIcon from '@material-ui/icons/Dashboard'
import Paper from '@material-ui/core/Paper'

export function LeagueList() {
  const [loadingState, leagues] = useLeagues()
  if (!leagues) return <Loader loadingState={loadingState} />

  return (
    <Paper>
      <List component="nav">
        <ListItem button>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        {leagues.map(league => (
          <Link to={`/leagues/${league.slug}/view`}>
            <ListItem button key={league.slug}>
              <ListItemText primary={league.name} />
            </ListItem>
          </Link>
        ))}
      </List>
    </Paper>
  )
}
