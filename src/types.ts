export interface ILeague {
  id: string
  name: string
  slug: string
  players: string[]
}

export enum Hand {
  Hearts = 0,
  Uppers = 1,
  Each = 2,
  Last = 3,
  RedKing = 4,
  BabyBlue = 5,
  Quartet = 6,
  SevenUp = 7,
}

export interface IScoreEntry {
  round: 1 | 2 | 3 | 4
  hand: Hand
  player1: number
  player2: number
  player3: number
  player4: number
  playedAt: string
}

export interface IGame {
  id: string
  leagueId: string
  isRanked: boolean
  player1: string
  player2: string
  player3: string
  player4: string
  scores: Array<IScoreEntry>
  startedAt: string
  lastUpdatedAt: string
}

export interface IRouteMatch<TParams> {
  url: string
  params: TParams
}

export interface ILeagueRouteParams<TParams extends {slug: string} = {slug: string}> {
  history: import('history').History
  match: IRouteMatch<TParams>
}
