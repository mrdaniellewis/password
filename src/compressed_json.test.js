import { stringify, parse } from './compressed_json';

const testArray = [
  null,
  true,
  false,
  0,
  'string',
  [1, 2],
  { '': 'foo', foe: 'thumb' },
];

const testObject = {
  fee: 'fi',
  array: testArray,
  object: { '': 'foo', foe: 'thumb' },
};

describe('stringify', () => {
  it('stringifies an array', () => {
    const stringified = stringify(testArray);
    expect(stringified).toMatchSnapshot();
  });

  it('stringifies an object', () => {
    const stringified = stringify(testObject);
    expect(stringified).toMatchSnapshot();
  });
});

describe('parse', () => {
  it('parses an array', () => {
    const stringified = stringify(testArray);
    expect(parse(stringified)).toEqual(testArray);
  });

  it('parses an object', () => {
    const stringified = stringify(testObject);
    expect(parse(stringified)).toEqual(testObject);
  });
});
