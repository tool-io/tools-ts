import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly gainMinimumNanometers: number;
  readonly gainMaximumNanometers: number;
  readonly targetMinimumNanometers: number;
  readonly targetMaximumNanometers: number;
}>;
export type Output = Readonly<{
  readonly overlapNanometers: number;
  readonly targetCoveragePercent: number;
  readonly fullyCovered: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.gainMinimumNanometers > input.gainMaximumNanometers ||
    input.targetMinimumNanometers >= input.targetMaximumNanometers
  )
    simpleError(
      "gainMinimumNanometers",
      "Band bounds must be ordered.",
      "invalid_bands",
    );
  const overlapNanometers = Math.max(
    0,
    Math.min(input.gainMaximumNanometers, input.targetMaximumNanometers) -
      Math.max(input.gainMinimumNanometers, input.targetMinimumNanometers),
  );
  return {
    overlapNanometers,
    targetCoveragePercent:
      (overlapNanometers /
        (input.targetMaximumNanometers - input.targetMinimumNanometers)) *
      100,
    fullyCovered:
      input.gainMinimumNanometers <= input.targetMinimumNanometers &&
      input.gainMaximumNanometers >= input.targetMaximumNanometers,
  };
};

export const exampleInput = {
  gainMinimumNanometers: 1300,
  gainMaximumNanometers: 1500,
  targetMinimumNanometers: 1400,
  targetMaximumNanometers: 1600,
} satisfies Input;
export const exampleOutput = {
  overlapNanometers: 100,
  targetCoveragePercent: 50,
  fullyCovered: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      gainMinimumNanometers: input.gainMinimumNanometers as number,
      gainMaximumNanometers: input.gainMaximumNanometers as number,
      targetMinimumNanometers: input.targetMinimumNanometers as number,
      targetMaximumNanometers: input.targetMaximumNanometers as number,
    }),
  description:
    "Measure BDFA gain-window coverage of a caller-supplied target band.",
  id: "laser/bdfa-band-coverage",
  inputs: [
    {
      id: "gainMinimumNanometers",
      label: "BDFA gain minimum",
      kind: "number",
      unit: "nm",
    },
    {
      id: "gainMaximumNanometers",
      label: "BDFA gain maximum",
      kind: "number",
      unit: "nm",
    },
    {
      id: "targetMinimumNanometers",
      label: "Target band minimum",
      kind: "number",
      unit: "nm",
    },
    {
      id: "targetMaximumNanometers",
      label: "Target band maximum",
      kind: "number",
      unit: "nm",
    },
  ],
  outputs: [
    {
      id: "overlapNanometers",
      label: "Band overlap",
      kind: "number",
      minimum: 0,
      unit: "nm",
    },
    {
      id: "targetCoveragePercent",
      label: "Target-band coverage",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    { id: "fullyCovered", label: "Target fully covered", kind: "boolean" },
  ],
  title: "BDFA Band Coverage",
});

export const run = tool.execute;
export default tool;
