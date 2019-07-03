import React, {useState} from 'react'
import * as _ from 'lodash'
import {LoadingState, useGame, saveGame} from '../hooks/firebase-hooks'
import {Loader} from '../components/loader'
import {ILeagueRouteParams, IGame, Hand, IScoreEntry} from '../types'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import {makeStyles} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import clsx from 'clsx'
import {FormControl, FormLabel} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  hand: {
    display: 'flex',
    flexDirection: 'row',
    height: 25,
    alignItems: 'center',
  },
  lastHandOfRound: {
    borderTop: `1px solid ${theme.palette.primary.main}`,
    borderBottom: `1px solid ${theme.palette.primary.main}`,
  },
  handScore: {
    width: '25%',
    textAlign: 'center',
  },
  handScoreBomb: {
    border: `1px solid ${theme.palette.primary.main}`,
    padding: 1,
  },
  activeButton: {
    backgroundColor: [[theme.palette.primary.main], '!important'] as any,
    color: [[theme.palette.primary.contrastText], '!important'] as any,
  },
}))

function getCurrentRoundAndHand(game: IGame): [number, Hand] {
  if (!game.scores.length) return [1, Hand.Hearts]
  if (game.scores.length === 32) return [-1, Hand.Hearts]

  const maxRound = Math.max(...game.scores.map(s => s.round))
  const maxHand = Math.max(...game.scores.filter(game => game.round === maxRound).map(s => s.hand))
  if (maxHand === Hand.SevenUp) return [maxRound + 1, Hand.Hearts]
  return [maxRound, maxHand + 1]
}

function getHandDisplayName(hand: Hand): string {
  return _.startCase(Object.keys(Hand).find(h => (Hand as any)[h] === hand)!)
}

function getPlayerFirstName(name: string): string {
  const parts = name.split(/\s+/g)
  if (parts.length > 2) return parts.slice(0, -1).join(' ')
  return parts[0]
}

function getPlayerDisplayName(name: string, allNames: string[]): string {
  const firstName = getPlayerFirstName(name)
  const otherFirstnames = allNames.filter(n => n !== name).map(getPlayerFirstName)
  if (!otherFirstnames.filter(name => name === firstName).length) return firstName

  let longestDistinguishable = ''
  for (let i = 0; i < name.length; i++) {
    longestDistinguishable = firstName.slice(0, i)
    if (otherFirstnames.every(n => !n.startsWith(longestDistinguishable))) break
  }

  return longestDistinguishable
}

function isValidScoreCombination(currentHand: Hand, scores: number[]): boolean {
  const totalValues = _.sum(scores)
  const numberOfTens = scores.filter(s => s === 10).length
  const isMoonShot = totalValues === 30 && numberOfTens === 3
  switch (currentHand) {
    case Hand.Hearts:
    case Hand.Each:
      return totalValues === 8 || isMoonShot
    case Hand.Uppers:
      return totalValues === 10 || isMoonShot
    case Hand.Last:
    case Hand.RedKing:
    case Hand.BabyBlue:
      return totalValues === 10 && numberOfTens === 1
    case Hand.SevenUp:
    case Hand.Quartet:
      return scores.filter(s => s === 0).length === 1 && scores.filter(s => s > 8).length === 0
  }
}

const HandDisplay = (props: {score: IScoreEntry}) => {
  const score = props.score
  const classes = useStyles()
  return (
    <div
      className={clsx(classes.hand, {
        [classes.lastHandOfRound]: score.hand === Hand.SevenUp,
      })}
    >
      <div className={clsx(classes.handScore)}>
        <span className={clsx({[classes.handScoreBomb]: score.player1 === 10})}>
          {score.player1}
        </span>
      </div>
      <div className={clsx(classes.handScore)}>
        <span className={clsx({[classes.handScoreBomb]: score.player2 === 10})}>
          {score.player2}
        </span>
      </div>
      <div className={clsx(classes.handScore)}>
        <span className={clsx({[classes.handScoreBomb]: score.player3 === 10})}>
          {score.player3}
        </span>
      </div>
      <div className={clsx(classes.handScore)}>
        <span className={clsx({[classes.handScoreBomb]: score.player4 === 10})}>
          {score.player4}
        </span>
      </div>
    </div>
  )
}

const ButtonScoreSet = (props: {value: number; setValue: (x: number) => void}) => {
  const classes = useStyles()
  return (
    <ButtonGroup size="small" style={{width: '100%'}}>
      {_.range(0, 11).map(number => {
        return (
          <Button
            key={number}
            onClick={() => props.setValue(number)}
            style={{padding: 0, minHeight: 25, minWidth: 25, flexGrow: 1}}
            className={clsx({
              [classes.activeButton]: props.value === number,
            })}
          >
            {number}
          </Button>
        )
      })}
    </ButtonGroup>
  )
}

const RegularScoreSet = (props: {players: Array<[string, number, (x: number) => void]>}) => {
  return (
    <>
      {props.players.map(([playerName, value, setValue]) => {
        return (
          <FormControl key={playerName} style={{marginBottom: 10}}>
            <FormLabel>{playerName}</FormLabel>
            <ButtonScoreSet value={value} setValue={setValue} />
          </FormControl>
        )
      })}
    </>
  )
}

export function GamesView(props: ILeagueRouteParams<{slug: string; gameId: string}>) {
  const classes = useStyles()

  const [loadIncrement, setLoadIncrement] = useState(0)
  const [player1State, setPlayer1] = useState(0)
  const [player2State, setPlayer2] = useState(0)
  const [player3State, setPlayer3] = useState(0)
  const [player4State, setPlayer4] = useState(0)

  const [loadingState, game, setLoadingState] = useGame(props.match.params.gameId, loadIncrement)
  if (!game || loadingState !== LoadingState.Loaded) return <Loader loadingState={loadingState} />
  const [currentRound, currentHand] = getCurrentRoundAndHand(game)

  const playerNames = [game.player1, game.player2, game.player3, game.player4]
  const playerDisplayNames = playerNames.map(n => getPlayerDisplayName(n, playerNames))
  return (
    <>
      <Paper className={classes.paper}>
        <Typography variant="h5" style={{marginBottom: 5}}>
          Game with {playerDisplayNames.join(', ')}
        </Typography>
        <div>
          <div style={{display: 'flex', flexDirection: 'row', fontWeight: 'bold'}}>
            {playerDisplayNames.map(displayName => (
              <div style={{width: '25%', textAlign: 'center'}}>{displayName}</div>
            ))}
          </div>
          {game.scores.map(score => (
            <HandDisplay score={score} key={score.playedAt} />
          ))}
        </div>
      </Paper>
      <Paper className={classes.paper}>
        <Typography variant="h5" style={{marginBottom: 5}}>
          {getHandDisplayName(currentHand)}
        </Typography>
        <RegularScoreSet
          players={[
            [game.player1, player1State, setPlayer1],
            [game.player2, player2State, setPlayer2],
            [game.player3, player3State, setPlayer3],
            [game.player4, player4State, setPlayer4],
          ]}
        />
        <Button
          variant="contained"
          color="primary"
          disabled={
            !isValidScoreCombination(currentHand, [
              player1State,
              player2State,
              player3State,
              player4State,
            ])
          }
          onClick={async () => {
            setLoadingState(LoadingState.Loading)
            await saveGame({
              ...game,
              scores: [
                ...game.scores,
                {
                  round: currentRound,
                  hand: currentHand,
                  player1: player1State,
                  player2: player2State,
                  player3: player3State,
                  player4: player4State,
                  playedAt: new Date().toISOString(),
                },
              ],
            })
            setPlayer1(0)
            setPlayer2(0)
            setPlayer3(0)
            setPlayer4(0)
            setLoadIncrement(x => x + 1)
          }}
        >
          Save Scores
        </Button>
      </Paper>
    </>
  )
}
