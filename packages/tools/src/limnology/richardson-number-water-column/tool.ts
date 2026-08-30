import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly signedDensityContrastKgPerM3: number;
  readonly referenceDensityKgPerM3: number;
  readonly gravityMPerSecondSquared: number;
  readonly shearLayerThicknessM: number;
  readonly velocityDifferenceMPerSecond: number;
}>;
export type Output = Readonly<{ readonly signedBulkRichardsonNumber: number }>;
const inputFields = [
  {
    id: "signedDensityContrastKgPerM3",
    label: "Signed density contrast kg per m3",
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
    id: "shearLayerThicknessM",
    label: "Shear layer thickness m",
    kind: "number",
  },
  {
    id: "velocityDifferenceMPerSecond",
    label: "Velocity difference m per second",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.referenceDensityKgPerM3, "referenceDensityKgPerM3");
  positive(input.gravityMPerSecondSquared, "gravityMPerSecondSquared");
  positive(input.shearLayerThicknessM, "shearLayerThicknessM");
  if (input.velocityDifferenceMPerSecond === 0)
    simpleError(
      "velocityDifferenceMPerSecond",
      "Nonzero resolved velocity shear required; zero shear gives undefined/infinite bulk Ri.",
    );
  return {
    signedBulkRichardsonNumber:
      (input.gravityMPerSecondSquared *
        input.signedDensityContrastKgPerM3 *
        input.shearLayerThicknessM) /
      (input.referenceDensityKgPerM3 * input.velocityDifferenceMPerSecond ** 2),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  signedDensityContrastKgPerM3: 2,
  referenceDensityKgPerM3: 1000,
  gravityMPerSecondSquared: 10,
  shearLayerThicknessM: 10,
  velocityDifferenceMPerSecond: 0.2,
} satisfies Input;
export const exampleOutput = { signedBulkRichardsonNumber: 5 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/richardson-number-water-column",
  title: "Richardson Number Water Column",
  description:
    "Compute signed bulk Richardson number for a supplied shear-layer scale and density contrast; density inversion remains negative and no critical instability diagnosis is imposed.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedBulkRichardsonNumber",
      label: "Signed bulk richardson number",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      signedDensityContrastKgPerM3:
        value.signedDensityContrastKgPerM3 as number,
      referenceDensityKgPerM3: value.referenceDensityKgPerM3 as number,
      gravityMPerSecondSquared: value.gravityMPerSecondSquared as number,
      shearLayerThicknessM: value.shearLayerThicknessM as number,
      velocityDifferenceMPerSecond:
        value.velocityDifferenceMPerSecond as number,
    }),
});
export const run = tool.execute;
export default tool;
