import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly releasedLakeVolumeM3: number;
  readonly referenceVolumeM3: number;
  readonly coefficientBoundsM3PerSecond: readonly number[];
  readonly volumeExponent: number;
}>;
export type Output = Readonly<{
  readonly peakDischargeEnvelopeM3PerSecond: readonly number[];
}>;
const inputFields = [
  {
    id: "releasedLakeVolumeM3",
    label: "Released lake volume m3",
    kind: "number",
  },
  { id: "referenceVolumeM3", label: "Reference volume m3", kind: "number" },
  {
    id: "coefficientBoundsM3PerSecond",
    label: "Coefficient bounds m3 per second",
    kind: "numberList",
  },
  { id: "volumeExponent", label: "Volume exponent", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.referenceVolumeM3, "referenceVolumeM3");
  positive(input.volumeExponent, "volumeExponent");
  nonnegative(input.releasedLakeVolumeM3, "releasedLakeVolumeM3");
  input.coefficientBoundsM3PerSecond.forEach((v) =>
    nonnegative(v, "coefficientBoundsM3PerSecond"),
  );
  if (
    input.coefficientBoundsM3PerSecond.length !== 2 ||
    input.coefficientBoundsM3PerSecond[0] >
      input.coefficientBoundsM3PerSecond[1]
  )
    simpleError(
      "coefficientBoundsM3PerSecond",
      "Ordered two-bound empirical coefficients required.",
    );
  return {
    peakDischargeEnvelopeM3PerSecond: input.coefficientBoundsM3PerSecond.map(
      (c) =>
        c *
        (input.releasedLakeVolumeM3 / input.referenceVolumeM3) **
          input.volumeExponent,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  releasedLakeVolumeM3: 1000,
  referenceVolumeM3: 1000,
  coefficientBoundsM3PerSecond: [10, 20],
  volumeExponent: 0.5,
} satisfies Input;
export const exampleOutput = {
  peakDischargeEnvelopeM3PerSecond: [10, 20],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/glof-peak-discharge-envelope",
  title: "GLOF Peak Discharge Envelope",
  description:
    "Evaluate a caller empirical GLOF discharge coefficient envelope against normalized released volume; envelope is not a probability interval, dam-break hydrograph or safety assessment.",
  inputs: inputFields,
  outputs: [
    {
      id: "peakDischargeEnvelopeM3PerSecond",
      label: "Peak discharge envelope m3 per second",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      releasedLakeVolumeM3: value.releasedLakeVolumeM3 as number,
      referenceVolumeM3: value.referenceVolumeM3 as number,
      coefficientBoundsM3PerSecond:
        value.coefficientBoundsM3PerSecond as readonly number[],
      volumeExponent: value.volumeExponent as number,
    }),
});
export const run = tool.execute;
export default tool;
