// useCallback: custom hooks
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
import {
  fetchPokemon,
  PokemonForm,
  PokemonDataView,
  PokemonInfoFallback,
  PokemonErrorBoundary,
} from '../pokemon'

// 🐨 this is going to be our generic asyncReducer
function pokemonInfoReducer(state, action) {
  switch (action.type) {
    case 'pending': {
      // 🐨 replace "pokemon" with "data"
      return {status: 'pending', data: null, error: null}
    }
    case 'resolved': {
      // 🐨 replace "pokemon" with "data" (in the action too!)
      return  {status: 'resolved', data: action.data, error: null};
    }
    case 'rejected': {
      // 🐨 replace "pokemon" with "data"
      return  {status: 'rejected', data: null, error: action.error};
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function useAsync(initialState, appEl){

  const runFunc = React.useCallback((promise) => {
    if (!promise) {
      return
    }
    dispatch({type: 'pending'})
    promise.then(
      data => {
        if(appEl.current) {
          dispatch({type: 'resolved', data})
        }
      },
      error => {
        if(appEl.current) {
          dispatch({type: 'rejected', error})
        }
      },
    )
  }, [])

  const [state, dispatch] = React.useReducer(pokemonInfoReducer, {
    status: 'idle',
    data: null,
    error: null,
    ...initialState
  })




  return {...state, run: runFunc};
}

function PokemonInfo({pokemonName, appEl}) {
  const {data: pokemon, status, error, run} = useAsync({ status: pokemonName ? 'pending' : 'idle' }, appEl)

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }
    const pokemonPromise = fetchPokemon(pokemonName)
    run(pokemonPromise)
  }, [pokemonName, run])


  switch (status) {
    case 'idle':
      return <span>Submit a pokemon</span>
    case 'pending':
      return <PokemonInfoFallback name={pokemonName} />
    case 'rejected':
      throw error
    case 'resolved':
      return <PokemonDataView pokemon={pokemon} />
    default:
      throw new Error('This should be impossible')
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')
  const appEl = React.useRef(null);
  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div ref= {appEl} className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonErrorBoundary onReset={handleReset} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} appEl={appEl} />
        </PokemonErrorBoundary>
      </div>
    </div>
  )
}

function AppWithUnmountCheckbox() {
  const [mountApp, setMountApp] = React.useState(true)
  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={mountApp}
          onChange={e => setMountApp(e.target.checked)}
        />{' '}
        Mount Component
      </label>
      <hr />
      {mountApp ? <App /> : null}
    </div>
  )
}

export default AppWithUnmountCheckbox
