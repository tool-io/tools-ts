import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly interiorCount: number;
  readonly topCount: number;
  readonly bottomCount: number;
  readonly leftCount: number;
  readonly rightCount: number;
  readonly includeTop: boolean;
  readonly includeBottom: boolean;
  readonly includeLeft: boolean;
  readonly includeRight: boolean;
};
export type Output = { readonly count: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    interiorCount: { type: "integer" },
    topCount: { type: "integer" },
    bottomCount: { type: "integer" },
    leftCount: { type: "integer" },
    rightCount: { type: "integer" },
    includeTop: { type: "boolean" },
    includeBottom: { type: "boolean" },
    includeLeft: { type: "boolean" },
    includeRight: { type: "boolean" },
  },
  required: [
    "interiorCount",
    "topCount",
    "bottomCount",
    "leftCount",
    "rightCount",
    "includeTop",
    "includeBottom",
    "includeLeft",
    "includeRight",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { count: { type: "integer" } },
  required: ["count"],
} as const;
/** Count disjoint interior/edge categories under an explicit policy; corner observations must already be assigned once. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    interiorCount,
    topCount,
    bottomCount,
    leftCount,
    rightCount,
    includeTop,
    includeBottom,
    includeLeft,
    includeRight,
  } = request;
  const compute = (): Output => {
    H.domain(
      [interiorCount, topCount, bottomCount, leftCount, rightCount].every(
        (x) => x >= 0,
      ),
    );
    return {
      count:
        interiorCount +
        (includeTop ? topCount : 0) +
        (includeBottom ? bottomCount : 0) +
        (includeLeft ? leftCount : 0) +
        (includeRight ? rightCount : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    interiorCount: 10,
    topCount: 2,
    bottomCount: 3,
    leftCount: 4,
    rightCount: 1,
    includeTop: true,
    includeBottom: false,
    includeLeft: true,
    includeRight: false,
  },
  output: { count: 16 },
} satisfies ToolExample<Input, Output>;
export const stomataCountEdgePolicyTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "botany/stomata-count-edge-policy-token",
    title: "Stomata Count Edge Policy Token Tool",
    description:
      "Count disjoint interior/edge categories under an explicit policy; corner observations must already be assigned once.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        interiorCount: { type: "integer" },
        topCount: { type: "integer" },
        bottomCount: { type: "integer" },
        leftCount: { type: "integer" },
        rightCount: { type: "integer" },
        includeTop: { type: "boolean" },
        includeBottom: { type: "boolean" },
        includeLeft: { type: "boolean" },
        includeRight: { type: "boolean" },
      },
      required: [
        "interiorCount",
        "topCount",
        "bottomCount",
        "leftCount",
        "rightCount",
        "includeTop",
        "includeBottom",
        "includeLeft",
        "includeRight",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { count: { type: "integer" } },
      required: ["count"],
    },
    ports: {
      inputs: [
        {
          id: "interiorCount",
          label: "Interior Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "topCount",
          label: "Top Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "bottomCount",
          label: "Bottom Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "leftCount",
          label: "Left Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "rightCount",
          label: "Right Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "includeTop",
          label: "Include Top",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "includeBottom",
          label: "Include Bottom",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "includeLeft",
          label: "Include Left",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "includeRight",
          label: "Include Right",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "count", label: "Count", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = stomataCountEdgePolicyTokenTool.execute;
export default stomataCountEdgePolicyTokenTool;
