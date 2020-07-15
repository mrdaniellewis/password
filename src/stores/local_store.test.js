import { LocalStore } from './local_store';
import { stringify } from '../compressed_json';

beforeEach(() => {
  localStorage.clear();
});

it('allows keys to be set', () => {
  const store = new LocalStore('foo');
  store.foo = 'bar';
  expect(store.foo).toEqual('bar');
});

it('allows keys to be deleted', () => {
  const store = new LocalStore('foo');
  store.foo = 'bar';
  delete store.foo;
  expect(store.foo).toEqual(undefined);
});

it('iterates entires', () => {
  const store = new LocalStore('foo');
  store.foo = 'bar';
  store.foe = 'fee';
  const items = [];
  for (const [key, value] of store) {
    items.push([key, value]);
  }
  expect(items).toEqual([['foo', 'bar'], ['foe', 'fee']]);
});

it('saves to localStorage when setting', () => {
  const store = new LocalStore('foo');
  store.foo = 'bar';
  expect(localStorage.getItem('foo')).toEqual(stringify({ foo: 'bar' }));
});

it('loads from localStorage', () => {
  localStorage.setItem('foo', stringify({ foo: 'bar' }));
  const store = new LocalStore('foo');
  expect(store.foo).toEqual('bar');
});

it('saves to localStorage when deleting', () => {
  localStorage.setItem('foo', stringify({ foo: 'bar' }));
  const store = new LocalStore('foo');
  delete store.foo;
  expect(localStorage.getItem('foo')).toEqual(stringify({}));
});
