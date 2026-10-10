import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly stoneLength: number; readonly edgeGap: number };
export type Output = { readonly centerSpacing: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stoneLength: { type: "number", minimum: 0 },
    edgeGap: { type: "number" },
  },
  required: ["stoneLength", "edgeGap"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { centerSpacing: { type: "number" } },
  required: ["centerSpacing"],
} as const;
/** Calculate explicit repeated equal-stone center spacing from stone length and signed edge gap without recommending accessible path dimensions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stoneLength, edgeGap } = request;
  const compute = (): Output => {
    H.domain(stoneLength >= 0 && stoneLength + edgeGap >= 0, "stoneLength");
    return { centerSpacing: stoneLength + edgeGap };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stoneLength: 40, edgeGap: 15 },
  output: { centerSpacing: 55 },
} satisfies ToolExample<Input, Output>;
export const steppingStoneCenterGapSpacingTool = H.defineSchemaCalculation<
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
    id: "landscape-architecture/stepping-stone-center-gap-spacing",
    title: "Stepping Stone Center Gap Spacing",
    description:
      "Calculate explicit repeated equal-stone center spacing from stone length and signed edge gap without recommending accessible path dimensions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stoneLength: { type: "number", minimum: 0 },
        edgeGap: { type: "number" },
      },
      required: ["stoneLength", "edgeGap"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { centerSpacing: { type: "number" } },
      required: ["centerSpacing"],
    },
    ports: {
      inputs: [
        {
          id: "stoneLength",
          label: "Stone Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "edgeGap",
          label: "Edge Gap",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "centerSpacing",
          label: "Center Spacing",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = steppingStoneCenterGapSpacingTool.execute;
export default steppingStoneCenterGapSpacingTool;
