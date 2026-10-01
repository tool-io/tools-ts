import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly diameter: number;
  readonly leftEdgeHalfWidth: number;
  readonly rightEdgeHalfWidth: number;
};
export type Output = {
  readonly lower: number;
  readonly upper: number;
  readonly halfWidth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    diameter: { type: "number", minimum: 0 },
    leftEdgeHalfWidth: { type: "number", minimum: 0 },
    rightEdgeHalfWidth: { type: "number", minimum: 0 },
  },
  required: ["diameter", "leftEdgeHalfWidth", "rightEdgeHalfWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lower: { type: "number" },
    upper: { type: "number" },
    halfWidth: { type: "number" },
  },
  required: ["lower", "upper", "halfWidth"],
} as const;
/** Propagate supplied bounded edge-location errors into a diameter interval, without estimating blur from an image. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { diameter, leftEdgeHalfWidth, rightEdgeHalfWidth } = request;
  const compute = (): Output => {
    H.domain(
      diameter >= 0 &&
        leftEdgeHalfWidth >= 0 &&
        rightEdgeHalfWidth >= 0 &&
        diameter >= leftEdgeHalfWidth + rightEdgeHalfWidth,
    );
    return {
      lower: diameter - leftEdgeHalfWidth - rightEdgeHalfWidth,
      upper: diameter + leftEdgeHalfWidth + rightEdgeHalfWidth,
      halfWidth: leftEdgeHalfWidth + rightEdgeHalfWidth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { diameter: 5, leftEdgeHalfWidth: 0.1, rightEdgeHalfWidth: 0.2 },
  output: { lower: 4.7, upper: 5.3, halfWidth: 0.30000000000000004 },
} satisfies ToolExample<Input, Output>;
export const pupilEdgeBlurUncertaintyTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ophthalmology/pupil-edge-blur-uncertainty-term",
    title: "Pupil Edge Blur Uncertainty Term Tool",
    description:
      "Propagate supplied bounded edge-location errors into a diameter interval, without estimating blur from an image.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        diameter: { type: "number", minimum: 0 },
        leftEdgeHalfWidth: { type: "number", minimum: 0 },
        rightEdgeHalfWidth: { type: "number", minimum: 0 },
      },
      required: ["diameter", "leftEdgeHalfWidth", "rightEdgeHalfWidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lower: { type: "number" },
        upper: { type: "number" },
        halfWidth: { type: "number" },
      },
      required: ["lower", "upper", "halfWidth"],
    },
    ports: {
      inputs: [
        {
          id: "diameter",
          label: "Diameter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "leftEdgeHalfWidth",
          label: "Left Edge Half Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rightEdgeHalfWidth",
          label: "Right Edge Half Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "lower", label: "Lower", valueType: { type: "number" } },
        { id: "upper", label: "Upper", valueType: { type: "number" } },
        { id: "halfWidth", label: "Half Width", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = pupilEdgeBlurUncertaintyTermTool.execute;
export default pupilEdgeBlurUncertaintyTermTool;
