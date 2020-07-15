import { h } from 'preact';
import { useCallback, useEffect, useRef } from 'preact/hooks';
import { useThunkReducer as useReducer } from '../use_thunk_reducer';
import { reducer } from '../reducer';
import { initialState } from '../initial_state';
import { generateHash, storeKey, clearKey, setOption, setShowDetails, resetOptions, deleteSite, loadSite } from '../actions';
import { Checkbox } from './checkbox.jsx';
import { Context } from '../context';

const steps = Array(11).fill().map((v, i) => i * 2 + 4);

export function Form() {
  const hashRef = useRef();
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    options: {
      masterKey, siteTag, hashWordSize, restrictSpecial, restrictDigits,
      requireDigit, requirePunctuation, requireMixedCase, bangify,
    },
    hash,
    showDetails,
    sites,
  } = state;

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(clearKey());
    }, 4 * 60 * 60 * 1000);
    return () => {
      clearTimeout(timeout);
    };
  });

  useEffect(() => {
    if (hash) {
      hashRef.current.focus();
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNode(hashRef.current);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, [hash]);

  const changeOption = useCallback((name, prop = 'value') => ({ target: { [prop]: value } }) => (
    dispatch(setOption({ [name]: value }))
  ), []);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(hash);
  }, [hash]);

  return (
    <Context.Provider value={state}>
      <form
        onSubmit={(e) => dispatch(generateHash(e))}
      >
        <label className="row" htmlFor="master-key">
          Master key
          <input
            id="master-key"
            type="password"
            autoFocus
            autcomplete="off"
            required
            onInput={changeOption('masterKey')}
            onChange={() => dispatch(storeKey())}
            onFocus={() => dispatch(clearKey())}
            value={masterKey}
          />
        </label>

        <label className="row" htmlFor="site-tag">
          Site tag
          <input
            type="text"
            id="site-tag"
            list="saved-sites"
            required
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            onInput={changeOption('siteTag')}
            onChange={({ target: { value } }) => dispatch(loadSite(value))}
            value={siteTag}
          />
          <datalist
            aria-label="Saved sites"
            id="saved-sites"
          >
            {[...sites.keys()].map((siteTag) => (
              <option value={siteTag} key={siteTag} />
            ))}
          </datalist>
        </label>

        <button
          type="submit"
        >
          Generate
        </button>

        <label
          className="row"
          htmlFor="hash"
        >
          Hash
          <output
            class="hash"
            id="hash"
            htmlFor="site-tag"
            ref={hashRef}
            tabIndex={0}
          >
            {hash}
          </output>
          <button
            type="button"
            onClick={copyToClipboard}
            hidden={!hash}
            aria-label="Copy to clipboard"
            title="Copy to clipboard"
          >
            Copy
          </button>
        </label>

        <details
          open={showDetails}
          onToggle={({ target: { open } }) => dispatch(setShowDetails(open))}
        >
          <summary>More options</summary>
          <button
            type="button"
            onClick={() => dispatch(resetOptions())}
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => dispatch(deleteSite(siteTag))}
            hidden={!sites.has(siteTag)}
          >
            Delete saved
          </button>

          <div class="buttons">
            <fieldset>
              <legend>
                Requirements
              </legend>
              <Checkbox
                label="Digits"
                onChange={changeOption('requireDigit', 'checked')}
                disabled={restrictDigits}
                checked={requireDigit}
              />
              <Checkbox
                label="Punctuation"
                onChange={changeOption('requirePunctuation', 'checked')}
                disabled={restrictDigits || restrictSpecial}
                checked={requirePunctuation}
              />
              <Checkbox
                label="Mixed case"
                onChange={changeOption('requireMixedCase', 'checked')}
                disabled={restrictDigits}
                checked={requireMixedCase}
              />
              <Checkbox
                label="Bangify"
                onChange={changeOption('bangify', 'checked')}
                checked={bangify}
              />
            </fieldset>

            <fieldset>
              <legend>Restrictions</legend>
              <Checkbox
                label="No special"
                onChange={changeOption('restrictSpecial', 'checked')}
                disabled={restrictDigits}
                checked={restrictSpecial}
              />
              <Checkbox
                label="Digits only"
                onChange={changeOption('restrictDigits', 'checked')}
                checked={restrictDigits}
              />
            </fieldset>
          </div>

          <label class="row">
            Size
            {' '}
            <output
              htmlFor="hash-word-size"
              value={hashWordSize}
            >
              {hashWordSize}
            </output>
            <input
              type="range"
              id="hash-word-size"
              min="4"
              max="26"
              step="2"
              list="step-list"
              onChange={changeOption('hashWordSize', 'valueAsNumber')}
              value={hashWordSize}
            />
            <div class="range-list">
              <span
                class="range-list__min"
              >
                4
              </span>
              <span
                class="range-list__max"
              >
                26
              </span>
            </div>
            <datalist id="step-list">
              {steps.map((step) => (
                <option key={step}>
                  {step}
                </option>
              ))}
            </datalist>
          </label>
        </details>
      </form>
    </Context.Provider>
  );
}
