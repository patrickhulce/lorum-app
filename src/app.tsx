import React from 'react'
import './app.css'
import {BrowserRouter as Router, Route, Link, Switch, Redirect} from 'react-router-dom'
import {LeagueList} from './routes/league-list'
import {LeagueView} from './routes/league-view'
import {PlayersNew} from './routes/players-new'

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about/">About</Link>
            </li>
            <li>
              <Link to="/users/">Users</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route exact path="/leagues" component={LeagueList} />
          <Route exact path="/leagues/:slug/view" component={LeagueView} />
          <Route exact path="/leagues/:slug/players/new" component={PlayersNew} />
          <Redirect to="/leagues" />
        </Switch>
      </div>
    </Router>
  )
}

export default App
