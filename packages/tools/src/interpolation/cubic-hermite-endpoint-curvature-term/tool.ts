import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly left: number;
  readonly right: number;
  readonly leftSlope: number;
  readonly rightSlope: number;
  readonly span: number;
  readonly atRight: boolean;
};
export type Output = { readonly curvature: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    left: { type: "number" },
    right: { type: "number" },
    leftSlope: { type: "number" },
    rightSlope: { type: "number" },
    span: { type: "number", exclusiveMinimum: 0 },
    atRight: { type: "boolean" },
  },
  required: ["left", "right", "leftSlope", "rightSlope", "span", "atRight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { curvature: { type: "number" } },
  required: ["curvature"],
} as const;
/** Calculate cubic hermite endpoint curvature term from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { left, right, leftSlope, rightSlope, span, atRight } = input;
  const compute = (): Output => {
    H.positive(span);
    return {
      curvature: atRight
        ? (6 * (left - right) + span * (2 * leftSlope + 4 * rightSlope)) /
          (span * span)
        : (6 * (right - left) - span * (4 * leftSlope + 2 * rightSlope)) /
          (span * span),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: {
    left: 0,
    right: 1,
    leftSlope: 0,
    rightSlope: 0,
    span: 1,
    atRight: false,
  },
  output: { curvature: 6 },
} satisfies ToolExample<Input, Output>;
export const cubicHermiteEndpointCurvatureTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "interpolation/cubic-hermite-endpoint-curvature-term",
    title: "Cubic Hermite Endpoint Curvature Term Tool",
    description:
      "Calculate cubic hermite endpoint curvature term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        left: { type: "number" },
        right: { type: "number" },
        leftSlope: { type: "number" },
        rightSlope: { type: "number" },
        span: { type: "number", exclusiveMinimum: 0 },
        atRight: { type: "boolean" },
      },
      required: ["left", "right", "leftSlope", "rightSlope", "span", "atRight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { curvature: { type: "number" } },
      required: ["curvature"],
    },
    ports: {
      inputs: [
        {
          id: "left",
          label: "Left",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "right",
          label: "Right",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "leftSlope",
          label: "Left Slope",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rightSlope",
          label: "Right Slope",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "span",
          label: "Span",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "atRight",
          label: "At Right",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "curvature", label: "Curvature", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = cubicHermiteEndpointCurvatureTermTool.execute;
export default cubicHermiteEndpointCurvatureTermTool;
