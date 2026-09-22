import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly originHeight: number;
  readonly x: number;
  readonly y: number;
  readonly xSlope: number;
  readonly ySlope: number;
};
export type Output = { readonly height: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originHeight: { type: "number" },
    x: { type: "number" },
    y: { type: "number" },
    xSlope: { type: "number" },
    ySlope: { type: "number" },
  },
  required: ["originHeight", "x", "y", "xSlope", "ySlope"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { height: { type: "number" } },
  required: ["height"],
} as const;
/** Calculate roof plane height sample from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { originHeight, x, y, xSlope, ySlope } = request;
  const compute = (): Output => {
    return { height: originHeight + x * xSlope + y * ySlope };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { originHeight: 3, x: 4, y: 2, xSlope: 0.25, ySlope: -0.5 },
  output: { height: 3 },
} satisfies ToolExample<Input, Output>;
export const roofPlaneHeightSampleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "architecture/roof-plane-height-sample",
    title: "Roof Plane Height Sample Tool",
    description:
      "Calculate roof plane height sample from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        originHeight: { type: "number" },
        x: { type: "number" },
        y: { type: "number" },
        xSlope: { type: "number" },
        ySlope: { type: "number" },
      },
      required: ["originHeight", "x", "y", "xSlope", "ySlope"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { height: { type: "number" } },
      required: ["height"],
    },
    ports: {
      inputs: [
        {
          id: "originHeight",
          label: "Origin Height",
          required: true,
          valueType: { type: "number" },
        },
        { id: "x", label: "X", required: true, valueType: { type: "number" } },
        { id: "y", label: "Y", required: true, valueType: { type: "number" } },
        {
          id: "xSlope",
          label: "X Slope",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ySlope",
          label: "Y Slope",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "height", label: "Height", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = roofPlaneHeightSampleTool.execute;
export default roofPlaneHeightSampleTool;
