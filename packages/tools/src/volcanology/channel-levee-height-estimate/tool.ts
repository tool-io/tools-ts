import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly depositYieldStrengthPa: number;
  readonly bulkDensityKgPerM3: number;
  readonly gravityMPerSecondSquared: number;
  readonly slopeAngleDegrees: number;
  readonly observedLeveeHeightM: number;
}>;
export type Output = Readonly<{
  readonly modelYieldLimitedHeightM: number;
  readonly observedMinusModelHeightM: number;
}>;
const inputFields = [
  {
    id: "depositYieldStrengthPa",
    label: "Deposit yield strength pa",
    kind: "number",
  },
  { id: "bulkDensityKgPerM3", label: "Bulk density kg per m3", kind: "number" },
  {
    id: "gravityMPerSecondSquared",
    label: "Gravity m per second squared",
    kind: "number",
  },
  { id: "slopeAngleDegrees", label: "Slope angle degrees", kind: "number" },
  {
    id: "observedLeveeHeightM",
    label: "Observed levee height m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.bulkDensityKgPerM3, "bulkDensityKgPerM3");
  positive(input.gravityMPerSecondSquared, "gravityMPerSecondSquared");
  nonnegative(input.depositYieldStrengthPa, "depositYieldStrengthPa");
  nonnegative(input.observedLeveeHeightM, "observedLeveeHeightM");
  if (input.slopeAngleDegrees <= 0 || input.slopeAngleDegrees >= 90)
    simpleError("slopeAngleDegrees", "Slope strictly within (0,90) required.");
  const modelYieldLimitedHeightM =
    input.depositYieldStrengthPa /
    (input.bulkDensityKgPerM3 *
      input.gravityMPerSecondSquared *
      Math.sin((input.slopeAngleDegrees * Math.PI) / 180));
  return {
    modelYieldLimitedHeightM,
    observedMinusModelHeightM:
      input.observedLeveeHeightM - modelYieldLimitedHeightM,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  depositYieldStrengthPa: 100,
  bulkDensityKgPerM3: 1000,
  gravityMPerSecondSquared: 10,
  slopeAngleDegrees: 30,
  observedLeveeHeightM: 0.03,
} satisfies Input;
export const exampleOutput = {
  modelYieldLimitedHeightM: 0.02,
  observedMinusModelHeightM: 0.01,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/channel-levee-height-estimate",
  title: "Channel Levee Height Estimate",
  description:
    "Compare observed levee height to an ideal yield/gravitational slab scale; not a channel-capacity or overflow forecast, and rheometry-based yield inference is a separate tool.",
  inputs: inputFields,
  outputs: [
    {
      id: "modelYieldLimitedHeightM",
      label: "Model yield limited height m",
      kind: "number",
    },
    {
      id: "observedMinusModelHeightM",
      label: "Observed minus model height m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      depositYieldStrengthPa: value.depositYieldStrengthPa as number,
      bulkDensityKgPerM3: value.bulkDensityKgPerM3 as number,
      gravityMPerSecondSquared: value.gravityMPerSecondSquared as number,
      slopeAngleDegrees: value.slopeAngleDegrees as number,
      observedLeveeHeightM: value.observedLeveeHeightM as number,
    }),
});
export const run = tool.execute;
export default tool;
