import * as React from 'react'
import './loader.css'
import {LoadingState} from '../hooks/firebase-hooks'

export const Loader = (props: {loadingState: LoadingState}) => {
  let loader = (
    <div className="loader">
      <div />
      <div />
      <div />
      <div />
    </div>
  )

  if (props.loadingState === LoadingState.Errored) {
    loader = (
      <div className="loader__error">
        <h2>Oops, an error occurred!</h2>
      </div>
    )
  }

  return <div className="loader-container">{loader}</div>
}
