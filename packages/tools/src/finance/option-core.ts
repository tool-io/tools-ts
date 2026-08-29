import { simpleError } from "../core/simple.js";
import { createSeededRandom } from "../random/seeded-number/tool.js";
import { randomNormal } from "../probability/normal-box-muller-sampler/tool.js";

const normalCdf = (value: number): number => {
  const x = Math.abs(value),
    t = 1 / (1 + 0.2316419 * x);
  const p =
    t *
    (0.31938153 +
      t *
        (-0.356563782 +
          t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  const upper = 1 - (Math.exp((-x * x) / 2) / Math.sqrt(2 * Math.PI)) * p;
  return value >= 0 ? upper : 1 - upper;
};
export const optionInputs = (
  spot: number,
  strike: number,
  time: number,
  volatilityPercent: number,
) => {
  if (!(spot > 0 && strike > 0 && time > 0) || volatilityPercent < 0)
    simpleError(
      "spotPrice",
      "Spot, strike and time must be positive; volatility must be nonnegative.",
    );
};

export const digitalOptionPrice = (
  spot: number,
  strike: number,
  time: number,
  ratePercent: number,
  yieldPercent: number,
  volatilityPercent: number,
  cashPayoff: number,
  optionType: string,
) => {
  optionInputs(spot, strike, time, volatilityPercent);
  if (!(cashPayoff >= 0))
    simpleError("cashPayoff", "Cash payoff must be nonnegative.");
  const rate = ratePercent / 100,
    yieldRate = yieldPercent / 100,
    volatility = volatilityPercent / 100;
  const discount = Math.exp(-rate * time);
  if (volatility === 0) {
    const terminal = spot * Math.exp((rate - yieldRate) * time);
    return {
      optionPrice:
        cashPayoff *
        discount *
        Number(optionType === "call" ? terminal > strike : terminal < strike),
      exerciseProbability: Number(
        optionType === "call" ? terminal > strike : terminal < strike,
      ),
    };
  }
  const d2 =
    (Math.log(spot / strike) +
      (rate - yieldRate - (volatility * volatility) / 2) * time) /
    (volatility * Math.sqrt(time));
  const exerciseProbability = normalCdf(optionType === "call" ? d2 : -d2);
  return {
    optionPrice: cashPayoff * discount * exerciseProbability,
    exerciseProbability,
  };
};

export const monteCarloEuropean = (
  spot: number,
  strike: number,
  time: number,
  ratePercent: number,
  yieldPercent: number,
  volatilityPercent: number,
  optionType: string,
  pathCount: number,
  seed: string,
) => {
  optionInputs(spot, strike, time, volatilityPercent);
  if (pathCount < 2 || pathCount > 100000 || pathCount % 2)
    simpleError(
      "pathCount",
      "Use an even path count from 2 to 100,000 for antithetic pairs.",
    );
  if (!seed.trim()) simpleError("seed", "Seed must be nonempty.");
  const rate = ratePercent / 100,
    yieldRate = yieldPercent / 100,
    volatility = volatilityPercent / 100;
  const drift = (rate - yieldRate - (volatility * volatility) / 2) * time;
  const deviation = volatility * Math.sqrt(time),
    discount = Math.exp(-rate * time);
  const payoff = (terminal: number) =>
    Math.max(0, optionType === "call" ? terminal - strike : strike - terminal) *
    discount;
  const random = createSeededRandom(seed),
    pairs: number[] = [];
  for (let i = 0; i < pathCount / 2; i++) {
    const z = randomNormal(random);
    if (z === null) simpleError("seed", "Random normal draw failed.");
    const first = payoff(spot * Math.exp(drift + deviation * z!));
    const second = payoff(spot * Math.exp(drift - deviation * z!));
    if (!Number.isFinite(first) || !Number.isFinite(second))
      simpleError("spotPrice", "Simulated payoff overflows.");
    pairs.push((first + second) / 2);
  }
  const optionPrice = pairs.reduce((a, b) => a + b, 0) / pairs.length;
  const variance =
    pairs.length > 1
      ? pairs.reduce((sum, value) => sum + (value - optionPrice) ** 2, 0) /
        (pairs.length - 1)
      : 0;
  return {
    optionPrice,
    standardError: Math.sqrt(variance / pairs.length),
    paths: pathCount,
  };
};
