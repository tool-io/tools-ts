import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly topDepth: number; readonly bottomDepth: number };
export type Output = {
  readonly midpointDepth: number;
  readonly thickness: number;
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
    midpointDepth: { type: "number" },
    thickness: { type: "number" },
  },
  required: ["midpointDepth", "thickness"],
} as const;
/** Calculate the midpoint and thickness of an explicit soil sampling interval on compatible depth units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { topDepth, bottomDepth } = request;
  const compute = (): Output => {
    H.domain(topDepth >= 0 && bottomDepth >= topDepth, "topDepth");
    return {
      midpointDepth: topDepth / 2 + bottomDepth / 2,
      thickness: bottomDepth - topDepth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { topDepth: 10, bottomDepth: 30 },
  output: { midpointDepth: 20, thickness: 20 },
} satisfies ToolExample<Input, Output>;
export const soilSampleDepthMidpointTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agrochemistry", "agriculture"],
      keywords: ["agrochemistry", "agriculture"],
    },
    id: "agrochemistry/soil-sample-depth-midpoint",
    title: "Soil Sample Depth Midpoint",
    description:
      "Calculate the midpoint and thickness of an explicit soil sampling interval on compatible depth units.",
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
        midpointDepth: { type: "number" },
        thickness: { type: "number" },
      },
      required: ["midpointDepth", "thickness"],
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
          id: "midpointDepth",
          label: "Midpoint Depth",
          valueType: { type: "number" },
        },
        { id: "thickness", label: "Thickness", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = soilSampleDepthMidpointTool.execute;
export default soilSampleDepthMidpointTool;
