import {useState, useEffect} from 'react'
import {ILeague} from '../types'

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

function useFirebaseState<T>(
  queryFn: () => Promise<T>,
  deps: any[] = [],
): [LoadingState, T | undefined] {
  const [loadingState, setLoadingState] = useState(LoadingState.Loading)
  const [apiData, setApiData] = useState(undefined as T | undefined)

  useEffect(() => {
    ;(async () => {
      try {
        const result = await queryFn()
        setApiData(result)
        setLoadingState(LoadingState.Loaded)
      } catch (err) {
        setLoadingState(LoadingState.Errored)
        console.error(err)
      }
    })()
  }, deps)

  return [loadingState, apiData]
}

export function useLeagues(): [LoadingState, Array<ILeague> | undefined] {
  return useFirebaseState(async () => {
    const qs = await db.collection('leagues').get()
    return qs.docs.map(v => v.data() as any)
  })
}

export function useLeague(slug: string): [LoadingState, ILeague | undefined] {
  return useFirebaseState(async () => {
    const qs = await db
      .collection('leagues')
      .where('slug', '==', slug)
      .limit(1)
      .get()

    console.log(qs)
    return qs.docs.map(v => v.data() as any)[0]
  }, [slug])
}
