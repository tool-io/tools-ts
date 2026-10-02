import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly positive: number;
  readonly negative: number;
  readonly unexamined: number;
  readonly excluded: number;
  readonly includeUnexamined: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly observedShare: number;
  readonly unexaminedShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    positive: { type: "integer", minimum: 0 },
    negative: { type: "integer", minimum: 0 },
    unexamined: { type: "integer", minimum: 0 },
    excluded: { type: "integer", minimum: 0 },
    includeUnexamined: { type: "boolean" },
  },
  required: [
    "positive",
    "negative",
    "unexamined",
    "excluded",
    "includeUnexamined",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    observedShare: { type: "number" },
    unexaminedShare: { type: "number" },
  },
  required: ["denominator", "observedShare", "unexaminedShare"],
} as const;
/** Compute a supplied site fraction under an explicit unexamined-site denominator policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { positive, negative, unexamined, excluded, includeUnexamined } =
    request;
  const compute = (): Output => {
    H.integer(positive, 0);
    H.integer(negative, 0);
    H.integer(unexamined, 0);
    H.integer(excluded, 0);
    H.domain(positive + negative > 0);
    return {
      denominator: positive + negative + (includeUnexamined ? unexamined : 0),
      observedShare:
        positive / (positive + negative + (includeUnexamined ? unexamined : 0)),
      unexaminedShare:
        unexamined / (positive + negative + unexamined + excluded),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    positive: 6,
    negative: 18,
    unexamined: 4,
    excluded: 2,
    includeUnexamined: false,
  },
  output: {
    denominator: 24,
    observedShare: 0.25,
    unexaminedShare: 0.13333333333333333,
  },
} satisfies ToolExample<Input, Output>;
export const periodontalResearchSitePositiveShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "periodontology/periodontal-research-site-positive-share",
      title: "Periodontal Research Site Positive Share Tool",
      description:
        "Compute a supplied site fraction under an explicit unexamined-site denominator policy.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          positive: { type: "integer", minimum: 0 },
          negative: { type: "integer", minimum: 0 },
          unexamined: { type: "integer", minimum: 0 },
          excluded: { type: "integer", minimum: 0 },
          includeUnexamined: { type: "boolean" },
        },
        required: [
          "positive",
          "negative",
          "unexamined",
          "excluded",
          "includeUnexamined",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          denominator: { type: "integer" },
          observedShare: { type: "number" },
          unexaminedShare: { type: "number" },
        },
        required: ["denominator", "observedShare", "unexaminedShare"],
      },
      ports: {
        inputs: [
          {
            id: "positive",
            label: "Positive",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "negative",
            label: "Negative",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "unexamined",
            label: "Unexamined",
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
            id: "includeUnexamined",
            label: "Include Unexamined",
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
            id: "observedShare",
            label: "Observed Share",
            valueType: { type: "number" },
          },
          {
            id: "unexaminedShare",
            label: "Unexamined Share",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = periodontalResearchSitePositiveShareTool.execute;
export default periodontalResearchSitePositiveShareTool;
