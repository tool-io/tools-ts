import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly assayId: string;
  readonly cutoffText: string;
  readonly sourceEdition: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    assayId: { type: "string", maxLength: 8192, minLength: 1 },
    cutoffText: { type: "string", maxLength: 8192, minLength: 1 },
    sourceEdition: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["assayId", "cutoffText", "sourceEdition"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit serology cutoff transcription and source edition without choosing or applying a diagnostic threshold. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { assayId, cutoffText, sourceEdition } = request;
  const compute = (): Output => {
    H.domain(assayId.length > 0, "assayId");
    H.domain(cutoffText.length > 0, "cutoffText");
    H.domain(sourceEdition.length > 0, "sourceEdition");
    return { token: JSON.stringify([assayId, cutoffText, sourceEdition]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    assayId: "A17",
    cutoffText: "1.2 index",
    sourceEdition: "source v2",
  },
  output: { token: '["A17","1.2 index","source v2"]' },
} satisfies ToolExample<Input, Output>;
export const serologyCutoffSourceEditionTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "immunology/serology-cutoff-source-edition-token",
    title: "Serology Cutoff Source Edition Token Tool",
    description:
      "Preserve an explicit serology cutoff transcription and source edition without choosing or applying a diagnostic threshold.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        assayId: { type: "string", maxLength: 8192, minLength: 1 },
        cutoffText: { type: "string", maxLength: 8192, minLength: 1 },
        sourceEdition: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["assayId", "cutoffText", "sourceEdition"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "assayId",
          label: "Assay Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "cutoffText",
          label: "Cutoff Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceEdition",
          label: "Source Edition",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = serologyCutoffSourceEditionTokenTool.execute;
export default serologyCutoffSourceEditionTokenTool;
