import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  ordered,
} from "../shared.js";
export type Input = Readonly<{
  readonly timesSeconds: readonly number[];
  readonly diametersMm: readonly number[];
}>;
export type Output = Readonly<{
  readonly totalAbsoluteDiameterChangeMm: number;
  readonly unrestMmPerMinute: number;
}>;
const inputFields = [
  { id: "timesSeconds", label: "Times seconds", kind: "numberList" },
  { id: "diametersMm", label: "Diameters mm", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.timesSeconds, input.diametersMm, "timesSeconds");
  ordered(input.timesSeconds, "timesSeconds");
  input.diametersMm.forEach((v) => positive(v, "diametersMm"));
  const totalAbsoluteDiameterChangeMm = input.diametersMm
    .slice(1)
    .reduce((s, v, i) => s + Math.abs(v - input.diametersMm[i]), 0);
  return {
    totalAbsoluteDiameterChangeMm,
    unrestMmPerMinute:
      (60 * totalAbsoluteDiameterChangeMm) /
      (input.timesSeconds.at(-1)! - input.timesSeconds[0]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  timesSeconds: [0, 1, 2],
  diametersMm: [4, 3, 4],
} satisfies Input;
export const exampleOutput = {
  totalAbsoluteDiameterChangeMm: 2,
  unrestMmPerMinute: 60,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/pupillary-unrest-normalized-rate",
  title: "Pupillary Unrest Index",
  description:
    "Compute absolute pupil diameter path change per minute from uniformly processed samples; cadence, smoothing and blink interpolation materially affect this unrest measure.",
  inputs: inputFields,
  outputs: [
    {
      id: "totalAbsoluteDiameterChangeMm",
      label: "Total absolute diameter change mm",
      kind: "number",
    },
    { id: "unrestMmPerMinute", label: "Unrest mm per minute", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      timesSeconds: value.timesSeconds as readonly number[],
      diametersMm: value.diametersMm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
