import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly totalRun: number; readonly postCount: number };
export type Output = {
  readonly bayCount: number;
  readonly equalCenterSpacing: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalRun: { type: "number", minimum: 0 },
    postCount: { type: "integer", minimum: 2 },
  },
  required: ["totalRun", "postCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bayCount: { type: "integer" },
    equalCenterSpacing: { type: "number" },
  },
  required: ["bayCount", "equalCenterSpacing"],
} as const;
/** Divide an explicit straight fence run into equal post-center bays including both endpoint posts. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalRun, postCount } = request;
  const compute = (): Output => {
    H.domain(totalRun >= 0, "totalRun");
    (H.domain(
      Number.isSafeInteger(postCount) &&
        postCount >= 2 &&
        postCount <= Number.MAX_SAFE_INTEGER,
      "postCount",
    ),
      postCount);
    return {
      bayCount: postCount - 1,
      equalCenterSpacing: totalRun / (postCount - 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalRun: 24, postCount: 7 },
  output: { bayCount: 6, equalCenterSpacing: 4 },
} satisfies ToolExample<Input, Output>;
export const fencePostBayEqualSpacingTool = H.defineSchemaCalculation<
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
    id: "landscape-architecture/fence-post-bay-equal-spacing",
    title: "Fence Post Bay Equal Spacing",
    description:
      "Divide an explicit straight fence run into equal post-center bays including both endpoint posts.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalRun: { type: "number", minimum: 0 },
        postCount: { type: "integer", minimum: 2 },
      },
      required: ["totalRun", "postCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bayCount: { type: "integer" },
        equalCenterSpacing: { type: "number" },
      },
      required: ["bayCount", "equalCenterSpacing"],
    },
    ports: {
      inputs: [
        {
          id: "totalRun",
          label: "Total Run",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "postCount",
          label: "Post Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "bayCount", label: "Bay Count", valueType: { type: "integer" } },
        {
          id: "equalCenterSpacing",
          label: "Equal Center Spacing",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fencePostBayEqualSpacingTool.execute;
export default fencePostBayEqualSpacingTool;
