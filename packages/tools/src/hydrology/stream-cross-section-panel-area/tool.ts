import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly leftDepth: number;
  readonly rightDepth: number;
  readonly width: number;
  readonly meanVelocity: number;
};
export type Output = { readonly area: number; readonly discharge: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftDepth: { type: "number", minimum: 0 },
    rightDepth: { type: "number", minimum: 0 },
    width: { type: "number", minimum: 0 },
    meanVelocity: { type: "number" },
  },
  required: ["leftDepth", "rightDepth", "width", "meanVelocity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { area: { type: "number" }, discharge: { type: "number" } },
  required: ["area", "discharge"],
} as const;
/** Trapezoidal wet panel area times caller-supplied signed panel-mean normal velocity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { leftDepth, rightDepth, width, meanVelocity } = request;
  const compute = (): Output => {
    H.domain(leftDepth >= 0 && rightDepth >= 0 && width >= 0);
    return {
      area: ((leftDepth + rightDepth) * width) / 2,
      discharge: ((leftDepth + rightDepth) * width * meanVelocity) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { leftDepth: 1, rightDepth: 2, width: 4, meanVelocity: 0.5 },
  output: { area: 6, discharge: 3 },
} satisfies ToolExample<Input, Output>;
export const streamCrossSectionPanelAreaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrology/stream-cross-section-panel-area",
    title: "Stream Cross Section Panel Area Tool",
    description:
      "Trapezoidal wet panel area times caller-supplied signed panel-mean normal velocity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leftDepth: { type: "number", minimum: 0 },
        rightDepth: { type: "number", minimum: 0 },
        width: { type: "number", minimum: 0 },
        meanVelocity: { type: "number" },
      },
      required: ["leftDepth", "rightDepth", "width", "meanVelocity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { area: { type: "number" }, discharge: { type: "number" } },
      required: ["area", "discharge"],
    },
    ports: {
      inputs: [
        {
          id: "leftDepth",
          label: "Left Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rightDepth",
          label: "Right Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "width",
          label: "Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "meanVelocity",
          label: "Mean Velocity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "area", label: "Area", valueType: { type: "number" } },
        { id: "discharge", label: "Discharge", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = streamCrossSectionPanelAreaTool.execute;
export default streamCrossSectionPanelAreaTool;
