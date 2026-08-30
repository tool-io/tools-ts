import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly schmidtStabilityJPerM2: number;
  readonly surfaceAreaM2: number;
  readonly waterDensityKgPerM3: number;
  readonly waterFrictionVelocityMPerSecond: number;
  readonly thermoclineDepthM: number;
  readonly volumeCentroidDepthM: number;
  readonly maximumDepthM: number;
}>;
export type Output = Readonly<{ readonly lakeNumber: number }>;
const inputFields = [
  {
    id: "schmidtStabilityJPerM2",
    label: "Schmidt stability j per m2",
    kind: "number",
  },
  { id: "surfaceAreaM2", label: "Surface area m2", kind: "number" },
  {
    id: "waterDensityKgPerM3",
    label: "Water density kg per m3",
    kind: "number",
  },
  {
    id: "waterFrictionVelocityMPerSecond",
    label: "Water friction velocity m per second",
    kind: "number",
  },
  { id: "thermoclineDepthM", label: "Thermocline depth m", kind: "number" },
  {
    id: "volumeCentroidDepthM",
    label: "Volume centroid depth m",
    kind: "number",
  },
  { id: "maximumDepthM", label: "Maximum depth m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.surfaceAreaM2, "surfaceAreaM2");
  positive(input.waterDensityKgPerM3, "waterDensityKgPerM3");
  positive(
    input.waterFrictionVelocityMPerSecond,
    "waterFrictionVelocityMPerSecond",
  );
  positive(input.maximumDepthM, "maximumDepthM");
  nonnegative(input.schmidtStabilityJPerM2, "schmidtStabilityJPerM2");
  nonnegative(input.thermoclineDepthM, "thermoclineDepthM");
  nonnegative(input.volumeCentroidDepthM, "volumeCentroidDepthM");
  if (
    input.thermoclineDepthM >= input.maximumDepthM ||
    input.volumeCentroidDepthM >= input.maximumDepthM
  )
    simpleError(
      "maximumDepthM",
      "Thermocline/centroid strictly above lake bottom required.",
    );
  return {
    lakeNumber:
      (input.schmidtStabilityJPerM2 *
        (1 - input.thermoclineDepthM / input.maximumDepthM)) /
      (input.waterDensityKgPerM3 *
        input.waterFrictionVelocityMPerSecond ** 2 *
        Math.sqrt(input.surfaceAreaM2) *
        (1 - input.volumeCentroidDepthM / input.maximumDepthM)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  schmidtStabilityJPerM2: 100,
  surfaceAreaM2: 100,
  waterDensityKgPerM3: 1000,
  waterFrictionVelocityMPerSecond: 0.1,
  thermoclineDepthM: 5,
  volumeCentroidDepthM: 5,
  maximumDepthM: 10,
} satisfies Input;
export const exampleOutput = { lakeNumber: 1 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/lake-number-inertial",
  title: "Lake Number Inertial",
  description:
    "Evaluate a Lake Number convention using Schmidt stability already in J/m² and water-side friction velocity; no extra gravity factor, wind-to-water conversion or universal mixing threshold.",
  inputs: inputFields,
  outputs: [{ id: "lakeNumber", label: "Lake number", kind: "number" }],
  calculate: (value) =>
    calculate({
      schmidtStabilityJPerM2: value.schmidtStabilityJPerM2 as number,
      surfaceAreaM2: value.surfaceAreaM2 as number,
      waterDensityKgPerM3: value.waterDensityKgPerM3 as number,
      waterFrictionVelocityMPerSecond:
        value.waterFrictionVelocityMPerSecond as number,
      thermoclineDepthM: value.thermoclineDepthM as number,
      volumeCentroidDepthM: value.volumeCentroidDepthM as number,
      maximumDepthM: value.maximumDepthM as number,
    }),
});
export const run = tool.execute;
export default tool;
