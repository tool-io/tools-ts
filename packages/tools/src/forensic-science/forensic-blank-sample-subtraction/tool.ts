import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleSignal: number;
  readonly blankSignal: number;
};
export type Output = { readonly correctedSignal: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleSignal: { type: "number" },
    blankSignal: { type: "number" },
  },
  required: ["sampleSignal", "blankSignal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { correctedSignal: { type: "number" } },
  required: ["correctedSignal"],
} as const;
/** Subtract an explicit analytical blank signal while preserving negative corrected results. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleSignal, blankSignal } = request;
  const compute = (): Output => {
    return { correctedSignal: sampleSignal - blankSignal };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleSignal: 12.5, blankSignal: 2 },
  output: { correctedSignal: 10.5 },
} satisfies ToolExample<Input, Output>;
export const forensicBlankSampleSubtractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "forensic-science",
        "forensic science",
        "research and quality management",
      ],
      keywords: ["forensic science", "research and quality management"],
    },
    id: "forensic-science/forensic-blank-sample-subtraction",
    title: "Forensic Blank Sample Subtraction",
    description:
      "Subtract an explicit analytical blank signal while preserving negative corrected results.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleSignal: { type: "number" },
        blankSignal: { type: "number" },
      },
      required: ["sampleSignal", "blankSignal"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { correctedSignal: { type: "number" } },
      required: ["correctedSignal"],
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
      ],
      outputs: [
        {
          id: "correctedSignal",
          label: "Corrected Signal",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = forensicBlankSampleSubtractionTool.execute;
export default forensicBlankSampleSubtractionTool;
