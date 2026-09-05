import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly cabochonLengthMm: number;
  readonly cabochonWidthMm: number;
  readonly domeHeightMm: number;
  readonly independentlyMeasuredDensityGCM3: number;
}>;
export type Output = Readonly<{
  readonly conditionalEnvelopeVolumeMM3: number;
  readonly conditionalMassCarats: number;
}>;
const inputFields = [
  { id: "cabochonLengthMm", label: "Cabochon length mm", kind: "number" },
  { id: "cabochonWidthMm", label: "Cabochon width mm", kind: "number" },
  { id: "domeHeightMm", label: "Dome height mm", kind: "number" },
  {
    id: "independentlyMeasuredDensityGCM3",
    label: "Independently measured density g c m3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.cabochonLengthMm, "cabochonLengthMm");
  positive(input.cabochonWidthMm, "cabochonWidthMm");
  positive(input.domeHeightMm, "domeHeightMm");
  positive(
    input.independentlyMeasuredDensityGCM3,
    "independentlyMeasuredDensityGCM3",
  );
  const v =
    (Math.PI *
      input.cabochonLengthMm *
      input.cabochonWidthMm *
      input.domeHeightMm) /
    6;
  return {
    conditionalEnvelopeVolumeMM3: v,
    conditionalMassCarats: (v * input.independentlyMeasuredDensityGCM3) / 200,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  cabochonLengthMm: 10,
  cabochonWidthMm: 6,
  domeHeightMm: 4,
  independentlyMeasuredDensityGCM3: 4,
} satisfies Input;
export const exampleOutput = {
  conditionalEnvelopeVolumeMM3: 125.66370614359172,
  conditionalMassCarats: 2.5132741228718345,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/carats-cabochon",
  title: "Cabochon Carat Weight Estimator",
  description:
    "Cabochon explicitly ideal elliptical HALF ellipsoid volume (no pavilion), measured dome height and density. Geometric envelope proxy under caller independently matching density/cut fill, no universal carat-by-shape empirical factor. Caller independently establishes geometry, assay, calibration and protocol; not material identity, laboratory grade, treatment or care safety.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalEnvelopeVolumeMM3",
      label: "Conditional envelope volume m m3",
      kind: "number",
    },
    {
      id: "conditionalMassCarats",
      label: "Conditional mass carats",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      cabochonLengthMm: value.cabochonLengthMm as number,
      cabochonWidthMm: value.cabochonWidthMm as number,
      domeHeightMm: value.domeHeightMm as number,
      independentlyMeasuredDensityGCM3:
        value.independentlyMeasuredDensityGCM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
