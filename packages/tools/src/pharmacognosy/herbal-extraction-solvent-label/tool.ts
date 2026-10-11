import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly extractId: string;
  readonly solventWording: string;
  readonly source: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    extractId: { type: "string", maxLength: 8192, minLength: 1 },
    solventWording: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["extractId", "solventWording", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit extraction-solvent wording and source without prescribing extraction conditions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { extractId, solventWording, source } = request;
  const compute = (): Output => {
    H.domain(extractId.length > 0, "extractId");
    H.domain(solventWording.length > 0, "solventWording");
    H.domain(source.length > 0, "source");
    return { token: JSON.stringify([extractId, solventWording, source]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    extractId: "EX17",
    solventWording: "ethanol-water label",
    source: "Batch record",
  },
  output: { token: '["EX17","ethanol-water label","Batch record"]' },
} satisfies ToolExample<Input, Output>;
export const herbalExtractionSolventLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pharmacognosy", "pharmacy"],
      keywords: ["pharmacognosy", "pharmacy"],
    },
    id: "pharmacognosy/herbal-extraction-solvent-label",
    title: "Herbal Extraction Solvent Label",
    description:
      "Preserve explicit extraction-solvent wording and source without prescribing extraction conditions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        extractId: { type: "string", maxLength: 8192, minLength: 1 },
        solventWording: { type: "string", maxLength: 8192, minLength: 1 },
        source: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["extractId", "solventWording", "source"],
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
          id: "extractId",
          label: "Extract Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "solventWording",
          label: "Solvent Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = herbalExtractionSolventLabelTool.execute;
export default herbalExtractionSolventLabelTool;
