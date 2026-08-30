import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { ordered } from "../shared.js";

export type Input = Readonly<{
  readonly eastRatesArcsecPerHour: readonly number[];
  readonly northRatesArcsecPerHour: readonly number[];
  readonly exposureOffsetsHours: readonly number[];
}>;
export type Output = Readonly<{
  readonly candidateRates: readonly (readonly number[])[];
  readonly eastShiftArcseconds: readonly (readonly number[])[];
  readonly northShiftArcseconds: readonly (readonly number[])[];
}>;
export const calculate = (input: Input): Output => {
  ordered(input.eastRatesArcsecPerHour, "eastRatesArcsecPerHour");
  ordered(input.northRatesArcsecPerHour, "northRatesArcsecPerHour");
  ordered(input.exposureOffsetsHours, "exposureOffsetsHours");
  if (
    input.eastRatesArcsecPerHour.length * input.northRatesArcsecPerHour.length >
      128 ||
    input.exposureOffsetsHours.length > 128
  )
    simpleError(
      "eastRatesArcsecPerHour",
      "At most 128 candidate rates and 128 exposure offsets are supported.",
    );
  const candidateRates = input.eastRatesArcsecPerHour.flatMap((x) =>
    input.northRatesArcsecPerHour.map((y) => [x, y]),
  );
  return {
    candidateRates,
    eastShiftArcseconds: candidateRates.map(([x]) =>
      input.exposureOffsetsHours.map((t) => x * t),
    ),
    northShiftArcseconds: candidateRates.map(([, y]) =>
      input.exposureOffsetsHours.map((t) => y * t),
    ),
  };
};
export const exampleInput = {
  eastRatesArcsecPerHour: [0, 1],
  northRatesArcsecPerHour: [0, 1],
  exposureOffsetsHours: [0, 1],
} satisfies Input;
export const exampleOutput = {
  candidateRates: [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ],
  eastShiftArcseconds: [
    [0, 0],
    [0, 0],
    [0, 1],
    [0, 1],
  ],
  northShiftArcseconds: [
    [0, 0],
    [0, 1],
    [0, 0],
    [0, 1],
  ],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/shift-stack-rate-offset-grid",
  title: "Shift Stack Rate Offset Grid",
  description:
    "Plan every east/north rate-grid shift for exposures relative to a supplied time origin; linear tangent-plane motion is assumed.",
  inputs: [
    {
      id: "eastRatesArcsecPerHour",
      label: "East rates arcsec per hour",
      kind: "numberList",
    },
    {
      id: "northRatesArcsecPerHour",
      label: "North rates arcsec per hour",
      kind: "numberList",
    },
    {
      id: "exposureOffsetsHours",
      label: "Exposure offsets hours",
      kind: "numberList",
    },
  ],
  outputs: [
    { id: "candidateRates", label: "Candidate rates", kind: "matrix" },
    {
      id: "eastShiftArcseconds",
      label: "East shift arcseconds",
      kind: "matrix",
    },
    {
      id: "northShiftArcseconds",
      label: "North shift arcseconds",
      kind: "matrix",
    },
  ],
  calculate: (value) =>
    calculate({
      eastRatesArcsecPerHour: value.eastRatesArcsecPerHour as readonly number[],
      northRatesArcsecPerHour:
        value.northRatesArcsecPerHour as readonly number[],
      exposureOffsetsHours: value.exposureOffsetsHours as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
