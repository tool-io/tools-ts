import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  money,
  roundMinor,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualStakeMinorUnits: number;
  readonly callerActualNetOddsNumerator: number;
  readonly callerActualNetOddsDenominator: number;
  readonly actualWin: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualStakeMinorUnits",
    label: "Actual stake minor units",
    kind: "number",
  },
  {
    id: "callerActualNetOddsNumerator",
    label: "Caller actual net odds numerator",
    kind: "number",
  },
  {
    id: "callerActualNetOddsDenominator",
    label: "Caller actual net odds denominator",
    kind: "number",
  },
  { id: "actualWin", label: "Actual win", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  money(input.actualStakeMinorUnits, "stake");
  bounded(input.callerActualNetOddsNumerator, "oddsnum", 0, 1000000);
  bounded(input.callerActualNetOddsDenominator, "oddsden", 1, 1000000);
  const profit = roundMinor(
    BigInt(input.actualStakeMinorUnits) *
      BigInt(input.callerActualNetOddsNumerator),
    BigInt(input.callerActualNetOddsDenominator),
  );
  return {
    netChangeMinorUnits: input.actualWin
      ? profit
      : -input.actualStakeMinorUnits,
    grossReturnMinorUnits: input.actualWin
      ? input.actualStakeMinorUnits + profit
      : 0,
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualStakeMinorUnits: 10,
    callerActualNetOddsNumerator: 35,
    callerActualNetOddsDenominator: 1,
    actualWin: true,
  },
  output: { result: { netChangeMinorUnits: 350, grossReturnMinorUnits: 360 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/roulette-payout",
  title: "Roulette Payout Calculator",
  description:
    "ActualcallerverifiedrouletteNEToddsledger,not infer winningprobability/roulettewheelrules;exacthalf-awaycurrencyminorunits. Boundedoffline arithmetic/sampling only;not gambling advice,fair physical randomness,secure randomness or predictive certainty.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
