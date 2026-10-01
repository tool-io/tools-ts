import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly errors: number;
  readonly opportunities: number;
  readonly selfCorrected: number;
  readonly excluded: number;
  readonly countSelfCorrected: boolean;
};
export type Output = {
  readonly eligible: number;
  readonly countedErrors: number;
  readonly errorFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    errors: { type: "integer", minimum: 0 },
    opportunities: { type: "integer", minimum: 1 },
    selfCorrected: { type: "integer", minimum: 0 },
    excluded: { type: "integer", minimum: 0 },
    countSelfCorrected: { type: "boolean" },
  },
  required: [
    "errors",
    "opportunities",
    "selfCorrected",
    "excluded",
    "countSelfCorrected",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligible: { type: "integer" },
    countedErrors: { type: "integer" },
    errorFraction: { type: "number" },
  },
  required: ["eligible", "countedErrors", "errorFraction"],
} as const;
/** Calculate occupational task error opportunity base from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { errors, opportunities, selfCorrected, excluded, countSelfCorrected } =
    request;
  const compute = (): Output => {
    H.integer(opportunities, 1);
    H.integer(excluded, 0, opportunities - 1);
    H.integer(errors, 0, opportunities - excluded);
    H.integer(selfCorrected, 0, errors);
    return {
      eligible: opportunities - excluded,
      countedErrors: errors - (countSelfCorrected ? 0 : selfCorrected),
      errorFraction:
        (errors - (countSelfCorrected ? 0 : selfCorrected)) /
        (opportunities - excluded),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    errors: 8,
    opportunities: 100,
    selfCorrected: 3,
    excluded: 20,
    countSelfCorrected: false,
  },
  output: { eligible: 80, countedErrors: 5, errorFraction: 0.0625 },
} satisfies ToolExample<Input, Output>;
export const occupationalTaskErrorOpportunityBaseTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "occupational-therapy/occupational-task-error-opportunity-base",
      title: "Occupational Task Error Opportunity Base Tool",
      description:
        "Calculate occupational task error opportunity base from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          errors: { type: "integer", minimum: 0 },
          opportunities: { type: "integer", minimum: 1 },
          selfCorrected: { type: "integer", minimum: 0 },
          excluded: { type: "integer", minimum: 0 },
          countSelfCorrected: { type: "boolean" },
        },
        required: [
          "errors",
          "opportunities",
          "selfCorrected",
          "excluded",
          "countSelfCorrected",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          eligible: { type: "integer" },
          countedErrors: { type: "integer" },
          errorFraction: { type: "number" },
        },
        required: ["eligible", "countedErrors", "errorFraction"],
      },
      ports: {
        inputs: [
          {
            id: "errors",
            label: "Errors",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "opportunities",
            label: "Opportunities",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "selfCorrected",
            label: "Self Corrected",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "excluded",
            label: "Excluded",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "countSelfCorrected",
            label: "Count Self Corrected",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "eligible", label: "Eligible", valueType: { type: "integer" } },
          {
            id: "countedErrors",
            label: "Counted Errors",
            valueType: { type: "integer" },
          },
          {
            id: "errorFraction",
            label: "Error Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = occupationalTaskErrorOpportunityBaseTool.execute;
export default occupationalTaskErrorOpportunityBaseTool;
