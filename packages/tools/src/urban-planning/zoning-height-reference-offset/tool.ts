import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly topElevation: number;
  readonly referenceElevation: number;
};
export type Output = { readonly heightAboveReference: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    topElevation: { type: "number" },
    referenceElevation: { type: "number" },
  },
  required: ["topElevation", "referenceElevation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { heightAboveReference: { type: "number" } },
  required: ["heightAboveReference"],
} as const;
/** Measure a top elevation relative to an explicitly supplied zoning reference level without selecting a legal measurement rule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { topElevation, referenceElevation } = request;
  const compute = (): Output => {
    return { heightAboveReference: topElevation - referenceElevation };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { topElevation: 112, referenceElevation: 100 },
  output: { heightAboveReference: 12 },
} satisfies ToolExample<Input, Output>;
export const zoningHeightReferenceOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-planning/zoning-height-reference-offset",
    title: "Zoning Height Reference Offset Tool",
    description:
      "Measure a top elevation relative to an explicitly supplied zoning reference level without selecting a legal measurement rule.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        topElevation: { type: "number" },
        referenceElevation: { type: "number" },
      },
      required: ["topElevation", "referenceElevation"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { heightAboveReference: { type: "number" } },
      required: ["heightAboveReference"],
    },
    ports: {
      inputs: [
        {
          id: "topElevation",
          label: "Top Elevation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceElevation",
          label: "Reference Elevation",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "heightAboveReference",
          label: "Height Above Reference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = zoningHeightReferenceOffsetTool.execute;
export default zoningHeightReferenceOffsetTool;
