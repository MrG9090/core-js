import { createIterator } from '../helpers/helpers.js';
import { STRICT, STRICT_THIS } from '../helpers/constants.js';

import Iterator from 'core-js-pure/es/iterator';

QUnit.test('Iterator#reduce', assert => {
  const { reduce } = Iterator.prototype;

  assert.isFunction(reduce);
  assert.arity(reduce, 1);
  assert.nonEnumerable(Iterator.prototype, 'reduce');

  assert.same(reduce.call(createIterator([1, 2, 3]), (a, b) => a + b, 1), 7, 'basic functionality');
  assert.same(reduce.call(createIterator([1, 2, 3]), (a, b) => a + b), 6, 'basic functionality, no init');
  reduce.call(createIterator([2]), function (a, b, counter) {
    assert.same(this, STRICT_THIS, 'this');
    assert.same(arguments.length, 3, 'arguments length');
    assert.same(a, 1, 'argument 1');
    assert.same(b, 2, 'argument 2');
    assert.same(counter, 0, 'counter');
  }, 1);

  if (STRICT) {
    assert.throws(() => reduce.call(undefined, (a, b) => a + b, 0), TypeError);
    assert.throws(() => reduce.call(null, (a, b) => a + b, 0), TypeError);
  }

  assert.throws(() => reduce.call({}, (a, b) => a + b, 0), TypeError);
  assert.throws(() => reduce.call([], (a, b) => a + b, 0), TypeError);
  assert.throws(() => reduce.call(createIterator([1]), undefined, 1), TypeError);
  assert.throws(() => reduce.call(createIterator([1]), null, 1), TypeError);
  const it = createIterator([1], { return() { this.closed = true; } });
  assert.throws(() => reduce.call(it, {}, 1), TypeError);
  assert.true(it.closed, "reduce doesn't close iterator on validation error");
  assert.notThrows(() => reduce.call(createIterator([]), () => false, undefined), 'fails on undefined initial parameter');
  assert.same(reduce.call(createIterator([]), () => false, undefined), undefined, 'incorrect result on undefined initial parameter');
});
