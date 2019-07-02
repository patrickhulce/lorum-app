export interface ILeague {
  id: string
  name: string
  slug: string
  players: string[]
}

export interface IRouteMatch<TParams> {
  url: string
  params: TParams
}

export interface ILeagueRouteParams<TParams extends {slug: string} = {slug: string}> {
  history: import('history').History
  match: IRouteMatch<TParams>
}
