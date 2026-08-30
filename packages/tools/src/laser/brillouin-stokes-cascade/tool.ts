import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly pumpFrequencyTerahertz: number;
  readonly brillouinShiftGigahertz: number;
  readonly stokesOrderCount: number;
}>;
export type Output = Readonly<{
  readonly stokesFrequenciesTerahertz: readonly number[];
  readonly finalFrequencyTerahertz: number;
}>;

export const calculate = (input: Input): Output => {
  const shift = input.brillouinShiftGigahertz / 1000;
  const stokesFrequenciesTerahertz = Array.from(
    { length: input.stokesOrderCount },
    (_, index) => input.pumpFrequencyTerahertz - (index + 1) * shift,
  );
  if (stokesFrequenciesTerahertz.some((value) => value <= 0))
    simpleError(
      "stokesOrderCount",
      "Cascade reaches a nonpositive frequency.",
      "invalid_cascade",
    );
  return {
    stokesFrequenciesTerahertz,
    finalFrequencyTerahertz: stokesFrequenciesTerahertz.at(-1)!,
  };
};

export const exampleInput = {
  pumpFrequencyTerahertz: 200,
  brillouinShiftGigahertz: 10,
  stokesOrderCount: 3,
} satisfies Input;
export const exampleOutput = {
  stokesFrequenciesTerahertz: [199.99, 199.98, 199.97],
  finalFrequencyTerahertz: 199.97,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      pumpFrequencyTerahertz: input.pumpFrequencyTerahertz as number,
      brillouinShiftGigahertz: input.brillouinShiftGigahertz as number,
      stokesOrderCount: input.stokesOrderCount as number,
    }),
  description:
    "Generate cascaded Brillouin Stokes frequencies from a pump and fixed shift.",
  id: "laser/brillouin-stokes-cascade",
  inputs: [
    {
      id: "pumpFrequencyTerahertz",
      label: "Pump frequency",
      kind: "number",
      minimum: 0,
      unit: "THz",
    },
    {
      id: "brillouinShiftGigahertz",
      label: "Brillouin shift",
      kind: "number",
      minimum: 0,
      unit: "GHz",
    },
    {
      id: "stokesOrderCount",
      label: "Stokes order count",
      kind: "integer",
      minimum: 1,
      maximum: 100,
    },
  ],
  outputs: [
    {
      id: "stokesFrequenciesTerahertz",
      label: "Stokes frequencies",
      kind: "numberList",
      unit: "THz",
    },
    {
      id: "finalFrequencyTerahertz",
      label: "Final Stokes frequency",
      kind: "number",
      minimum: 0,
      unit: "THz",
    },
  ],
  title: "Brillouin Stokes Cascade",
});

export const run = tool.execute;
export default tool;
