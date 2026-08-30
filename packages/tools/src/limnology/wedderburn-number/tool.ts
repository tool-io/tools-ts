import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly densityContrastKgPerM3: number;
  readonly referenceDensityKgPerM3: number;
  readonly gravityMPerSecondSquared: number;
  readonly upperLayerThicknessM: number;
  readonly waterFrictionVelocityMPerSecond: number;
  readonly windFetchM: number;
}>;
export type Output = Readonly<{ readonly wedderburnNumber: number }>;
const inputFields = [
  {
    id: "densityContrastKgPerM3",
    label: "Density contrast kg per m3",
    kind: "number",
  },
  {
    id: "referenceDensityKgPerM3",
    label: "Reference density kg per m3",
    kind: "number",
  },
  {
    id: "gravityMPerSecondSquared",
    label: "Gravity m per second squared",
    kind: "number",
  },
  {
    id: "upperLayerThicknessM",
    label: "Upper layer thickness m",
    kind: "number",
  },
  {
    id: "waterFrictionVelocityMPerSecond",
    label: "Water friction velocity m per second",
    kind: "number",
  },
  { id: "windFetchM", label: "Wind fetch m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.referenceDensityKgPerM3, "referenceDensityKgPerM3");
  positive(input.gravityMPerSecondSquared, "gravityMPerSecondSquared");
  positive(input.upperLayerThicknessM, "upperLayerThicknessM");
  positive(
    input.waterFrictionVelocityMPerSecond,
    "waterFrictionVelocityMPerSecond",
  );
  positive(input.windFetchM, "windFetchM");
  nonnegative(input.densityContrastKgPerM3, "densityContrastKgPerM3");
  return {
    wedderburnNumber:
      (((input.gravityMPerSecondSquared * input.densityContrastKgPerM3) /
        input.referenceDensityKgPerM3) *
        input.upperLayerThicknessM ** 2) /
      (input.waterFrictionVelocityMPerSecond ** 2 * input.windFetchM),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  densityContrastKgPerM3: 2,
  referenceDensityKgPerM3: 1000,
  gravityMPerSecondSquared: 10,
  upperLayerThicknessM: 10,
  waterFrictionVelocityMPerSecond: 0.1,
  windFetchM: 100,
} satisfies Input;
export const exampleOutput = { wedderburnNumber: 2 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/wedderburn-number",
  title: "Wedderburn Number",
  description:
    "Evaluate W=g′h²/(u*²L) from caller two-layer density contrast, upper thickness, friction velocity and fetch; no universal upwelling or turnover criterion.",
  inputs: inputFields,
  outputs: [
    { id: "wedderburnNumber", label: "Wedderburn number", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      densityContrastKgPerM3: value.densityContrastKgPerM3 as number,
      referenceDensityKgPerM3: value.referenceDensityKgPerM3 as number,
      gravityMPerSecondSquared: value.gravityMPerSecondSquared as number,
      upperLayerThicknessM: value.upperLayerThicknessM as number,
      waterFrictionVelocityMPerSecond:
        value.waterFrictionVelocityMPerSecond as number,
      windFetchM: value.windFetchM as number,
    }),
});
export const run = tool.execute;
export default tool;
