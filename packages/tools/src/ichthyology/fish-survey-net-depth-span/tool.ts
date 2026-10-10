import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly topDepth: number; readonly bottomDepth: number };
export type Output = { readonly depthSpan: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    topDepth: { type: "number", minimum: 0 },
    bottomDepth: { type: "number" },
  },
  required: ["topDepth", "bottomDepth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { depthSpan: { type: "number" } },
  required: ["depthSpan"],
} as const;
/** Calculate an explicitly ordered survey-net depth span from a shared surface datum without estimating sampled volume. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { topDepth, bottomDepth } = request;
  const compute = (): Output => {
    H.domain(topDepth >= 0, "topDepth");
    H.domain(bottomDepth >= topDepth, "bottomDepth");
    return { depthSpan: bottomDepth - topDepth };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { topDepth: 2, bottomDepth: 8 },
  output: { depthSpan: 6 },
} satisfies ToolExample<Input, Output>;
export const fishSurveyNetDepthSpanTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ichthyology/fish-survey-net-depth-span",
    title: "Fish Survey Net Depth Span Tool",
    description:
      "Calculate an explicitly ordered survey-net depth span from a shared surface datum without estimating sampled volume.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        topDepth: { type: "number", minimum: 0 },
        bottomDepth: { type: "number" },
      },
      required: ["topDepth", "bottomDepth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { depthSpan: { type: "number" } },
      required: ["depthSpan"],
    },
    ports: {
      inputs: [
        {
          id: "topDepth",
          label: "Top Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bottomDepth",
          label: "Bottom Depth",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "depthSpan", label: "Depth Span", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = fishSurveyNetDepthSpanTool.execute;
export default fishSurveyNetDepthSpanTool;
