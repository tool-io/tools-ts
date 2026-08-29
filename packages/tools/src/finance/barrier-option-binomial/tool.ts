import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BarrierOptionInput = {
  readonly barrierDirection: "down-and-out" | "up-and-out";
  readonly barrierPrice: number;
  readonly dividendYieldPercent: number;
  readonly optionType: "call" | "put";
  readonly riskFreeRatePercent: number;
  readonly spotPrice: number;
  readonly steps: number;
  readonly strikePrice: number;
  readonly timeToExpirationYears: number;
  readonly volatilityPercent: number;
};
export type BarrierOptionOutput = {
  readonly knockedOutInitially: boolean;
  readonly optionPrice: number;
};

const payoff = (type: "call" | "put", spot: number, strike: number) =>
  Math.max(type === "call" ? spot - strike : strike - spot, 0);
const breached = (
  direction: BarrierOptionInput["barrierDirection"],
  spot: number,
  barrier: number,
) => (direction === "up-and-out" ? spot >= barrier : spot <= barrier);

export const calculateBarrierOption = (
  input: BarrierOptionInput,
): BarrierOptionOutput => {
  if (
    !(input.spotPrice > 0) ||
    !(input.strikePrice > 0) ||
    !(input.barrierPrice > 0)
  )
    simpleError(
      "spotPrice",
      "Spot, strike, and barrier prices must be greater than zero.",
    );
  if (!(input.timeToExpirationYears > 0) || !(input.volatilityPercent > 0))
    simpleError(
      "timeToExpirationYears",
      "Time and volatility must be greater than zero.",
    );
  if (
    !Number.isSafeInteger(input.steps) ||
    input.steps < 1 ||
    input.steps > 2_000
  )
    simpleError("steps", "Tree steps must be a whole number from 1 to 2,000.");
  if (breached(input.barrierDirection, input.spotPrice, input.barrierPrice))
    return { knockedOutInitially: true, optionPrice: 0 };
  const timeStep = input.timeToExpirationYears / input.steps;
  const rate = input.riskFreeRatePercent / 100;
  const yieldRate = input.dividendYieldPercent / 100;
  const up = Math.exp((input.volatilityPercent / 100) * Math.sqrt(timeStep));
  const down = 1 / up;
  const probability =
    (Math.exp((rate - yieldRate) * timeStep) - down) / (up - down);
  if (!(probability >= 0 && probability <= 1))
    simpleError(
      "steps",
      "Increase the step count to obtain a valid risk-neutral probability.",
      "invalid_probability",
    );
  const discount = Math.exp(-rate * timeStep);
  const values = Array.from({ length: input.steps + 1 }, (_, upMoves) => {
    const spot =
      input.spotPrice * up ** upMoves * down ** (input.steps - upMoves);
    return breached(input.barrierDirection, spot, input.barrierPrice)
      ? 0
      : payoff(input.optionType, spot, input.strikePrice);
  });
  for (let step = input.steps - 1; step >= 0; step -= 1) {
    for (let upMoves = 0; upMoves <= step; upMoves += 1) {
      const spot = input.spotPrice * up ** upMoves * down ** (step - upMoves);
      values[upMoves] = breached(
        input.barrierDirection,
        spot,
        input.barrierPrice,
      )
        ? 0
        : discount *
          (probability * values[upMoves + 1]! +
            (1 - probability) * values[upMoves]!);
    }
  }
  return { knockedOutInitially: false, optionPrice: values[0]! };
};

const exampleInput: BarrierOptionInput = {
  barrierDirection: "up-and-out",
  barrierPrice: 130,
  dividendYieldPercent: 0,
  optionType: "call",
  riskFreeRatePercent: 5,
  spotPrice: 100,
  steps: 100,
  strikePrice: 100,
  timeToExpirationYears: 1,
  volatilityPercent: 20,
};
export const barrierOptionExample = {
  input: exampleInput,
  output: calculateBarrierOption(exampleInput),
} satisfies ToolExample<BarrierOptionInput, BarrierOptionOutput>;

export const barrierOptionTool = createSimpleTool({
  calculate: (input) =>
    calculateBarrierOption({
      barrierDirection:
        input.barrierDirection as BarrierOptionInput["barrierDirection"],
      barrierPrice: input.barrierPrice as number,
      dividendYieldPercent: input.dividendYieldPercent as number,
      optionType: input.optionType as "call" | "put",
      riskFreeRatePercent: input.riskFreeRatePercent as number,
      spotPrice: input.spotPrice as number,
      steps: input.steps as number,
      strikePrice: input.strikePrice as number,
      timeToExpirationYears: input.timeToExpirationYears as number,
      volatilityPercent: input.volatilityPercent as number,
    }),
  description:
    "Estimate a discretely monitored up-and-out or down-and-out European option with a Cox-Ross-Rubinstein tree; barriers are checked only at tree dates, so results depend on the step count.",
  id: "finance/barrier-option-binomial",
  inputs: [
    { id: "spotPrice", kind: "number", label: "Spot price", minimum: 0 },
    { id: "strikePrice", kind: "number", label: "Strike price", minimum: 0 },
    { id: "barrierPrice", kind: "number", label: "Barrier price", minimum: 0 },
    {
      id: "timeToExpirationYears",
      kind: "number",
      label: "Time to expiration",
      minimum: 0,
      unit: "years",
    },
    {
      id: "riskFreeRatePercent",
      kind: "number",
      label: "Risk-free rate",
      unit: "%",
    },
    {
      id: "dividendYieldPercent",
      kind: "number",
      label: "Dividend yield",
      unit: "%",
    },
    {
      id: "volatilityPercent",
      kind: "number",
      label: "Annualized volatility",
      minimum: 0,
      unit: "%",
    },
    {
      enum: ["call", "put"],
      id: "optionType",
      kind: "string",
      label: "Option type",
    },
    {
      enum: ["up-and-out", "down-and-out"],
      id: "barrierDirection",
      kind: "string",
      label: "Barrier direction",
    },
    {
      id: "steps",
      kind: "integer",
      label: "Tree steps",
      maximum: 2_000,
      minimum: 1,
    },
  ],
  outputs: [
    { id: "optionPrice", kind: "number", label: "Barrier option price" },
    {
      id: "knockedOutInitially",
      kind: "boolean",
      label: "Knocked out initially",
    },
  ],
  title: "Barrier Option Binomial Calculator",
});
export const runBarrierOption = barrierOptionTool.execute;
export default barrierOptionTool;
