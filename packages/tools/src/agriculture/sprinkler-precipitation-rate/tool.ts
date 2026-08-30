import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly catchCollectedVolumesMl: readonly number[];
  readonly catchOpeningAreasCm2: readonly number[];
  readonly representedGroundAreasM2: readonly number[];
  readonly testDurationMinutes: number;
}>;
export type Output = Readonly<{
  readonly localPrecipitationRatesMmPerHour: readonly number[];
  readonly areaWeightedPrecipitationRateMmPerHour: number;
}>;
const inputFields = [
  {
    id: "catchCollectedVolumesMl",
    label: "Catch collected volumes ml",
    kind: "numberList",
  },
  {
    id: "catchOpeningAreasCm2",
    label: "Catch opening areas cm2",
    kind: "numberList",
  },
  {
    id: "representedGroundAreasM2",
    label: "Represented ground areas m2",
    kind: "numberList",
  },
  { id: "testDurationMinutes", label: "Test duration minutes", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.catchOpeningAreasCm2.forEach((v) =>
    positive(v, "catchOpeningAreasCm2"),
  );
  input.representedGroundAreasM2.forEach((v) =>
    positive(v, "representedGroundAreasM2"),
  );
  positive(input.testDurationMinutes, "testDurationMinutes");
  input.catchCollectedVolumesMl.forEach((v) =>
    nonnegative(v, "catchCollectedVolumesMl"),
  );
  aligned(
    input.catchCollectedVolumesMl,
    input.catchOpeningAreasCm2,
    "catchCollectedVolumesMl",
  );
  aligned(
    input.catchCollectedVolumesMl,
    input.representedGroundAreasM2,
    "catchCollectedVolumesMl",
  );
  const localPrecipitationRatesMmPerHour = input.catchCollectedVolumesMl.map(
      (v, i) =>
        (((v * 10) / input.catchOpeningAreasCm2[i]) * 60) /
        input.testDurationMinutes,
    ),
    area = input.representedGroundAreasM2.reduce((a, b) => a + b, 0);
  return {
    localPrecipitationRatesMmPerHour,
    areaWeightedPrecipitationRateMmPerHour:
      localPrecipitationRatesMmPerHour.reduce(
        (s, v, i) => s + (v * input.representedGroundAreasM2[i]) / area,
        0,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  catchCollectedVolumesMl: [10, 20],
  catchOpeningAreasCm2: [100, 100],
  representedGroundAreasM2: [1, 3],
  testDurationMinutes: 10,
} satisfies Input;
export const exampleOutput = {
  localPrecipitationRatesMmPerHour: [6, 12],
  areaWeightedPrecipitationRateMmPerHour: 10.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/sprinkler-precipitation-rate",
  title: "Agriculture Sprinkler Precipitation Rate",
  description:
    "Convert measured catch-can volumes/openings to local sprinkler precipitation rates and weight by represented ground area; no ideal spacing/discharge uniformity assumption.",
  inputs: inputFields,
  outputs: [
    {
      id: "localPrecipitationRatesMmPerHour",
      label: "Local precipitation rates mm per hour",
      kind: "numberList",
    },
    {
      id: "areaWeightedPrecipitationRateMmPerHour",
      label: "Area weighted precipitation rate mm per hour",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      catchCollectedVolumesMl:
        value.catchCollectedVolumesMl as readonly number[],
      catchOpeningAreasCm2: value.catchOpeningAreasCm2 as readonly number[],
      representedGroundAreasM2:
        value.representedGroundAreasM2 as readonly number[],
      testDurationMinutes: value.testDurationMinutes as number,
    }),
});
export const run = tool.execute;
export default tool;
