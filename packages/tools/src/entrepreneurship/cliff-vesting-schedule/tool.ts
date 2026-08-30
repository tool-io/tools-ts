import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { count } from "../shared.js";

export type Input = Readonly<{
  readonly totalShares: number;
  readonly vestingMonths: number;
  readonly cliffMonths: number;
  readonly elapsedMonths: readonly number[];
}>;
export type Output = Readonly<{
  readonly vestedShares: readonly number[];
  readonly unvestedShares: readonly number[];
}>;
export const calculate = (input: Input): Output => {
  count(input.totalShares, "totalShares");
  count(input.vestingMonths, "vestingMonths", 1);
  count(input.cliffMonths, "cliffMonths");
  if (input.cliffMonths > input.vestingMonths)
    simpleError("cliffMonths", "Cliff cannot exceed vesting duration.");
  input.elapsedMonths.forEach((v) => count(v, "elapsedMonths"));
  const vestedShares = input.elapsedMonths.map((v) =>
    v < input.cliffMonths
      ? 0
      : Math.floor(
          (input.totalShares * Math.min(v, input.vestingMonths)) /
            input.vestingMonths,
        ),
  );
  return {
    vestedShares,
    unvestedShares: vestedShares.map((v) => input.totalShares - v),
  };
};
export const exampleInput = {
  totalShares: 4800,
  vestingMonths: 48,
  cliffMonths: 12,
  elapsedMonths: [0, 11, 12, 24, 48],
} satisfies Input;
export const exampleOutput = {
  vestedShares: [0, 0, 1200, 2400, 4800],
  unvestedShares: [4800, 4800, 3600, 2400, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/cliff-vesting-schedule",
  title: "Cliff Vesting Schedule",
  description:
    "Calculate whole vested shares at selected months for linear monthly vesting with a cliff.",
  inputs: [
    { id: "totalShares", label: "Total shares", kind: "integer" },
    { id: "vestingMonths", label: "Vesting months", kind: "integer" },
    { id: "cliffMonths", label: "Cliff months", kind: "integer" },
    { id: "elapsedMonths", label: "Elapsed months", kind: "numberList" },
  ],
  outputs: [
    { id: "vestedShares", label: "Vested shares", kind: "numberList" },
    { id: "unvestedShares", label: "Unvested shares", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      totalShares: value.totalShares as number,
      vestingMonths: value.vestingMonths as number,
      cliffMonths: value.cliffMonths as number,
      elapsedMonths: value.elapsedMonths as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
