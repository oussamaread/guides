export function calculateBollingerBands(
  prices: number[],
  period: number,
  multiplier: number
) {
  if (prices.length < period) {
    throw new Error("Not enough data points to calculate Bollinger Bands");
  }

  const sma = calculateSMA(prices, period);
  const stdDev = calculateStdDev(prices, period);
  const upperBand = sma.map((avg, index) => avg + multiplier * stdDev[index]);
  const lowerBand = sma.map((avg, index) => avg - multiplier * stdDev[index]);

  return { upperBand, lowerBand };
}

function calculateSMA(prices: number[], period: number): number[] {
  return prices
    .map((_, i, arr) => {
      if (i < period - 1) return null;
      const sum = arr.slice(i - period + 1, i + 1).reduce((acc, price) => acc + price, 0);
      return sum / period;
    })
    .filter((avg) => avg !== null);
}

function calculateStdDev(prices: number[], period: number): number[] {
  const sma = calculateSMA(prices, period);
  return prices
    .map((_, i, arr) => {
      if (i < period - 1) return null;
      const sum = arr
        .slice(i - period + 1, i + 1)
        .reduce((acc, price) => acc + Math.pow(price - sma[i - period + 1], 2), 0);
      return Math.sqrt(sum / period);
    })
    .filter((stdDev) => stdDev !== null);
}
