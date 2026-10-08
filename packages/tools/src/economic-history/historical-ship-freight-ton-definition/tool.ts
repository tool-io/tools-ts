import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly tonText: string;
  readonly suppliedDefinition: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    tonText: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedDefinition: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "tonText", "suppliedDefinition"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit historical freight-ton transcription and source definition without equating mass and volume tons. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, tonText, suppliedDefinition } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(tonText.length > 0, "tonText");
    H.domain(suppliedDefinition.length > 0, "suppliedDefinition");
    return { token: JSON.stringify([recordId, tonText, suppliedDefinition]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "R17",
    tonText: "20 tons",
    suppliedDefinition: "register measure in source",
  },
  output: { token: '["R17","20 tons","register measure in source"]' },
} satisfies ToolExample<Input, Output>;
export const historicalShipFreightTonDefinitionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economic-history/historical-ship-freight-ton-definition",
    title: "Historical Ship Freight Ton Definition Tool",
    description:
      "Preserve an explicit historical freight-ton transcription and source definition without equating mass and volume tons.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        tonText: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedDefinition: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordId", "tonText", "suppliedDefinition"],
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
          id: "recordId",
          label: "Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "tonText",
          label: "Ton Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedDefinition",
          label: "Supplied Definition",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = historicalShipFreightTonDefinitionTool.execute;
export default historicalShipFreightTonDefinitionTool;
