import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, onset } from "../shared.js";
export type Input = Readonly<{
  readonly timesMs: readonly number[];
  readonly diametersMm: readonly number[];
  readonly stimulusTimeMs: number;
  readonly baselineDiameterMm: number;
  readonly requiredConstrictionMm: number;
}>;
export type Output = Readonly<{
  readonly onsetTimeMs: number;
  readonly latencyMs: number;
}>;
const inputFields = [
  { id: "timesMs", label: "Times ms", kind: "numberList" },
  { id: "diametersMm", label: "Diameters mm", kind: "numberList" },
  { id: "stimulusTimeMs", label: "Stimulus time ms", kind: "number" },
  { id: "baselineDiameterMm", label: "Baseline diameter mm", kind: "number" },
  {
    id: "requiredConstrictionMm",
    label: "Required constriction mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.baselineDiameterMm, "baselineDiameterMm");
  positive(input.requiredConstrictionMm, "requiredConstrictionMm");
  input.diametersMm.forEach((v) => positive(v, "diametersMm"));
  const onsetTimeMs = onset(
    input.timesMs,
    input.diametersMm,
    input.stimulusTimeMs,
    input.baselineDiameterMm - input.requiredConstrictionMm,
    -1,
  );
  return { onsetTimeMs, latencyMs: onsetTimeMs - input.stimulusTimeMs };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  timesMs: [0, 100, 200, 300],
  diametersMm: [4, 4, 3, 2],
  stimulusTimeMs: 100,
  baselineDiameterMm: 4,
  requiredConstrictionMm: 0.5,
} satisfies Input;
export const exampleOutput = {
  onsetTimeMs: 150,
  latencyMs: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/pupillary-constriction-onset",
  title: "Pupillary Light Reflex Latency",
  description:
    "Find the interpolated first pupil constriction threshold crossing after a stimulus using supplied baseline and amplitude criterion; missing crossings return an error, not a fabricated latency.",
  inputs: inputFields,
  outputs: [
    { id: "onsetTimeMs", label: "Onset time ms", kind: "number" },
    { id: "latencyMs", label: "Latency ms", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      timesMs: value.timesMs as readonly number[],
      diametersMm: value.diametersMm as readonly number[],
      stimulusTimeMs: value.stimulusTimeMs as number,
      baselineDiameterMm: value.baselineDiameterMm as number,
      requiredConstrictionMm: value.requiredConstrictionMm as number,
    }),
});
export const run = tool.execute;
export default tool;
