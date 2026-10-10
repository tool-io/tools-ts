import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly upperLevel: number;
  readonly lowerLevel: number;
  readonly riserCount: number;
};
export type Output = {
  readonly totalRise: number;
  readonly equalRiserHeight: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    upperLevel: { type: "number" },
    lowerLevel: { type: "number" },
    riserCount: { type: "integer", minimum: 1 },
  },
  required: ["upperLevel", "lowerLevel", "riserCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalRise: { type: "number" },
    equalRiserHeight: { type: "number" },
  },
  required: ["totalRise", "equalRiserHeight"],
} as const;
/** Divide an explicit landscape level difference into supplied equal risers without checking stair codes or selecting dimensions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { upperLevel, lowerLevel, riserCount } = request;
  const compute = (): Output => {
    H.domain(upperLevel >= lowerLevel, "upperLevel");
    (H.domain(
      Number.isSafeInteger(riserCount) &&
        riserCount >= 1 &&
        riserCount <= Number.MAX_SAFE_INTEGER,
      "riserCount",
    ),
      riserCount);
    return {
      totalRise: upperLevel - lowerLevel,
      equalRiserHeight: (upperLevel - lowerLevel) / riserCount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { upperLevel: 2.4, lowerLevel: 1.2, riserCount: 6 },
  output: { totalRise: 1.2, equalRiserHeight: 0.19999999999999998 },
} satisfies ToolExample<Input, Output>;
export const outdoorStairLandscapeLevelGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "landscape-architecture",
        "landscape architecture",
        "arts and design",
      ],
      keywords: ["landscape architecture", "arts and design"],
    },
    id: "landscape-architecture/outdoor-stair-landscape-level-gap",
    title: "Outdoor Stair Landscape Level Gap",
    description:
      "Divide an explicit landscape level difference into supplied equal risers without checking stair codes or selecting dimensions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        upperLevel: { type: "number" },
        lowerLevel: { type: "number" },
        riserCount: { type: "integer", minimum: 1 },
      },
      required: ["upperLevel", "lowerLevel", "riserCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalRise: { type: "number" },
        equalRiserHeight: { type: "number" },
      },
      required: ["totalRise", "equalRiserHeight"],
    },
    ports: {
      inputs: [
        {
          id: "upperLevel",
          label: "Upper Level",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lowerLevel",
          label: "Lower Level",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "riserCount",
          label: "Riser Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "totalRise", label: "Total Rise", valueType: { type: "number" } },
        {
          id: "equalRiserHeight",
          label: "Equal Riser Height",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = outdoorStairLandscapeLevelGapTool.execute;
export default outdoorStairLandscapeLevelGapTool;
