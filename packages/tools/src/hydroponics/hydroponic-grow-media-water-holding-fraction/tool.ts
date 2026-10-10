import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly retainedWaterVolume: number;
  readonly mediaBulkVolume: number;
};
export type Output = { readonly fraction: number; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    retainedWaterVolume: { type: "number", minimum: 0 },
    mediaBulkVolume: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["retainedWaterVolume", "mediaBulkVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, remainder: { type: "number" } },
  required: ["fraction", "remainder"],
} as const;
/** Normalize explicit retained-water volume to compatible media bulk volume under a caller-supplied measurement basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { retainedWaterVolume, mediaBulkVolume } = request;
  const compute = (): Output => {
    (H.domain(mediaBulkVolume > 0, "mediaBulkVolume"), mediaBulkVolume);
    H.domain(
      retainedWaterVolume >= 0 && retainedWaterVolume <= mediaBulkVolume,
      "retainedWaterVolume",
    );
    return {
      fraction: retainedWaterVolume / mediaBulkVolume,
      remainder: mediaBulkVolume - retainedWaterVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { retainedWaterVolume: 30, mediaBulkVolume: 120 },
  output: { fraction: 0.25, remainder: 90 },
} satisfies ToolExample<Input, Output>;
export const hydroponicGrowMediaWaterHoldingFractionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["hydroponics", "agriculture"],
        keywords: ["hydroponics", "agriculture"],
      },
      id: "hydroponics/hydroponic-grow-media-water-holding-fraction",
      title: "Hydroponic Grow Media Water Holding Fraction",
      description:
        "Normalize explicit retained-water volume to compatible media bulk volume under a caller-supplied measurement basis.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          retainedWaterVolume: { type: "number", minimum: 0 },
          mediaBulkVolume: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["retainedWaterVolume", "mediaBulkVolume"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          fraction: { type: "number" },
          remainder: { type: "number" },
        },
        required: ["fraction", "remainder"],
      },
      ports: {
        inputs: [
          {
            id: "retainedWaterVolume",
            label: "Retained Water Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "mediaBulkVolume",
            label: "Media Bulk Volume",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "fraction", label: "Fraction", valueType: { type: "number" } },
          {
            id: "remainder",
            label: "Remainder",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = hydroponicGrowMediaWaterHoldingFractionTool.execute;
export default hydroponicGrowMediaWaterHoldingFractionTool;
