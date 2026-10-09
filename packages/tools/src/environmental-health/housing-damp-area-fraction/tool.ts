import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly markedDampArea: number;
  readonly inspectedArea: number;
};
export type Output = {
  readonly markedFraction: number;
  readonly otherInspectedArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    markedDampArea: { type: "number", minimum: 0 },
    inspectedArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["markedDampArea", "inspectedArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    markedFraction: { type: "number" },
    otherInspectedArea: { type: "number" },
  },
  required: ["markedFraction", "otherInspectedArea"],
} as const;
/** Normalize an explicitly marked damp area to inspected area without diagnosing moisture causes or housing health risk. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { markedDampArea, inspectedArea } = request;
  const compute = (): Output => {
    (H.domain(inspectedArea > 0, "inspectedArea"), inspectedArea);
    H.domain(
      markedDampArea >= 0 && markedDampArea <= inspectedArea,
      "markedDampArea",
    );
    return {
      markedFraction: markedDampArea / inspectedArea,
      otherInspectedArea: inspectedArea - markedDampArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { markedDampArea: 8, inspectedArea: 40 },
  output: { markedFraction: 0.2, otherInspectedArea: 32 },
} satisfies ToolExample<Input, Output>;
export const housingDampareaFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "environmental-health",
        "environmental health",
        "health and medicine",
      ],
      keywords: ["environmental health", "health and medicine"],
    },
    id: "environmental-health/housing-damp-area-fraction",
    title: "Housing Damp Area Fraction",
    description:
      "Normalize an explicitly marked damp area to inspected area without diagnosing moisture causes or housing health risk.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        markedDampArea: { type: "number", minimum: 0 },
        inspectedArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["markedDampArea", "inspectedArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        markedFraction: { type: "number" },
        otherInspectedArea: { type: "number" },
      },
      required: ["markedFraction", "otherInspectedArea"],
    },
    ports: {
      inputs: [
        {
          id: "markedDampArea",
          label: "Marked Damp Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inspectedArea",
          label: "Inspected Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "markedFraction",
          label: "Marked Fraction",
          valueType: { type: "number" },
        },
        {
          id: "otherInspectedArea",
          label: "Other Inspected Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = housingDampareaFractionTool.execute;
export default housingDampareaFractionTool;
