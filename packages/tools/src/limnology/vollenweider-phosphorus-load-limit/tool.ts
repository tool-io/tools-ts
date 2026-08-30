import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly targetPhosphorusMgPerM3: number;
  readonly meanDepthM: number;
  readonly hydraulicResidenceYears: number;
  readonly retentionMultiplier: number;
  readonly retentionExponent: number;
}>;
export type Output = Readonly<{
  readonly permittedArealExternalLoadGramsPerM2Year: number;
}>;
const inputFields = [
  {
    id: "targetPhosphorusMgPerM3",
    label: "Target phosphorus mg per m3",
    kind: "number",
  },
  { id: "meanDepthM", label: "Mean depth m", kind: "number" },
  {
    id: "hydraulicResidenceYears",
    label: "Hydraulic residence years",
    kind: "number",
  },
  { id: "retentionMultiplier", label: "Retention multiplier", kind: "number" },
  { id: "retentionExponent", label: "Retention exponent", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.targetPhosphorusMgPerM3, "targetPhosphorusMgPerM3");
  positive(input.meanDepthM, "meanDepthM");
  positive(input.hydraulicResidenceYears, "hydraulicResidenceYears");
  nonnegative(input.retentionMultiplier, "retentionMultiplier");
  nonnegative(input.retentionExponent, "retentionExponent");
  return {
    permittedArealExternalLoadGramsPerM2Year:
      (((input.targetPhosphorusMgPerM3 * input.meanDepthM) /
        input.hydraulicResidenceYears) *
        (1 +
          input.retentionMultiplier *
            input.hydraulicResidenceYears ** input.retentionExponent)) /
      1000,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  targetPhosphorusMgPerM3: 10,
  meanDepthM: 5,
  hydraulicResidenceYears: 4,
  retentionMultiplier: 1,
  retentionExponent: 0.5,
} satisfies Input;
export const exampleOutput = {
  permittedArealExternalLoadGramsPerM2Year: 0.0375,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/vollenweider-phosphorus-load-limit",
  title: "Vollenweider Phosphorus Load Limit",
  description:
    "Invert a caller Vollenweider-form steady retention relation for target areal external phosphorus load; not an authoritative load limit or site-specific ecological guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "permittedArealExternalLoadGramsPerM2Year",
      label: "Permitted areal external load grams per m2 year",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      targetPhosphorusMgPerM3: value.targetPhosphorusMgPerM3 as number,
      meanDepthM: value.meanDepthM as number,
      hydraulicResidenceYears: value.hydraulicResidenceYears as number,
      retentionMultiplier: value.retentionMultiplier as number,
      retentionExponent: value.retentionExponent as number,
    }),
});
export const run = tool.execute;
export default tool;
