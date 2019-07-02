import React from 'react'
import {useLeagues} from '../hooks/firebase-hooks'
import {Link} from 'react-router-dom'
import {Loader} from '../components/loader'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Paper from '@material-ui/core/Paper'
import {Typography} from '@material-ui/core'

export function LeagueList() {
  const [loadingState, leagues] = useLeagues()
  if (!leagues) return <Loader loadingState={loadingState} />

  return (
    <>
      <Typography variant="h3" style={{marginBottom: 15}}>
        Leagues
      </Typography>
      <Paper>
        <List component="nav">
          {leagues.map(league => (
            <Link to={`/leagues/${league.slug}/view`}>
              <ListItem button key={league.slug}>
                <ListItemText primary={league.name} />
              </ListItem>
            </Link>
          ))}
        </List>
      </Paper>
    </>
  )
}
