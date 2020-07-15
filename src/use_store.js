import { useContext, useEffect } from 'preact/hooks';
import { saveSites } from './actions';
import { Context } from './context';

export function useStore(dispatch, store) {
  const { sync } = useContext(Context);

  useEffect(() => {
    let stop = false;

    const options = [];
    (async function load() {
      for await (const [key, value] of store) {
        if (stop) {
          break;
        }
        options.push({ ...value, siteTag: key });
      }
      dispatch(saveSites(options));
    }());

    return () => {
      stop = true;
    };
  }, [dispatch, store]);

  useEffect(() => {
    // set changes to the store
    for (const { siteTag, ...options } of sync) {
      if (!store.has(siteTag) || store.get(siteTag).timestamp < options.timestamp) {
        store.set(siteTag, options);
      }
    }
  }, [store, sync]);
}
