import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly coincidenceRatePerSecond: number;
  readonly firstSinglesRatePerSecond: number;
  readonly secondSinglesRatePerSecond: number;
  readonly coincidenceWindowSeconds: number;
}>;
export type Output = Readonly<{
  readonly g2Zero: number;
}>;

export const calculate = (input: Input): Output => {
  const denominator =
    input.firstSinglesRatePerSecond *
    input.secondSinglesRatePerSecond *
    input.coincidenceWindowSeconds;
  if (denominator <= 0)
    simpleError(
      "firstSinglesRatePerSecond",
      "Singles rates and window must produce a positive denominator.",
      "invalid_denominator",
    );
  return { g2Zero: input.coincidenceRatePerSecond / denominator };
};

export const exampleInput = {
  coincidenceRatePerSecond: 100,
  firstSinglesRatePerSecond: 100000,
  secondSinglesRatePerSecond: 100000,
  coincidenceWindowSeconds: 1e-8,
} satisfies Input;
export const exampleOutput = { g2Zero: 1 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      coincidenceRatePerSecond: input.coincidenceRatePerSecond as number,
      firstSinglesRatePerSecond: input.firstSinglesRatePerSecond as number,
      secondSinglesRatePerSecond: input.secondSinglesRatePerSecond as number,
      coincidenceWindowSeconds: input.coincidenceWindowSeconds as number,
    }),
  description: "Calculate normalized zero-delay HBT second-order correlation.",
  id: "laser/hbt-correlation",
  inputs: [
    {
      id: "coincidenceRatePerSecond",
      label: "Coincidence rate",
      kind: "number",
      minimum: 0,
      unit: "1/s",
    },
    {
      id: "firstSinglesRatePerSecond",
      label: "First singles rate",
      kind: "number",
      minimum: 0,
      unit: "1/s",
    },
    {
      id: "secondSinglesRatePerSecond",
      label: "Second singles rate",
      kind: "number",
      minimum: 0,
      unit: "1/s",
    },
    {
      id: "coincidenceWindowSeconds",
      label: "Coincidence window",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
  ],
  outputs: [
    {
      id: "g2Zero",
      label: "Second-order correlation g²(0)",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "HBT Correlation",
});

export const run = tool.execute;
export default tool;
