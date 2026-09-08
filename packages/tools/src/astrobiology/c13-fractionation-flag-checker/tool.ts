import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredDelta13CPerMil: number;
  readonly callerVerifiedAbioticReferenceDelta13CPerMil: number;
  readonly callerRequiredAbsoluteSeparationPerMil: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredDelta13CPerMil",
    label: "Independently measured delta13 c per mil",
    kind: "number",
  },
  {
    id: "callerVerifiedAbioticReferenceDelta13CPerMil",
    label: "Caller verified abiotic reference delta13 c per mil",
    kind: "number",
  },
  {
    id: "callerRequiredAbsoluteSeparationPerMil",
    label: "Caller required absolute separation per mil",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.callerRequiredAbsoluteSeparationPerMil, "threshold");
  const d =
    input.independentlyMeasuredDelta13CPerMil -
    input.callerVerifiedAbioticReferenceDelta13CPerMil;
  return {
    signedReferenceDifferencePerMil: d,
    meetsCallerAbsoluteSeparation:
      Math.abs(d) >= input.callerRequiredAbsoluteSeparationPerMil,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredDelta13CPerMil: -30,
    callerVerifiedAbioticReferenceDelta13CPerMil: -10,
    callerRequiredAbsoluteSeparationPerMil: 15,
  },
  output: {
    result: {
      signedReferenceDifferencePerMil: -20,
      meetsCallerAbsoluteSeparation: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/c13-fractionation-flag-checker",
  title: "Carbon Isotope delta-13C Biological Fractionation Flag Checker",
  description:
    "Actual \u03b413Ccontrast with independent matched abiotic reference; sign and conditional threshold retained. Abiotic fractionation, contamination and mixing remain possible; not prove biological carbon.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
