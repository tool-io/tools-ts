import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedFlowers: number;
  readonly surveyedLength: number;
  readonly fullMarginLength: number;
};
export type Output = { readonly estimatedFlowers: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedFlowers: { type: "integer", minimum: 0 },
    surveyedLength: { type: "number", exclusiveMinimum: 0 },
    fullMarginLength: { type: "number" },
  },
  required: ["observedFlowers", "surveyedLength", "fullMarginLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { estimatedFlowers: { type: "number" } },
  required: ["estimatedFlowers"],
} as const;
/** Expand a supplied flower count by surveyed-to-total margin length under an explicit uniform-density assumption. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedFlowers, surveyedLength, fullMarginLength } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(observedFlowers) &&
        observedFlowers >= 0 &&
        observedFlowers <= Number.MAX_SAFE_INTEGER,
      "observedFlowers",
    ),
      observedFlowers);
    (H.domain(
      Number.isFinite(surveyedLength) && surveyedLength > 0,
      "surveyedLength",
    ),
      surveyedLength);
    H.domain(fullMarginLength >= surveyedLength, "fullMarginLength");
    return {
      estimatedFlowers: observedFlowers * (fullMarginLength / surveyedLength),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedFlowers: 12, surveyedLength: 5, fullMarginLength: 20 },
  output: { estimatedFlowers: 48 },
} satisfies ToolExample<Input, Output>;
export const fieldMarginFlowerCountExpansionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agroecology", "agriculture"],
      keywords: ["agroecology", "agriculture"],
    },
    id: "agroecology/field-margin-flower-count-expansion",
    title: "Field Margin Flower Count Expansion",
    description:
      "Expand a supplied flower count by surveyed-to-total margin length under an explicit uniform-density assumption.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedFlowers: { type: "integer", minimum: 0 },
        surveyedLength: { type: "number", exclusiveMinimum: 0 },
        fullMarginLength: { type: "number" },
      },
      required: ["observedFlowers", "surveyedLength", "fullMarginLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { estimatedFlowers: { type: "number" } },
      required: ["estimatedFlowers"],
    },
    ports: {
      inputs: [
        {
          id: "observedFlowers",
          label: "Observed Flowers",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "surveyedLength",
          label: "Surveyed Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fullMarginLength",
          label: "Full Margin Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "estimatedFlowers",
          label: "Estimated Flowers",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fieldMarginFlowerCountExpansionTool.execute;
export default fieldMarginFlowerCountExpansionTool;
