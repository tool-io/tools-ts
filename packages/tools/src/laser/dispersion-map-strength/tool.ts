import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly segmentDispersionPs2: readonly number[];
  readonly referencePulseWidthPs: number;
}>;
export type Output = Readonly<{
  readonly netDispersionPs2: number;
  readonly absoluteDispersionPs2: number;
  readonly mapStrength: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.segmentDispersionPs2.length === 0 ||
    input.referencePulseWidthPs <= 0
  )
    simpleError(
      "segmentDispersionPs2",
      "Segments must be nonempty and pulse width positive.",
      "invalid_map",
    );
  const netDispersionPs2 = input.segmentDispersionPs2.reduce(
    (a, b) => a + b,
    0,
  );
  const absoluteDispersionPs2 = input.segmentDispersionPs2.reduce(
    (sum, value) => sum + Math.abs(value),
    0,
  );
  return {
    netDispersionPs2,
    absoluteDispersionPs2,
    mapStrength: absoluteDispersionPs2 / input.referencePulseWidthPs ** 2,
  };
};

export const exampleInput = {
  segmentDispersionPs2: [2, -1.5],
  referencePulseWidthPs: 0.5,
} satisfies Input;
export const exampleOutput = {
  netDispersionPs2: 0.5,
  absoluteDispersionPs2: 3.5,
  mapStrength: 14,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      segmentDispersionPs2: input.segmentDispersionPs2 as readonly number[],
      referencePulseWidthPs: input.referencePulseWidthPs as number,
    }),
  description:
    "Calculate net, absolute, and pulse-width-normalized dispersion-map strength.",
  id: "laser/dispersion-map-strength",
  inputs: [
    {
      id: "segmentDispersionPs2",
      label: "Segment dispersion contributions",
      kind: "numberList",
      unit: "ps²",
    },
    {
      id: "referencePulseWidthPs",
      label: "Reference pulse width",
      kind: "number",
      minimum: 0,
      unit: "ps",
    },
  ],
  outputs: [
    {
      id: "netDispersionPs2",
      label: "Net map dispersion",
      kind: "number",
      unit: "ps²",
    },
    {
      id: "absoluteDispersionPs2",
      label: "Sum of absolute dispersion",
      kind: "number",
      minimum: 0,
      unit: "ps²",
    },
    {
      id: "mapStrength",
      label: "Normalized dispersion-map strength",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Dispersion-Map Strength",
});

export const run = tool.execute;
export default tool;
