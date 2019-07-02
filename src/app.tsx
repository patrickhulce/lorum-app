import React from 'react'
import './app.css'
import {BrowserRouter as Router, Route, Link, Switch, Redirect} from 'react-router-dom'
import {LeagueList} from './routes/league-list'

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
          <Route path="/leagues" exact component={LeagueList} />
          <Redirect to="/leagues" />
        </Switch>
      </div>
    </Router>
  )
}

export default App
