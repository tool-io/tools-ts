import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly dryBoneMassGrams: number;
  readonly extractedCollagenMassGrams: number;
  readonly blankMassGrams: number;
  readonly callerMinimumYieldPercent: number;
}>;
export type Output = Readonly<{
  readonly blankCorrectedCollagenYieldPercent: number;
  readonly aboveCallerYieldThreshold: boolean;
}>;
const inputFields = [
  { id: "dryBoneMassGrams", label: "Dry bone mass grams", kind: "number" },
  {
    id: "extractedCollagenMassGrams",
    label: "Extracted collagen mass grams",
    kind: "number",
  },
  { id: "blankMassGrams", label: "Blank mass grams", kind: "number" },
  {
    id: "callerMinimumYieldPercent",
    label: "Caller minimum yield percent",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.dryBoneMassGrams, "dryBoneMassGrams");
  nonnegative(input.extractedCollagenMassGrams, "extractedCollagenMassGrams");
  nonnegative(input.blankMassGrams, "blankMassGrams");
  nonnegative(input.callerMinimumYieldPercent, "callerMinimumYieldPercent");
  if (input.extractedCollagenMassGrams > input.dryBoneMassGrams)
    simpleError(
      "extractedCollagenMassGrams",
      "Extraction mass cannot exceed sampled dry bone mass.",
    );
  const blankCorrectedCollagenYieldPercent =
    (100 * (input.extractedCollagenMassGrams - input.blankMassGrams)) /
    input.dryBoneMassGrams;
  return {
    blankCorrectedCollagenYieldPercent,
    aboveCallerYieldThreshold:
      blankCorrectedCollagenYieldPercent >= input.callerMinimumYieldPercent,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  dryBoneMassGrams: 10,
  extractedCollagenMassGrams: 0.2,
  blankMassGrams: 0.05,
  callerMinimumYieldPercent: 1,
} satisfies Input;
export const exampleOutput = {
  blankCorrectedCollagenYieldPercent: 1.5,
  aboveCallerYieldThreshold: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/bone-collagen-yield-percent",
  title: "Bone Collagen Yield Percent Checker",
  description:
    "Calculate blank-corrected dry-bone collagen yield and compare caller QC threshold, preserving negative blank-corrected nondetections; yield alone does not establish collagen integrity or reliable dating.",
  inputs: inputFields,
  outputs: [
    {
      id: "blankCorrectedCollagenYieldPercent",
      label: "Blank corrected collagen yield percent",
      kind: "number",
    },
    {
      id: "aboveCallerYieldThreshold",
      label: "Above caller yield threshold",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      dryBoneMassGrams: value.dryBoneMassGrams as number,
      extractedCollagenMassGrams: value.extractedCollagenMassGrams as number,
      blankMassGrams: value.blankMassGrams as number,
      callerMinimumYieldPercent: value.callerMinimumYieldPercent as number,
    }),
});
export const run = tool.execute;
export default tool;
