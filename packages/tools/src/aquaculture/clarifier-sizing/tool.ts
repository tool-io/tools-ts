import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly flowM3PerHour: number;
  readonly solidsLoadKgPerHour: number;
  readonly maximumSurfaceOverflowMPerHour: number;
  readonly maximumSolidsLoadingKgPerM2Hour: number;
  readonly waterDepthM: number;
}>;
export type Output = Readonly<{
  readonly hydraulicRequiredAreaM2: number;
  readonly solidsRequiredAreaM2: number;
  readonly governingAreaM2: number;
  readonly circularDiameterM: number;
  readonly nominalDetentionHours: number;
}>;
const inputFields = [
  { id: "flowM3PerHour", label: "Flow m3 per hour", kind: "number" },
  {
    id: "solidsLoadKgPerHour",
    label: "Solids load kg per hour",
    kind: "number",
  },
  {
    id: "maximumSurfaceOverflowMPerHour",
    label: "Maximum surface overflow m per hour",
    kind: "number",
  },
  {
    id: "maximumSolidsLoadingKgPerM2Hour",
    label: "Maximum solids loading kg per m2 hour",
    kind: "number",
  },
  { id: "waterDepthM", label: "Water depth m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.flowM3PerHour, "flowM3PerHour");
  positive(
    input.maximumSurfaceOverflowMPerHour,
    "maximumSurfaceOverflowMPerHour",
  );
  positive(
    input.maximumSolidsLoadingKgPerM2Hour,
    "maximumSolidsLoadingKgPerM2Hour",
  );
  positive(input.waterDepthM, "waterDepthM");
  nonnegative(input.solidsLoadKgPerHour, "solidsLoadKgPerHour");
  const hydraulicRequiredAreaM2 =
      input.flowM3PerHour / input.maximumSurfaceOverflowMPerHour,
    solidsRequiredAreaM2 =
      input.solidsLoadKgPerHour / input.maximumSolidsLoadingKgPerM2Hour,
    governingAreaM2 = Math.max(hydraulicRequiredAreaM2, solidsRequiredAreaM2);
  return {
    hydraulicRequiredAreaM2,
    solidsRequiredAreaM2,
    governingAreaM2,
    circularDiameterM: 2 * Math.sqrt(governingAreaM2 / Math.PI),
    nominalDetentionHours:
      (governingAreaM2 * input.waterDepthM) / input.flowM3PerHour,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  flowM3PerHour: 100,
  solidsLoadKgPerHour: 50,
  maximumSurfaceOverflowMPerHour: 2,
  maximumSolidsLoadingKgPerM2Hour: 1,
  waterDepthM: 2,
} satisfies Input;
export const exampleOutput = {
  hydraulicRequiredAreaM2: 50,
  solidsRequiredAreaM2: 50,
  governingAreaM2: 50,
  circularDiameterM: 7.978845608028654,
  nominalDetentionHours: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aquaculture/clarifier-sizing",
  title: "Clarifier Sizing",
  description:
    "Size an ideal circular clarifier against caller hydraulic and solids loadings and report detention; settling performance, inlet hydraulics and short circuiting are external.",
  inputs: inputFields,
  outputs: [
    {
      id: "hydraulicRequiredAreaM2",
      label: "Hydraulic required area m2",
      kind: "number",
    },
    {
      id: "solidsRequiredAreaM2",
      label: "Solids required area m2",
      kind: "number",
    },
    { id: "governingAreaM2", label: "Governing area m2", kind: "number" },
    { id: "circularDiameterM", label: "Circular diameter m", kind: "number" },
    {
      id: "nominalDetentionHours",
      label: "Nominal detention hours",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      flowM3PerHour: value.flowM3PerHour as number,
      solidsLoadKgPerHour: value.solidsLoadKgPerHour as number,
      maximumSurfaceOverflowMPerHour:
        value.maximumSurfaceOverflowMPerHour as number,
      maximumSolidsLoadingKgPerM2Hour:
        value.maximumSolidsLoadingKgPerM2Hour as number,
      waterDepthM: value.waterDepthM as number,
    }),
});
export const run = tool.execute;
export default tool;
