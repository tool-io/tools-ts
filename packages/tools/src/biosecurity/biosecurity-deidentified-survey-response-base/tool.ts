import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly invited: number;
  readonly responded: number;
  readonly duplicated: number;
  readonly excluded: number;
  readonly includeExcluded: boolean;
};
export type Output = {
  readonly uniqueResponses: number;
  readonly denominator: number;
  readonly responseShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    invited: { type: "integer", minimum: 1 },
    responded: { type: "integer", minimum: 0 },
    duplicated: { type: "integer", minimum: 0 },
    excluded: { type: "integer", minimum: 0 },
    includeExcluded: { type: "boolean" },
  },
  required: [
    "invited",
    "responded",
    "duplicated",
    "excluded",
    "includeExcluded",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uniqueResponses: { type: "integer" },
    denominator: { type: "integer" },
    responseShare: { type: "number" },
  },
  required: ["uniqueResponses", "denominator", "responseShare"],
} as const;
/** Calculate biosecurity deidentified survey response base from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { invited, responded, duplicated, excluded, includeExcluded } = request;
  const compute = (): Output => {
    H.integer(invited, 1);
    H.integer(responded, 0, invited);
    H.integer(duplicated, 0, responded);
    H.integer(excluded, 0, invited - 1);
    H.domain(responded - duplicated <= invited - excluded);
    return {
      uniqueResponses: responded - duplicated,
      denominator: invited - (includeExcluded ? 0 : excluded),
      responseShare:
        (responded - duplicated) / (invited - (includeExcluded ? 0 : excluded)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    invited: 100,
    responded: 60,
    duplicated: 5,
    excluded: 10,
    includeExcluded: false,
  },
  output: {
    uniqueResponses: 55,
    denominator: 90,
    responseShare: 0.6111111111111112,
  },
} satisfies ToolExample<Input, Output>;
export const biosecurityDeidentifiedSurveyResponseBaseTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biosecurity/biosecurity-deidentified-survey-response-base",
      title: "Biosecurity Deidentified Survey Response Base Tool",
      description:
        "Calculate biosecurity deidentified survey response base from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          invited: { type: "integer", minimum: 1 },
          responded: { type: "integer", minimum: 0 },
          duplicated: { type: "integer", minimum: 0 },
          excluded: { type: "integer", minimum: 0 },
          includeExcluded: { type: "boolean" },
        },
        required: [
          "invited",
          "responded",
          "duplicated",
          "excluded",
          "includeExcluded",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          uniqueResponses: { type: "integer" },
          denominator: { type: "integer" },
          responseShare: { type: "number" },
        },
        required: ["uniqueResponses", "denominator", "responseShare"],
      },
      ports: {
        inputs: [
          {
            id: "invited",
            label: "Invited",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "responded",
            label: "Responded",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "duplicated",
            label: "Duplicated",
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
            id: "includeExcluded",
            label: "Include Excluded",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "uniqueResponses",
            label: "Unique Responses",
            valueType: { type: "integer" },
          },
          {
            id: "denominator",
            label: "Denominator",
            valueType: { type: "integer" },
          },
          {
            id: "responseShare",
            label: "Response Share",
            valueType: { type: "number", unit: "1" },
          },
        ],
      },
    },
    calculate,
  });
export const run = biosecurityDeidentifiedSurveyResponseBaseTool.execute;
export default biosecurityDeidentifiedSurveyResponseBaseTool;
