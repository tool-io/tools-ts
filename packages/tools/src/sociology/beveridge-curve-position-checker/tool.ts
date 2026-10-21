import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly observedVacancyRatePercent: number;
  readonly observedUnemploymentRatePercent: number;
  readonly callerReferenceVacancyRatePercent: number;
  readonly callerReferenceUnemploymentRatePercent: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "observedVacancyRatePercent",
    label: "Observed vacancy rate percent",
    kind: "number",
  },
  {
    id: "observedUnemploymentRatePercent",
    label: "Observed unemployment rate percent",
    kind: "number",
  },
  {
    id: "callerReferenceVacancyRatePercent",
    label: "Caller reference vacancy rate percent",
    kind: "number",
  },
  {
    id: "callerReferenceUnemploymentRatePercent",
    label: "Caller reference unemployment rate percent",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  [
    input.observedVacancyRatePercent,
    input.observedUnemploymentRatePercent,
    input.callerReferenceVacancyRatePercent,
    input.callerReferenceUnemploymentRatePercent,
  ].forEach((v) => {
    if (v < 0 || v > 100) simpleError("rate", "Actual percent0–100.");
  });
  return {
    signedVacancyRateDisplacementPoints:
      input.observedVacancyRatePercent -
      input.callerReferenceVacancyRatePercent,
    signedUnemploymentRateDisplacementPoints:
      input.observedUnemploymentRatePercent -
      input.callerReferenceUnemploymentRatePercent,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    observedVacancyRatePercent: 3,
    observedUnemploymentRatePercent: 5,
    callerReferenceVacancyRatePercent: 2,
    callerReferenceUnemploymentRatePercent: 4,
  },
  output: {
    result: {
      signedVacancyRateDisplacementPoints: 1,
      signedUnemploymentRateDisplacementPoints: 1,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/beveridge-curve-position-checker",
  title: "Beveridge Curve Position Checker",
  description:
    "Observed Beveridge-plane displacement from an independently established matched reference point, not estimate a curve, structural unemployment or causal shift.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          signedVacancyRateDisplacementPoints: { type: "number" },
          signedUnemploymentRateDisplacementPoints: { type: "number" },
        },
        required: [
          "signedVacancyRateDisplacementPoints",
          "signedUnemploymentRateDisplacementPoints",
        ],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
