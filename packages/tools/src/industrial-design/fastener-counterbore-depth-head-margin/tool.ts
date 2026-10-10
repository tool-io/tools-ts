import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly counterboreDepth: number;
  readonly headHeight: number;
};
export type Output = { readonly recessMargin: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    counterboreDepth: { type: "number", minimum: 0 },
    headHeight: { type: "number", minimum: 0 },
  },
  required: ["counterboreDepth", "headHeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { recessMargin: { type: "number" } },
  required: ["recessMargin"],
} as const;
/** Compare explicit counterbore depth and fastener head height without choosing dimensions or assessing joint strength. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { counterboreDepth, headHeight } = request;
  const compute = (): Output => {
    H.domain(counterboreDepth >= 0 && headHeight >= 0, "counterboreDepth");
    return { recessMargin: counterboreDepth - headHeight };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { counterboreDepth: 8, headHeight: 6 },
  output: { recessMargin: 2 },
} satisfies ToolExample<Input, Output>;
export const fastenerCounterboreDepthHeadMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["industrial-design", "industrial design", "arts and design"],
      keywords: ["industrial design", "arts and design"],
    },
    id: "industrial-design/fastener-counterbore-depth-head-margin",
    title: "Fastener Counterbore Depth Head Margin",
    description:
      "Compare explicit counterbore depth and fastener head height without choosing dimensions or assessing joint strength.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        counterboreDepth: { type: "number", minimum: 0 },
        headHeight: { type: "number", minimum: 0 },
      },
      required: ["counterboreDepth", "headHeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { recessMargin: { type: "number" } },
      required: ["recessMargin"],
    },
    ports: {
      inputs: [
        {
          id: "counterboreDepth",
          label: "Counterbore Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "headHeight",
          label: "Head Height",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "recessMargin",
          label: "Recess Margin",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fastenerCounterboreDepthHeadMarginTool.execute;
export default fastenerCounterboreDepthHeadMarginTool;
