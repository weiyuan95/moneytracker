/* eslint-disable no-underscore-dangle */

import bn from 'bignumber.js';
import { add, createDinero, Dinero, multiply, subtract, toDecimal, toSnapshot, toUnits } from 'dinero.js';

import { BigNumberCalculator } from './Calculator';
import { thousandSeparate } from './ThousandSeparate';

export type BigNumberish = bn | number | string;

export type CurrencyConstructorOptions = {
  // The amount of currency this class represents
  amount: BigNumberish;
  // The decimal places the currency has
  decimals: number;
  // The currency's symbol
  symbol: string;
  // A boolean flag to indicate if the amount is in canonical units (e.g. BTC, ETH, USD, etc.)
  // If omitted, defaults to true
  asCanonical?: boolean;
  // The separator used for formatting the amount when separating the thousands. If omitted, defaults to ','
  thousandSeparator?: string;
};

export type FormatterOptions = {
  /**
   * [1, 2] => 1.0000002 BTC
   */
  units: readonly bn[];
  symbol?: string;
};

export class Currency {
  protected readonly _symbol: string;

  protected readonly _decimals: number;

  protected readonly _baseAmount: bn;

  protected readonly dineroInstance: Dinero<bn>;

  protected readonly dineroBn: ReturnType<typeof createDinero<bn>>;

  protected readonly thousandSeparator: string;

  get decimals(): number {
    return this._decimals;
  }

  get symbol(): string {
    return this._symbol;
  }

  /**
   * The amount in base units (e.g. satoshi, wei, cents (USD), etc.)
   */
  get baseAmount(): bn {
    return this._baseAmount;
  }

  /**
   * The amount in canonical units (e.g. BTC, ETH, USD, etc.)
   */
  get canonicalAmount(): bn {
    return this.baseAmount.div(10 ** this.decimals);
  }

  constructor({ amount, decimals, symbol, asCanonical = true, thousandSeparator }: CurrencyConstructorOptions) {
    this._decimals = decimals;
    this._symbol = symbol;
    this.thousandSeparator = thousandSeparator ?? ',';

    // No matter what, we round down to the number of decimal places the currency has without any rounding
    const adjustedAmount = bn(amount).decimalPlaces(decimals, bn.ROUND_FLOOR);

    this._baseAmount = asCanonical ? bn(adjustedAmount).multipliedBy(10 ** decimals) : bn(adjustedAmount);

    // If the amount is canonical, check if the decimal places passed as the canonical amount
    // exceeds the number of decimals the currency can have
    const canonicalDecimalPlaces = this.canonicalAmount.decimalPlaces() ?? 0;
    // Should never happen, but we double-check to be sure
    if (asCanonical && canonicalDecimalPlaces > this.decimals) {
      throw new Error(
        `Expected at most ${this.decimals} decimal places but got ${canonicalDecimalPlaces} (${this.canonicalAmount})`
      );
    }

    // If the amount is non-canonical, it should not have decimal places
    const amountDecimalPlaces = this._baseAmount.decimalPlaces() ?? 0;
    if (!asCanonical && amountDecimalPlaces > 0) {
      throw new Error('Amount should not have decimal places if it is not canonical');
    }

    this.dineroBn = createDinero({ calculator: BigNumberCalculator });
    // We assume that the base is always 10 since we will not be dealing with currencies that are not base 10 / decimal
    // in nature
    this.dineroInstance = this.dineroBn({
      amount: this._baseAmount,
      currency: { code: symbol, base: bn(10), exponent: bn(decimals) },
    });
  }

  /**
   * If you want absolute control over the formatting, you can pass in a transformer callback.
   * If not, the default format is "`${amount} ${symbol}`".
   *
   * @param transformer
   */
  format(transformer?: (opts: FormatterOptions) => string): string {
    if (!transformer) {
      return toDecimal(this.dineroInstance, ({ value, currency }) => {
        const [wholeNumber, fractionalNumber] = value.split('.');
        let formattedWholeNumber = [thousandSeparate(wholeNumber, this.thousandSeparator), fractionalNumber].join('.');

        // Cut off the display to 6 decimal places since it doesn't make much sense to display more than that.
        if (this.decimals > 6) {
          formattedWholeNumber = [
            thousandSeparate(wholeNumber, this.thousandSeparator),
            fractionalNumber.slice(0, 6),
          ].join('.');
        }

        return `${formattedWholeNumber} ${currency.code}`;
      });
    }

    return transformer({
      units: toUnits(this.dineroInstance),
      symbol: this._symbol,
    });
  }

  /**
   * Mathematical Operations
   *
   * Note that there is no division since the division of Currency is not so straightforward.
   * e.g. Although it makes sense to divide 1 BTC by 2 (0.5 BTC each), it doesn't make sense to
   * divide 1 sat by 2 since there isn't a 0.5 sat.
   */
  plus(addend: Currency): Currency {
    this.validate(addend);
    return this.fromDineroInstance(add(this.dineroInstance, addend.dineroInstance));
  }

  /**
   * Allows negative results. It's up to the caller what the want to do with the result, this class
   * is not opinionated about it.
   * @param subtrahend
   */
  minus(subtrahend: Currency): Currency {
    this.validate(subtrahend);
    return this.fromDineroInstance(subtract(this.dineroInstance, subtrahend.dineroInstance));
  }

  /**
   * Allows a negative multiplier. It's up to the caller what the want to do with the result, this class
   * is not opinionated about it.
   * @param multiplier
   */
  multiply(multiplier: bn | number): Currency {
    return this.fromDineroInstance(multiply(this.dineroInstance, bn(multiplier)));
  }

  // End Mathematical Operations

  // To convert the internal Dinero instance (after a numeric operation) back to a Currency instance
  private fromDineroInstance(dineroInstance: Dinero<bn>): Currency {
    // We only take the amount - the decimals and symbol should follow the current instance
    return new Currency({
      amount: toSnapshot(dineroInstance).amount,
      decimals: this._decimals,
      symbol: this._symbol,
      // Calculation is always done in base units
      asCanonical: false,
    });
  }

  private validate(other: Currency): void {
    if (this._symbol !== other._symbol || this._decimals !== other._decimals) {
      throw new Error(
        `Trying to perform an operation on two different currencies: ${this._symbol} and ${other._symbol} with decimals ${this._decimals} and ${other._decimals} respectively`
      );
    }
  }
}
