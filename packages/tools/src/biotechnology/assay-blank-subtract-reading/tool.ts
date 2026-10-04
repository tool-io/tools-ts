import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleReading: number;
  readonly blankReading: number;
};
export type Output = { readonly correctedReading: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleReading: { type: "number" },
    blankReading: { type: "number" },
  },
  required: ["sampleReading", "blankReading"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { correctedReading: { type: "number" } },
  required: ["correctedReading"],
} as const;
/** Subtract a matched analytical blank while preserving negative corrected observations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleReading, blankReading } = request;
  const compute = (): Output => {
    return { correctedReading: sampleReading - blankReading };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleReading: 0.85, blankReading: 0.15 },
  output: { correctedReading: 0.7 },
} satisfies ToolExample<Input, Output>;
export const assayBlankSubtractReadingTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biotechnology/assay-blank-subtract-reading",
    title: "Assay Blank Subtract Reading Tool",
    description:
      "Subtract a matched analytical blank while preserving negative corrected observations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleReading: { type: "number" },
        blankReading: { type: "number" },
      },
      required: ["sampleReading", "blankReading"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { correctedReading: { type: "number" } },
      required: ["correctedReading"],
    },
    ports: {
      inputs: [
        {
          id: "sampleReading",
          label: "Sample Reading",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "blankReading",
          label: "Blank Reading",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "correctedReading",
          label: "Corrected Reading",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = assayBlankSubtractReadingTool.execute;
export default assayBlankSubtractReadingTool;
