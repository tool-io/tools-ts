import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly yes: number;
  readonly no: number;
  readonly missing: number;
  readonly excludeMissing: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly affirmativeShare: number;
  readonly missingShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    yes: { type: "integer", minimum: 0 },
    no: { type: "integer", minimum: 0 },
    missing: { type: "integer", minimum: 0 },
    excludeMissing: { type: "boolean" },
  },
  required: ["yes", "no", "missing", "excludeMissing"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    affirmativeShare: { type: "number" },
    missingShare: { type: "number" },
  },
  required: ["denominator", "affirmativeShare", "missingShare"],
} as const;
/** Calculate food safety survey missing response base from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { yes, no, missing, excludeMissing } = request;
  const compute = (): Output => {
    H.integer(yes, 0);
    H.integer(no, 0);
    H.integer(missing, 0);
    H.domain(yes + no > 0);
    return {
      denominator: yes + no + (excludeMissing ? 0 : missing),
      affirmativeShare: yes / (yes + no + (excludeMissing ? 0 : missing)),
      missingShare: missing / (yes + no + missing),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { yes: 8, no: 2, missing: 10, excludeMissing: true },
  output: { denominator: 10, affirmativeShare: 0.8, missingShare: 0.5 },
} satisfies ToolExample<Input, Output>;
export const foodSafetySurveyMissingResponseBaseTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "food-safety/food-safety-survey-missing-response-base",
      title: "Food Safety Survey Missing Response Base Tool",
      description:
        "Calculate food safety survey missing response base from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          yes: { type: "integer", minimum: 0 },
          no: { type: "integer", minimum: 0 },
          missing: { type: "integer", minimum: 0 },
          excludeMissing: { type: "boolean" },
        },
        required: ["yes", "no", "missing", "excludeMissing"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          denominator: { type: "integer" },
          affirmativeShare: { type: "number" },
          missingShare: { type: "number" },
        },
        required: ["denominator", "affirmativeShare", "missingShare"],
      },
      ports: {
        inputs: [
          {
            id: "yes",
            label: "Yes",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "no",
            label: "No",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "missing",
            label: "Missing",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "excludeMissing",
            label: "Exclude Missing",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "denominator",
            label: "Denominator",
            valueType: { type: "integer" },
          },
          {
            id: "affirmativeShare",
            label: "Affirmative Share",
            valueType: { type: "number", unit: "1" },
          },
          {
            id: "missingShare",
            label: "Missing Share",
            valueType: { type: "number", unit: "1" },
          },
        ],
      },
    },
    calculate,
  });
export const run = foodSafetySurveyMissingResponseBaseTool.execute;
export default foodSafetySurveyMissingResponseBaseTool;
