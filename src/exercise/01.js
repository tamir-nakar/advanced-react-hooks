// useReducer: simple Counter
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'

// function countReducer(state, newState){
//   return newState;
// }

//extra 1
// function countReducer(state, step){
//   return state + step;
// }

//extra 2
// function countReducer(state, newState){
//   return {...state, ...newState};
// }
//extra 3
// function countReducer(state, newState){
//   return typeof newState === 'function' ? {...state, ...newState(state)} : {...state, ...newState};
// }
//extra 4
function countReducer(state, action){
  switch(action.type) {
    case 'INCREMENT':
      return {...state, count: state.count + action.step};
      break;
    default:
      throw new Error('Illegal action type!');
  }
}

function Counter({initialCount = 0, step = 1}) {
  const [state, dispatch] = React.useReducer(countReducer, {
    count: initialCount,
  })
  const {count} = state
  const increment = () => dispatch({type: 'INCREMENT', step})

  return <button onClick={increment}>{state.count}</button>
}

function App() {
  return <Counter />
}

export default App
