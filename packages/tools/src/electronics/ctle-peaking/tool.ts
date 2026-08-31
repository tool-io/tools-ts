import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly queryFrequenciesHz: readonly number[];
  readonly zeroFrequencyHz: number;
  readonly firstPoleFrequencyHz: number;
  readonly secondPoleFrequencyHz: number;
}>;
export type Output = Readonly<{
  readonly relativeToDcGainDb: readonly number[];
}>;
const inputFields = [
  {
    id: "queryFrequenciesHz",
    label: "Query frequencies hz",
    kind: "numberList",
  },
  { id: "zeroFrequencyHz", label: "Zero frequency hz", kind: "number" },
  {
    id: "firstPoleFrequencyHz",
    label: "First pole frequency hz",
    kind: "number",
  },
  {
    id: "secondPoleFrequencyHz",
    label: "Second pole frequency hz",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.zeroFrequencyHz, "zeroFrequencyHz");
  positive(input.firstPoleFrequencyHz, "firstPoleFrequencyHz");
  positive(input.secondPoleFrequencyHz, "secondPoleFrequencyHz");
  input.queryFrequenciesHz.forEach((v) => nonnegative(v, "queryFrequenciesHz"));
  return {
    relativeToDcGainDb: input.queryFrequenciesHz.map(
      (f) =>
        (10 / Math.LN10) *
        (Math.log1p((f / input.zeroFrequencyHz) ** 2) -
          Math.log1p((f / input.firstPoleFrequencyHz) ** 2) -
          Math.log1p((f / input.secondPoleFrequencyHz) ** 2)),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  queryFrequenciesHz: [0, 100],
  zeroFrequencyHz: 100,
  firstPoleFrequencyHz: 1000,
  secondPoleFrequencyHz: 1000,
} satisfies Input;
export const exampleOutput = {
  relativeToDcGainDb: [0, 2.9238724809869607],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "electronics/ctle-peaking",
  title: "Ctle Peaking Calculator",
  description:
    "Evaluate explicit normalized single-zero/two-pole CTLE small-signal transfer at actual caller frequencies relative to DC, not a universal equalizer setting or eye/BER guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "relativeToDcGainDb",
      label: "Relative to dc gain db",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      queryFrequenciesHz: value.queryFrequenciesHz as readonly number[],
      zeroFrequencyHz: value.zeroFrequencyHz as number,
      firstPoleFrequencyHz: value.firstPoleFrequencyHz as number,
      secondPoleFrequencyHz: value.secondPoleFrequencyHz as number,
    }),
});
export const run = tool.execute;
export default tool;
