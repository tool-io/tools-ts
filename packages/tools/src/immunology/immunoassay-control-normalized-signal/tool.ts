import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleSignal: number;
  readonly blankSignal: number;
  readonly positiveControlSignal: number;
};
export type Output = { readonly normalizedSignal: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleSignal: { type: "number" },
    blankSignal: { type: "number" },
    positiveControlSignal: { type: "number" },
  },
  required: ["sampleSignal", "blankSignal", "positiveControlSignal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { normalizedSignal: { type: "number" } },
  required: ["normalizedSignal"],
} as const;
/** Normalize an explicit assay signal to a blank-corrected supplied control without assigning positivity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleSignal, blankSignal, positiveControlSignal } = request;
  const compute = (): Output => {
    H.domain(positiveControlSignal !== blankSignal, "positiveControlSignal");
    return {
      normalizedSignal:
        (sampleSignal - blankSignal) / (positiveControlSignal - blankSignal),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleSignal: 30, blankSignal: 10, positiveControlSignal: 50 },
  output: { normalizedSignal: 0.5 },
} satisfies ToolExample<Input, Output>;
export const immunoassayControlNormalizedSignalTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["immunology", "health and medicine"],
      keywords: ["immunology", "health and medicine"],
    },
    id: "immunology/immunoassay-control-normalized-signal",
    title: "Immunoassay Control Normalized Signal",
    description:
      "Normalize an explicit assay signal to a blank-corrected supplied control without assigning positivity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleSignal: { type: "number" },
        blankSignal: { type: "number" },
        positiveControlSignal: { type: "number" },
      },
      required: ["sampleSignal", "blankSignal", "positiveControlSignal"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { normalizedSignal: { type: "number" } },
      required: ["normalizedSignal"],
    },
    ports: {
      inputs: [
        {
          id: "sampleSignal",
          label: "Sample Signal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "blankSignal",
          label: "Blank Signal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "positiveControlSignal",
          label: "Positive Control Signal",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "normalizedSignal",
          label: "Normalized Signal",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = immunoassayControlNormalizedSignalTool.execute;
export default immunoassayControlNormalizedSignalTool;
