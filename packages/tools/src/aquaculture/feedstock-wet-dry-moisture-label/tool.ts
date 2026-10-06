import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly batchId: string;
  readonly measurementBasis: string;
  readonly moistureSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    batchId: { type: "string", maxLength: 8192, minLength: 1 },
    measurementBasis: { type: "string", maxLength: 8192, minLength: 1 },
    moistureSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["batchId", "measurementBasis", "moistureSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicit feedstock mass basis and moisture source without inferring feed composition. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { batchId, measurementBasis, moistureSource } = request;
  const compute = (): Output => {
    H.domain(batchId.length > 0, "batchId");
    H.domain(measurementBasis.length > 0, "measurementBasis");
    H.domain(moistureSource.length > 0, "moistureSource");
    return {
      token: JSON.stringify([batchId, measurementBasis, moistureSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    batchId: "B17",
    measurementBasis: "dry mass",
    moistureSource: "lab M4",
  },
  output: { token: '["B17","dry mass","lab M4"]' },
} satisfies ToolExample<Input, Output>;
export const feedstockWetDryMoistureLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["aquaculture", "agriculture"],
      keywords: ["aquaculture", "agriculture"],
    },
    id: "aquaculture/feedstock-wet-dry-moisture-label",
    title: "Feedstock Wet Dry Moisture Label",
    description:
      "Record an explicit feedstock mass basis and moisture source without inferring feed composition.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        batchId: { type: "string", maxLength: 8192, minLength: 1 },
        measurementBasis: { type: "string", maxLength: 8192, minLength: 1 },
        moistureSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["batchId", "measurementBasis", "moistureSource"],
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
          id: "batchId",
          label: "Batch Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "measurementBasis",
          label: "Measurement Basis",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "moistureSource",
          label: "Moisture Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = feedstockWetDryMoistureLabelTool.execute;
export default feedstockWetDryMoistureLabelTool;
