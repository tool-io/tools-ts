import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../batch33-shared.js";
export type Input = Readonly<{
  readonly observedMixPeakDbfs: readonly number[];
  readonly callerReservedPeakCeilingDbfs: number;
}>;
export type Output = Readonly<{
  readonly signedPeakMarginsDb: readonly number[];
  readonly peakSamplesAboveCallerReserveIndices: readonly number[];
  readonly worstObservedPeakDbfs: number;
}>;
const inputFields = [
  {
    id: "observedMixPeakDbfs",
    label: "Observed mix peak dbfs",
    kind: "numberList",
  },
  {
    id: "callerReservedPeakCeilingDbfs",
    label: "Caller reserved peak ceiling dbfs",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    !input.observedMixPeakDbfs.length ||
    input.observedMixPeakDbfs.some((v) => v > 0) ||
    input.callerReservedPeakCeilingDbfs > 0
  )
    simpleError(
      "dbfs",
      "Actual nonpositive dBFS sample peaks and caller reserve ceiling required.",
    );
  return {
    signedPeakMarginsDb: input.observedMixPeakDbfs.map(
      (v) => input.callerReservedPeakCeilingDbfs - v,
    ),
    peakSamplesAboveCallerReserveIndices: input.observedMixPeakDbfs.flatMap(
      (v, i) => (v > input.callerReservedPeakCeilingDbfs ? [i] : []),
    ),
    worstObservedPeakDbfs: Math.max(...input.observedMixPeakDbfs),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMixPeakDbfs: [-6, -2],
  callerReservedPeakCeilingDbfs: -3,
} satisfies Input;
export const exampleOutput = {
  signedPeakMarginsDb: [3, -1],
  peakSamplesAboveCallerReserveIndices: [1],
  worstObservedPeakDbfs: -2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/dbfs-headroom-live-mix-peaks-margin-calculator",
  title: "DBFS Headroom Live Mix Peaks Margin Calculator",
  description:
    "Audit measured sample dBFS peak inventory against caller reserved ceiling; no unobserved intersample true-peak, loudness normalization, limiter or hearing-safety claim.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedPeakMarginsDb",
      label: "Signed peak margins db",
      kind: "numberList",
    },
    {
      id: "peakSamplesAboveCallerReserveIndices",
      label: "Peak samples above caller reserve indices",
      kind: "numberList",
    },
    {
      id: "worstObservedPeakDbfs",
      label: "Worst observed peak dbfs",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedMixPeakDbfs: value.observedMixPeakDbfs as readonly number[],
      callerReservedPeakCeilingDbfs:
        value.callerReservedPeakCeilingDbfs as number,
    }),
});
export const run = tool.execute;
export default tool;
