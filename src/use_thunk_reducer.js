import { useRef, useCallback, useReducer } from 'preact/hooks';

export function useThunkReducer(reducer, initialState) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Holds the latest state
  const stateRef = useRef(state);

  stateRef.current = state;

  // Special dispatch that will call a returned function with (dispatch, getState)
  const thunkDispatch = useCallback((data) => (
    typeof data === 'function'
      ? data(thunkDispatch, () => stateRef.current)
      : dispatch(data)
  ), []);

  return [state, thunkDispatch];
}
