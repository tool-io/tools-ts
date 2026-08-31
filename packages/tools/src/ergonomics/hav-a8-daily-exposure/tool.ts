import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  shape,
  sum,
} from "../shared.js";
export type Input = Readonly<{
  readonly frequencyWeightedAccelerationAxesMPerS2: readonly (readonly number[])[];
  readonly representedExposureHours: readonly number[];
  readonly callerReferenceHours: number;
}>;
export type Output = Readonly<{
  readonly eightHourEquivalentAccelerationMPerS2: number;
  readonly totalExposureHours: number;
}>;
const inputFields = [
  {
    id: "frequencyWeightedAccelerationAxesMPerS2",
    label: "Frequency weighted acceleration axes m per s2",
    kind: "matrix",
  },
  {
    id: "representedExposureHours",
    label: "Represented exposure hours",
    kind: "numberList",
  },
  {
    id: "callerReferenceHours",
    label: "Caller reference hours",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerReferenceHours, "callerReferenceHours");
  if (input.callerReferenceHours !== 8)
    simpleError(
      "callerReferenceHours",
      "A(8) requires exactly eight reference hours.",
    );
  input.representedExposureHours.forEach((v) =>
    nonnegative(v, "representedExposureHours"),
  );
  aligned(
    input.frequencyWeightedAccelerationAxesMPerS2,
    input.representedExposureHours,
    "frequencyWeightedAccelerationAxesMPerS2",
  );
  if (
    shape(input.frequencyWeightedAccelerationAxesMPerS2, "axes") !== 3 ||
    sum(input.representedExposureHours) > 24
  )
    simpleError(
      "exposure",
      "Three already frequency-weighted orthogonal axes per segment and at most 24h daily exposure required.",
    );
  const v = input.frequencyWeightedAccelerationAxesMPerS2.reduce(
    (s, r, i) =>
      s +
      (r.reduce((a, b) => a + b * b, 0) * input.representedExposureHours[i]) /
        input.callerReferenceHours,
    0,
  );
  return {
    eightHourEquivalentAccelerationMPerS2: Math.sqrt(v),
    totalExposureHours: sum(input.representedExposureHours),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  frequencyWeightedAccelerationAxesMPerS2: [
    [3, 4, 0],
    [0, 0, 2],
  ],
  representedExposureHours: [2, 2],
  callerReferenceHours: 8,
} satisfies Input;
export const exampleOutput = {
  eightHourEquivalentAccelerationMPerS2: 2.692582403567252,
  totalExposureHours: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/hav-a8-daily-exposure",
  title: "Hand-Arm Vibration A(8) Daily Exposure Calculator",
  description:
    "Normalize vector-summed already frequency-weighted hand-arm RMS acceleration over exactly eight reference hours (caller reference must be 8); no raw-signal filtering, exposure limit or medical/safe-work recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "eightHourEquivalentAccelerationMPerS2",
      label: "Eight hour equivalent acceleration m per s2",
      kind: "number",
    },
    { id: "totalExposureHours", label: "Total exposure hours", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      frequencyWeightedAccelerationAxesMPerS2:
        value.frequencyWeightedAccelerationAxesMPerS2 as readonly (readonly number[])[],
      representedExposureHours:
        value.representedExposureHours as readonly number[],
      callerReferenceHours: value.callerReferenceHours as number,
    }),
});
export const run = tool.execute;
export default tool;
