import * as _ from 'lodash'
import {IGame, Hand} from '../types'

export function getNextRoundAndHandToScore(game: IGame): [number, Hand] {
  if (!game.scores.length) return [1, Hand.Hearts]
  if (game.scores.length === 32) return [-1, Hand.Hearts]

  const maxRound = Math.max(...game.scores.map(s => s.round))
  const maxHand = Math.max(...game.scores.filter(game => game.round === maxRound).map(s => s.hand))
  if (maxHand === Hand.SevenUp) return [maxRound + 1, Hand.Hearts]
  return [maxRound, maxHand + 1]
}

export function getHandDisplayName(hand: Hand): string {
  return _.startCase(Object.keys(Hand).find(h => (Hand as any)[h] === hand)!)
}

function getPlayerFirstName(name: string): string {
  const parts = name.split(/\s+/g)
  if (parts.length > 2) return parts.slice(0, -1).join(' ')
  return parts[0]
}

export function getPlayerDisplayName(name: string, allNames: string[]): string {
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

export function getPlayerDisplayNames(game: IGame): string[] {
  const playerNames = [game.player1, game.player2, game.player3, game.player4]
  return playerNames.map(n => getPlayerDisplayName(n, playerNames))
}

export function isValidScoreCombination(currentHand: Hand, scores: number[]): boolean {
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
