import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reusedWaterVolume: number;
  readonly totalWaterVolume: number;
};
export type Output = { readonly fraction: number; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reusedWaterVolume: { type: "number", minimum: 0 },
    totalWaterVolume: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["reusedWaterVolume", "totalWaterVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, remainder: { type: "number" } },
  required: ["fraction", "remainder"],
} as const;
/** Normalize an explicit reused-water volume to compatible total recorded water volume. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reusedWaterVolume, totalWaterVolume } = request;
  const compute = (): Output => {
    (H.domain(totalWaterVolume > 0, "totalWaterVolume"), totalWaterVolume);
    H.domain(
      reusedWaterVolume >= 0 && reusedWaterVolume <= totalWaterVolume,
      "reusedWaterVolume",
    );
    return {
      fraction: reusedWaterVolume / totalWaterVolume,
      remainder: totalWaterVolume - reusedWaterVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reusedWaterVolume: 30, totalWaterVolume: 120 },
  output: { fraction: 0.25, remainder: 90 },
} satisfies ToolExample<Input, Output>;
export const farmWaterReusedFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "sustainable-agriculture",
        "sustainable agriculture",
        "agriculture",
      ],
      keywords: ["sustainable agriculture", "agriculture"],
    },
    id: "sustainable-agriculture/farm-water-reused-fraction",
    title: "Farm Water Reused Fraction",
    description:
      "Normalize an explicit reused-water volume to compatible total recorded water volume.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reusedWaterVolume: { type: "number", minimum: 0 },
        totalWaterVolume: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["reusedWaterVolume", "totalWaterVolume"],
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
          id: "reusedWaterVolume",
          label: "Reused Water Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalWaterVolume",
          label: "Total Water Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        { id: "remainder", label: "Remainder", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = farmWaterReusedFractionTool.execute;
export default farmWaterReusedFractionTool;
