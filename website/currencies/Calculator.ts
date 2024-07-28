import bn from 'bignumber.js';
import { Calculator } from 'dinero.js';

export const BigNumberCalculator: Calculator<bn> = {
  add: (a, b) => a.plus(b),
  compare: (a, b) => a.comparedTo(b),
  decrement: (v) => v.minus(bn(1)),
  increment: (v) => v.plus(bn(1)),
  integerDivide: (a, b) => a.div(b).decimalPlaces(0, bn.ROUND_FLOOR),
  modulo: (a, b) => a.mod(b),
  multiply: (a, b) => a.times(b),
  power: (a, b) => a.pow(b),
  subtract: (a, b) => a.minus(b),
  zero: () => bn(0),
};
