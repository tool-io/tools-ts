import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly frontage: number;
  readonly depth: number;
  readonly suppliedFrontageExclusion: number;
  readonly excludeMarked: boolean;
};
export type Output = {
  readonly effectiveFrontage: number;
  readonly ratio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    frontage: { type: "number", minimum: 0 },
    depth: { type: "number", exclusiveMinimum: 0 },
    suppliedFrontageExclusion: { type: "number", minimum: 0 },
    excludeMarked: { type: "boolean" },
  },
  required: ["frontage", "depth", "suppliedFrontageExclusion", "excludeMarked"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effectiveFrontage: { type: "number" },
    ratio: { type: "number" },
  },
  required: ["effectiveFrontage", "ratio"],
} as const;
/** Supplied parcel-dimension ratio without zoning or buildability interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { frontage, depth, suppliedFrontageExclusion, excludeMarked } = request;
  const compute = (): Output => {
    H.positive(depth);
    H.domain(
      frontage >= 0 &&
        suppliedFrontageExclusion >= 0 &&
        suppliedFrontageExclusion <= frontage,
    );
    return {
      effectiveFrontage:
        frontage - (excludeMarked ? suppliedFrontageExclusion : 0),
      ratio:
        (frontage - (excludeMarked ? suppliedFrontageExclusion : 0)) / depth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    frontage: 20,
    depth: 40,
    suppliedFrontageExclusion: 4,
    excludeMarked: true,
  },
  output: { effectiveFrontage: 16, ratio: 0.4 },
} satisfies ToolExample<Input, Output>;
export const parcelFrontageDepthRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-planning/parcel-frontage-depth-ratio",
    title: "Parcel Frontage Depth Ratio Tool",
    description:
      "Supplied parcel-dimension ratio without zoning or buildability interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        frontage: { type: "number", minimum: 0 },
        depth: { type: "number", exclusiveMinimum: 0 },
        suppliedFrontageExclusion: { type: "number", minimum: 0 },
        excludeMarked: { type: "boolean" },
      },
      required: [
        "frontage",
        "depth",
        "suppliedFrontageExclusion",
        "excludeMarked",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        effectiveFrontage: { type: "number" },
        ratio: { type: "number" },
      },
      required: ["effectiveFrontage", "ratio"],
    },
    ports: {
      inputs: [
        {
          id: "frontage",
          label: "Frontage",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "depth",
          label: "Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedFrontageExclusion",
          label: "Supplied Frontage Exclusion",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludeMarked",
          label: "Exclude Marked",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "effectiveFrontage",
          label: "Effective Frontage",
          valueType: { type: "number" },
        },
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = parcelFrontageDepthRatioTool.execute;
export default parcelFrontageDepthRatioTool;
