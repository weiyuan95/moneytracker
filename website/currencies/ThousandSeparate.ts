export function thousandSeparate(amount: string, separator: string): string {
  return amount.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}
