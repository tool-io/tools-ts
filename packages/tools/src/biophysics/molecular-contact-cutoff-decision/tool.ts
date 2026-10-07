import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly distance: number;
  readonly cutoff: number;
  readonly includeEquality: boolean;
};
export type Output = { readonly contact: boolean; readonly margin: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distance: { type: "number", minimum: 0 },
    cutoff: { type: "number", minimum: 0 },
    includeEquality: { type: "boolean" },
  },
  required: ["distance", "cutoff", "includeEquality"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { contact: { type: "boolean" }, margin: { type: "number" } },
  required: ["contact", "margin"],
} as const;
/** Classify an explicit molecular distance using a caller-supplied cutoff and equality convention without inferring bonding. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { distance, cutoff, includeEquality } = request;
  const compute = (): Output => {
    H.domain(distance >= 0 && cutoff >= 0, "distance");
    return {
      contact: distance < cutoff || (distance === cutoff && includeEquality),
      margin: cutoff - distance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { distance: 4, cutoff: 4, includeEquality: true },
  output: { contact: true, margin: 0 },
} satisfies ToolExample<Input, Output>;
export const molecularContactCutoffDecisionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biophysics", "physics"],
      keywords: ["biophysics", "physics"],
    },
    id: "biophysics/molecular-contact-cutoff-decision",
    title: "Molecular Contact Cutoff Decision",
    description:
      "Classify an explicit molecular distance using a caller-supplied cutoff and equality convention without inferring bonding.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distance: { type: "number", minimum: 0 },
        cutoff: { type: "number", minimum: 0 },
        includeEquality: { type: "boolean" },
      },
      required: ["distance", "cutoff", "includeEquality"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { contact: { type: "boolean" }, margin: { type: "number" } },
      required: ["contact", "margin"],
    },
    ports: {
      inputs: [
        {
          id: "distance",
          label: "Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cutoff",
          label: "Cutoff",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeEquality",
          label: "Include Equality",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "contact", label: "Contact", valueType: { type: "boolean" } },
        { id: "margin", label: "Margin", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = molecularContactCutoffDecisionTool.execute;
export default molecularContactCutoffDecisionTool;
