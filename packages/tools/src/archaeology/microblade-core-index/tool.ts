import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, aligned, mean } from "../shared.js";
export type Input = Readonly<{
  readonly coreScarWidthsMm: readonly (readonly number[])[];
  readonly platformWidthsMm: readonly number[];
  readonly callerMaximumScarToPlatformRatio: number;
}>;
export type Output = Readonly<{
  readonly meanScarToPlatformRatios: readonly number[];
  readonly belowCallerMicrobladeWidthRatioFlags: readonly number[];
}>;
const inputFields = [
  { id: "coreScarWidthsMm", label: "Core scar widths mm", kind: "matrix" },
  { id: "platformWidthsMm", label: "Platform widths mm", kind: "numberList" },
  {
    id: "callerMaximumScarToPlatformRatio",
    label: "Caller maximum scar to platform ratio",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.platformWidthsMm.forEach((v) => positive(v, "platformWidthsMm"));
  positive(
    input.callerMaximumScarToPlatformRatio,
    "callerMaximumScarToPlatformRatio",
  );
  aligned(input.coreScarWidthsMm, input.platformWidthsMm, "cores");
  if (input.coreScarWidthsMm.length > 128)
    simpleError("cores", "At most 128 cores supported.");
  const meanScarToPlatformRatios = input.coreScarWidthsMm.map((row, i) => {
    row.forEach((v) => positive(v, "coreScarWidthsMm"));
    return mean(row) / input.platformWidthsMm[i];
  });
  return {
    meanScarToPlatformRatios,
    belowCallerMicrobladeWidthRatioFlags: meanScarToPlatformRatios.map((v) =>
      v <= input.callerMaximumScarToPlatformRatio ? 1 : 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  coreScarWidthsMm: [
    [2, 4],
    [1, 1],
  ],
  platformWidthsMm: [10, 5],
  callerMaximumScarToPlatformRatio: 0.5,
} satisfies Input;
export const exampleOutput = {
  meanScarToPlatformRatios: [0.3, 0.2],
  belowCallerMicrobladeWidthRatioFlags: [1, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/microblade-core-index",
  title: "Microblade Core Index",
  description:
    "Compute per-core measured scar/platform width indexes with caller screening cutoff; no universal microblade identity or core reconstruction inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "meanScarToPlatformRatios",
      label: "Mean scar to platform ratios",
      kind: "numberList",
    },
    {
      id: "belowCallerMicrobladeWidthRatioFlags",
      label: "Below caller microblade width ratio flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      coreScarWidthsMm:
        value.coreScarWidthsMm as readonly (readonly number[])[],
      platformWidthsMm: value.platformWidthsMm as readonly number[],
      callerMaximumScarToPlatformRatio:
        value.callerMaximumScarToPlatformRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
