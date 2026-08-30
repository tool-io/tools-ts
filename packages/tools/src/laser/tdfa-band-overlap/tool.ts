import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly gainMinimumNanometers: number;
  readonly gainMaximumNanometers: number;
  readonly signalMinimumNanometers: number;
  readonly signalMaximumNanometers: number;
}>;
export type Output = Readonly<{
  readonly overlapNanometers: number;
  readonly signalCoveragePercent: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.gainMinimumNanometers > input.gainMaximumNanometers ||
    input.signalMinimumNanometers >= input.signalMaximumNanometers
  )
    simpleError(
      "gainMinimumNanometers",
      "Band bounds must be ordered.",
      "invalid_bands",
    );
  const overlapNanometers = Math.max(
    0,
    Math.min(input.gainMaximumNanometers, input.signalMaximumNanometers) -
      Math.max(input.gainMinimumNanometers, input.signalMinimumNanometers),
  );
  return {
    overlapNanometers,
    signalCoveragePercent:
      (overlapNanometers /
        (input.signalMaximumNanometers - input.signalMinimumNanometers)) *
      100,
  };
};

export const exampleInput = {
  gainMinimumNanometers: 1450,
  gainMaximumNanometers: 1500,
  signalMinimumNanometers: 1475,
  signalMaximumNanometers: 1525,
} satisfies Input;
export const exampleOutput = {
  overlapNanometers: 25,
  signalCoveragePercent: 50,
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
      signalMinimumNanometers: input.signalMinimumNanometers as number,
      signalMaximumNanometers: input.signalMaximumNanometers as number,
    }),
  description:
    "Calculate overlap between TDFA gain and a requested signal band.",
  id: "laser/tdfa-band-overlap",
  inputs: [
    {
      id: "gainMinimumNanometers",
      label: "TDFA gain minimum",
      kind: "number",
      unit: "nm",
    },
    {
      id: "gainMaximumNanometers",
      label: "TDFA gain maximum",
      kind: "number",
      unit: "nm",
    },
    {
      id: "signalMinimumNanometers",
      label: "Signal minimum",
      kind: "number",
      unit: "nm",
    },
    {
      id: "signalMaximumNanometers",
      label: "Signal maximum",
      kind: "number",
      unit: "nm",
    },
  ],
  outputs: [
    {
      id: "overlapNanometers",
      label: "Signal/gain overlap",
      kind: "number",
      minimum: 0,
      unit: "nm",
    },
    {
      id: "signalCoveragePercent",
      label: "Signal coverage",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  title: "TDFA Band Overlap",
});

export const run = tool.execute;
export default tool;
