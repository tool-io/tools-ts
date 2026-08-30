import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly referenceDepthM: number;
  readonly referenceAgeYears: number;
  readonly referenceAnnualLayerThicknessM: number;
  readonly layerThinningPerMeter: number;
  readonly queryDepthM: number;
}>;
export type Output = Readonly<{ readonly extrapolatedAgeYears: number }>;
const inputFields = [
  { id: "referenceDepthM", label: "Reference depth m", kind: "number" },
  { id: "referenceAgeYears", label: "Reference age years", kind: "number" },
  {
    id: "referenceAnnualLayerThicknessM",
    label: "Reference annual layer thickness m",
    kind: "number",
  },
  {
    id: "layerThinningPerMeter",
    label: "Layer thinning per meter",
    kind: "number",
  },
  { id: "queryDepthM", label: "Query depth m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.referenceAnnualLayerThicknessM,
    "referenceAnnualLayerThicknessM",
  );
  nonnegative(input.referenceDepthM, "referenceDepthM");
  nonnegative(input.referenceAgeYears, "referenceAgeYears");
  nonnegative(input.layerThinningPerMeter, "layerThinningPerMeter");
  nonnegative(input.queryDepthM, "queryDepthM");
  if (input.queryDepthM < input.referenceDepthM)
    simpleError(
      "queryDepthM",
      "Extrapolation must proceed below reference depth.",
    );
  const d = input.queryDepthM - input.referenceDepthM,
    k = input.layerThinningPerMeter;
  return {
    extrapolatedAgeYears:
      input.referenceAgeYears +
      (k === 0 ? d : Math.expm1(k * d) / k) /
        input.referenceAnnualLayerThicknessM,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  referenceDepthM: 100,
  referenceAgeYears: 1000,
  referenceAnnualLayerThicknessM: 0.1,
  layerThinningPerMeter: 0.01,
  queryDepthM: 110,
} satisfies Input;
export const exampleOutput = {
  extrapolatedAgeYears: 1105.1709180756477,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/core-bottom-age-extrapolation",
  title: "Core Bottom Age Extrapolation",
  description:
    "Integrate reciprocal exponentially thinning annual-layer thickness below a reference depth; explicitly a model extrapolation, not observed core chronology or an uncertainty bound.",
  inputs: inputFields,
  outputs: [
    {
      id: "extrapolatedAgeYears",
      label: "Extrapolated age years",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      referenceDepthM: value.referenceDepthM as number,
      referenceAgeYears: value.referenceAgeYears as number,
      referenceAnnualLayerThicknessM:
        value.referenceAnnualLayerThicknessM as number,
      layerThinningPerMeter: value.layerThinningPerMeter as number,
      queryDepthM: value.queryDepthM as number,
    }),
});
export const run = tool.execute;
export default tool;
