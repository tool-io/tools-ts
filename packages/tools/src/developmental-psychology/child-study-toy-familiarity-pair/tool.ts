import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstKnown: boolean;
  readonly secondKnown: boolean;
  readonly firstExposureCount: number;
  readonly secondExposureCount: number;
};
export type Output = {
  readonly matchedFamiliarity: boolean;
  readonly exposureGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstKnown: { type: "boolean" },
    secondKnown: { type: "boolean" },
    firstExposureCount: { type: "integer", minimum: 0 },
    secondExposureCount: { type: "integer", minimum: 0 },
  },
  required: [
    "firstKnown",
    "secondKnown",
    "firstExposureCount",
    "secondExposureCount",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    matchedFamiliarity: { type: "boolean" },
    exposureGap: { type: "integer" },
  },
  required: ["matchedFamiliarity", "exposureGap"],
} as const;
/** Calculate child study toy familiarity pair from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstKnown, secondKnown, firstExposureCount, secondExposureCount } =
    request;
  const compute = (): Output => {
    H.integer(firstExposureCount, 0);
    H.integer(secondExposureCount, 0);
    return {
      matchedFamiliarity: firstKnown === secondKnown,
      exposureGap: secondExposureCount - firstExposureCount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstKnown: true,
    secondKnown: false,
    firstExposureCount: 5,
    secondExposureCount: 0,
  },
  output: { matchedFamiliarity: false, exposureGap: -5 },
} satisfies ToolExample<Input, Output>;
export const childStudyToyFamiliarityPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-psychology/child-study-toy-familiarity-pair",
    title: "Child Study Toy Familiarity Pair Tool",
    description:
      "Calculate child study toy familiarity pair from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstKnown: { type: "boolean" },
        secondKnown: { type: "boolean" },
        firstExposureCount: { type: "integer", minimum: 0 },
        secondExposureCount: { type: "integer", minimum: 0 },
      },
      required: [
        "firstKnown",
        "secondKnown",
        "firstExposureCount",
        "secondExposureCount",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        matchedFamiliarity: { type: "boolean" },
        exposureGap: { type: "integer" },
      },
      required: ["matchedFamiliarity", "exposureGap"],
    },
    ports: {
      inputs: [
        {
          id: "firstKnown",
          label: "First Known",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "secondKnown",
          label: "Second Known",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "firstExposureCount",
          label: "First Exposure Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondExposureCount",
          label: "Second Exposure Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "matchedFamiliarity",
          label: "Matched Familiarity",
          valueType: { type: "boolean" },
        },
        {
          id: "exposureGap",
          label: "Exposure Gap",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = childStudyToyFamiliarityPairTool.execute;
export default childStudyToyFamiliarityPairTool;
