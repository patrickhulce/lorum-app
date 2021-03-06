import {useState, useEffect} from 'react'
import {ILeague, IGame} from '../types'

import * as firebase from 'firebase/app'

import 'firebase/firestore'

firebase.initializeApp({
  apiKey: 'AIzaSyBgf-AuITGeriZxaczyuDNQuPDD6rO8Ukw',
  appId: '1:934512823395:web:ffb8c9e0b6d6e229',
  databaseURL: 'https://lorum-app.firebaseio.com',
  storageBucket: 'lorum-app.appspot.com',
  authDomain: 'lorum-app.firebaseapp.com',
  messagingSenderId: '934512823395',
  projectId: 'lorum-app',
})

const db = firebase.firestore()

export enum LoadingState {
  Loading = 'loading',
  Loaded = 'loaded',
  Errored = 'errored',
}

type FirebaseState<T> = [
  LoadingState,
  T | undefined,
  (n: LoadingState) => void,
  (n: T | undefined) => void
]

function useFirebaseState<T>(queryFn: () => Promise<T>, deps: any[] = []): FirebaseState<T> {
  const [loadingState, setLoadingState] = useState(LoadingState.Loading)
  const [apiData, setApiData] = useState(undefined as T | undefined)

  useEffect(() => {
    ;(async () => {
      try {
        setLoadingState(LoadingState.Loading)
        const result = await queryFn()
        setApiData(result)
        setLoadingState(LoadingState.Loaded)
      } catch (err) {
        setLoadingState(LoadingState.Errored)
        console.error(err)
      }
    })()
  }, deps)

  return [loadingState, apiData, setLoadingState, setApiData]
}

export function useLeagues(): FirebaseState<Array<ILeague>> {
  return useFirebaseState(async () => {
    const qs = await db.collection('leagues').get()
    return qs.docs.map(v => ({...v.data(), id: v.id} as any))
  })
}

export function useLeague(slug: string): FirebaseState<ILeague> {
  return useFirebaseState(async () => {
    const qs = await db
      .collection('leagues')
      .where('slug', '==', slug)
      .limit(1)
      .get()

    return qs.docs.map(v => ({...v.data(), id: v.id} as any))[0]
  }, [slug])
}

export function useGames(leagueId: string | undefined): FirebaseState<Array<IGame>> {
  return useFirebaseState(async () => {
    if (!leagueId) return []

    const qs = await db
      .collection('games')
      .where('leagueId', '==', leagueId)
      .get()
    return qs.docs.map(v => ({...v.data(), id: v.id} as any))
  }, [leagueId])
}

export function useGame(gameId: string, loadValue: number = 0): FirebaseState<IGame> {
  return useFirebaseState(async () => {
    const qs = await db
      .collection('games')
      .doc(gameId)
      .get()

    return {...qs.data(), id: qs.id} as any
  }, [gameId, loadValue])
}

export async function saveLeague(league: ILeague): Promise<void> {
  await db
    .collection('leagues')
    .doc(league.id)
    .update(league)
}

export async function createGame(
  game: Omit<IGame, 'id' | 'startedAt' | 'lastUpdatedAt'>,
): Promise<IGame> {
  const gameWithDate = {
    ...game,
    startedAt: new Date().toISOString(),
    lastUpdatedAt: new Date().toISOString(),
  }

  const gameWithId = await db.collection('games').add(gameWithDate)
  return {...gameWithDate, id: gameWithId.id}
}

export async function saveGame(game: IGame): Promise<void> {
  const gameWithDate = {
    ...game,
    lastUpdatedAt: new Date().toISOString(),
  }

  await db
    .collection('games')
    .doc(game.id)
    .update(gameWithDate)
}
