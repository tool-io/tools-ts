import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly topDepth: number; readonly bottomDepth: number };
export type Output = {
  readonly screenLength: number;
  readonly midpointDepth: number;
};
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
  properties: {
    screenLength: { type: "number" },
    midpointDepth: { type: "number" },
  },
  required: ["screenLength", "midpointDepth"],
} as const;
/** Return the interval length and midpoint of a well screen from explicit depths increasing downward. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { topDepth, bottomDepth } = request;
  const compute = (): Output => {
    H.domain(topDepth >= 0 && bottomDepth >= topDepth, "topDepth");
    return {
      screenLength: bottomDepth - topDepth,
      midpointDepth: topDepth / 2 + bottomDepth / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { topDepth: 12, bottomDepth: 18 },
  output: { screenLength: 6, midpointDepth: 15 },
} satisfies ToolExample<Input, Output>;
export const remediationWellScreenDepthSpanTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "environmental-engineering",
        "environmental engineering",
        "engineering",
      ],
      keywords: ["environmental engineering", "engineering"],
    },
    id: "environmental-engineering/remediation-well-screen-depth-span",
    title: "Remediation Well Screen Depth Span",
    description:
      "Return the interval length and midpoint of a well screen from explicit depths increasing downward.",
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
      properties: {
        screenLength: { type: "number" },
        midpointDepth: { type: "number" },
      },
      required: ["screenLength", "midpointDepth"],
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
        {
          id: "screenLength",
          label: "Screen Length",
          valueType: { type: "number" },
        },
        {
          id: "midpointDepth",
          label: "Midpoint Depth",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = remediationWellScreenDepthSpanTool.execute;
export default remediationWellScreenDepthSpanTool;
