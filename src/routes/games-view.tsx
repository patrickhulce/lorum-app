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
import {
  getNextRoundAndHandToScore,
  getHandDisplayName,
  getPlayerDisplayNames,
  isValidScoreCombination,
} from '../utils/game-utils'

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

const HandDisplay = (props: {score: IScoreEntry; cummulative: IScoreEntry}) => {
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
          {props.cummulative.player1}
        </span>
      </div>
      <div className={clsx(classes.handScore)}>
        <span className={clsx({[classes.handScoreBomb]: score.player2 === 10})}>
          {props.cummulative.player2}
        </span>
      </div>
      <div className={clsx(classes.handScore)}>
        <span className={clsx({[classes.handScoreBomb]: score.player3 === 10})}>
          {props.cummulative.player3}
        </span>
      </div>
      <div className={clsx(classes.handScore)}>
        <span className={clsx({[classes.handScoreBomb]: score.player4 === 10})}>
          {props.cummulative.player4}
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
          <FormControl key={playerName} style={{marginBottom: 10, width: '100%'}}>
            <FormLabel style={{marginBottom: 5}}>{playerName}</FormLabel>
            <ButtonScoreSet value={value} setValue={setValue} />
          </FormControl>
        )
      })}
    </>
  )
}

export function GamesView(props: ILeagueRouteParams<{slug: string; gameId: string}>) {
  const classes = useStyles()

  const [isInEditMode, setEditMode] = useState(false)
  const [activeRound, setEditRound] = useState(-1)
  const [activeHand, setEditHand] = useState(Hand.Hearts)
  const [loadIncrement, setLoadIncrement] = useState(0)
  const [player1State, setPlayer1] = useState(0)
  const [player2State, setPlayer2] = useState(0)
  const [player3State, setPlayer3] = useState(0)
  const [player4State, setPlayer4] = useState(0)

  const [loadingState, game, setLoadingState] = useGame(props.match.params.gameId, loadIncrement)
  if (!game || loadingState !== LoadingState.Loaded) return <Loader loadingState={loadingState} />

  const [nextRoundToScore, nextHandToScore] = getNextRoundAndHandToScore(game)
  const currentRound = isInEditMode ? activeRound : nextRoundToScore
  const currentHand = isInEditMode ? activeHand : nextHandToScore

  const scores = _.sortBy(game.scores, score => score.round * 8 + score.hand)
  const playerDisplayNames = getPlayerDisplayNames(game)
  const cummulativeScore = {...scores[0], player1: 0, player2: 0, player3: 0, player4: 0}

  let editUI: JSX.Element | null = (
    <Paper className={classes.paper}>
      <Typography variant="h5" style={{marginBottom: 5}}>
        {getHandDisplayName(currentHand)} {isInEditMode ? `(Edit, Round ${currentRound})` : ''}
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
              ...scores.filter(
                score => !(score.round === currentRound && score.hand === currentHand),
              ),
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
          setEditMode(false)
          setPlayer1(0)
          setPlayer2(0)
          setPlayer3(0)
          setPlayer4(0)
          setLoadIncrement(x => x + 1)
        }}
      >
        Save Scores
      </Button>
      <Button
        size="small"
        variant="contained"
        disabled={scores.length === 0}
        onClick={() => {
          if (isInEditMode) {
            setEditMode(false)
            setPlayer1(0)
            setPlayer2(0)
            setPlayer3(0)
            setPlayer4(0)
            return
          }

          const [round, hand] = getNextRoundAndHandToScore({...game, scores: scores.slice(0, -1)})
          setEditRound(round)
          setEditHand(hand)
          const activeScore = scores.find(score => score.round === round && score.hand === hand)
          if (activeScore) {
            setPlayer1(activeScore.player1)
            setPlayer2(activeScore.player2)
            setPlayer3(activeScore.player3)
            setPlayer4(activeScore.player4)
          }
          setEditMode(true)
        }}
        style={{display: 'block', marginTop: 10}}
      >
        {isInEditMode ? 'Leave Edit Mode' : 'Oops I made a mistake! (Edit Mode)'}
      </Button>
    </Paper>
  )

  if (nextRoundToScore === -1) editUI = null

  return (
    <>
      <Paper className={classes.paper}>
        <Typography variant="h5" style={{marginBottom: 5}}>
          {playerDisplayNames.join(', ')}
        </Typography>
        <div>
          <div style={{display: 'flex', flexDirection: 'row', fontWeight: 'bold'}}>
            {playerDisplayNames.map(displayName => (
              <div style={{width: '25%', textAlign: 'center'}} key={displayName}>
                {displayName}
              </div>
            ))}
          </div>
          {scores.map(score => {
            cummulativeScore.player1 += score.player1
            cummulativeScore.player2 += score.player2
            cummulativeScore.player3 += score.player3
            cummulativeScore.player4 += score.player4
            return (
              <HandDisplay score={score} key={score.playedAt} cummulative={{...cummulativeScore}} />
            )
          })}
        </div>
      </Paper>
      {editUI}
    </>
  )
}
