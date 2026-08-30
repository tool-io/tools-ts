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
} from "../shared.js";
export type Input = Readonly<{
  readonly treeDbhsCm: readonly number[];
  readonly slopeDistancesM: readonly number[];
  readonly slopeAnglesDegrees: readonly number[];
  readonly basalAreaFactorM2PerHectare: number;
  readonly distanceMeasurementToleranceM: number;
}>;
export type Output = Readonly<{
  readonly criticalHorizontalDistancesM: readonly number[];
  readonly observedHorizontalDistancesM: readonly number[];
  readonly inclusionCodes: readonly number[];
}>;
const inputFields = [
  { id: "treeDbhsCm", label: "Tree dbhs cm", kind: "numberList" },
  { id: "slopeDistancesM", label: "Slope distances m", kind: "numberList" },
  {
    id: "slopeAnglesDegrees",
    label: "Slope angles degrees",
    kind: "numberList",
  },
  {
    id: "basalAreaFactorM2PerHectare",
    label: "Basal area factor m2 per hectare",
    kind: "number",
  },
  {
    id: "distanceMeasurementToleranceM",
    label: "Distance measurement tolerance m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.treeDbhsCm.forEach((v) => positive(v, "treeDbhsCm"));
  positive(input.basalAreaFactorM2PerHectare, "basalAreaFactorM2PerHectare");
  input.slopeDistancesM.forEach((v) => nonnegative(v, "slopeDistancesM"));
  nonnegative(
    input.distanceMeasurementToleranceM,
    "distanceMeasurementToleranceM",
  );
  aligned(input.treeDbhsCm, input.slopeDistancesM, "treeDbhsCm");
  aligned(input.treeDbhsCm, input.slopeAnglesDegrees, "treeDbhsCm");
  if (input.slopeAnglesDegrees.some((v) => Math.abs(v) >= 90))
    simpleError("slopeAnglesDegrees", "Slope within (-90,90) required.");
  const criticalHorizontalDistancesM = input.treeDbhsCm.map(
      (d) => d / (2 * Math.sqrt(input.basalAreaFactorM2PerHectare)),
    ),
    observedHorizontalDistancesM = input.slopeDistancesM.map(
      (d, i) => d * Math.cos((input.slopeAnglesDegrees[i] * Math.PI) / 180),
    );
  return {
    criticalHorizontalDistancesM,
    observedHorizontalDistancesM,
    inclusionCodes: criticalHorizontalDistancesM.map((r, i) => {
      const delta = r - observedHorizontalDistancesM[i];
      return Math.abs(delta) <= input.distanceMeasurementToleranceM
        ? 0
        : delta > 0
          ? 1
          : -1;
    }),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  treeDbhsCm: [20, 20, 20],
  slopeDistancesM: [5, 10, 15],
  slopeAnglesDegrees: [0, 0, 0],
  basalAreaFactorM2PerHectare: 1,
  distanceMeasurementToleranceM: 0.1,
} satisfies Input;
export const exampleOutput = {
  criticalHorizontalDistancesM: [10, 10, 10],
  observedHorizontalDistancesM: [5, 10, 15],
  inclusionCodes: [1, 0, -1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/relaskop-critical-distance",
  title: "Relaskop Critical Distance",
  description:
    "Compare slope-corrected horizontal tree distances to angle-count critical radii with a caller borderline tolerance; codes +1/0/-1 mean included/ambiguous/excluded and do not automatically assign border-tree weights.",
  inputs: inputFields,
  outputs: [
    {
      id: "criticalHorizontalDistancesM",
      label: "Critical horizontal distances m",
      kind: "numberList",
    },
    {
      id: "observedHorizontalDistancesM",
      label: "Observed horizontal distances m",
      kind: "numberList",
    },
    { id: "inclusionCodes", label: "Inclusion codes", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      treeDbhsCm: value.treeDbhsCm as readonly number[],
      slopeDistancesM: value.slopeDistancesM as readonly number[],
      slopeAnglesDegrees: value.slopeAnglesDegrees as readonly number[],
      basalAreaFactorM2PerHectare: value.basalAreaFactorM2PerHectare as number,
      distanceMeasurementToleranceM:
        value.distanceMeasurementToleranceM as number,
    }),
});
export const run = tool.execute;
export default tool;
