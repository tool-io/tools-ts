import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const roundHalfToEvenExample = {
  input: { decimals: 0, value: 2.5 },
  output: { rounded: 2 },
} satisfies ToolExample<RoundHalfToEvenInput, RoundHalfToEvenOutput>;

type RoundHalfToEvenInput = {
  readonly decimals: number;
  readonly value: number;
};
type RoundHalfToEvenOutput = { readonly rounded: number };

export const calculateRoundHalfToEven = (
  input: RoundHalfToEvenInput,
): RoundHalfToEvenOutput => {
  const factor = Math.pow(10, input.decimals);
  const scaled = input.value * factor;
  const floorV = Math.floor(scaled);
  const diff = scaled - floorV;
  let result: number;
  const tieTolerance = Number.EPSILON * Math.max(1, Math.abs(scaled)) * 4;
  if (Math.abs(diff - 0.5) <= tieTolerance) {
    result = floorV % 2 === 0 ? floorV : floorV + 1;
  } else {
    result = Math.round(scaled);
  }
  return { rounded: result / factor };
};

export const roundHalfToEvenTool = createSimpleTool({
  calculate: (input) =>
    calculateRoundHalfToEven(input as unknown as RoundHalfToEvenInput),
  description:
    "Round to a specified number of decimal places using banker's rounding (half to even).",
  id: "arithmetic/round-half-to-even",
  inputs: [
    { id: "value", kind: "number", label: "Value" },
    {
      id: "decimals",
      kind: "integer",
      label: "Decimal places",
      maximum: 10,
      minimum: 0,
    },
  ],
  outputs: [{ id: "rounded", kind: "number", label: "Rounded value" }],
  title: "Round Half to Even Calculator",
});
export const runRoundHalfToEven = roundHalfToEvenTool.execute;
export default roundHalfToEvenTool;
