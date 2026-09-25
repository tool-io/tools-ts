import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredLength: number;
  readonly inclinationFromVertical: number;
  readonly initialDepth: number;
};
export type Output = {
  readonly verticalIncrement: number;
  readonly horizontalIncrement: number;
  readonly finalDepth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredLength: { type: "number", minimum: 0 },
    inclinationFromVertical: { type: "number", minimum: 0 },
    initialDepth: { type: "number" },
  },
  required: ["measuredLength", "inclinationFromVertical", "initialDepth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    verticalIncrement: { type: "number" },
    horizontalIncrement: { type: "number" },
    finalDepth: { type: "number" },
  },
  required: ["verticalIncrement", "horizontalIncrement", "finalDepth"],
} as const;
/** Straight constant-inclination borehole segment with depth positive down; no minimum-curvature survey integration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredLength, inclinationFromVertical, initialDepth } = request;
  const compute = (): Output => {
    H.domain(
      measuredLength >= 0 &&
        inclinationFromVertical >= 0 &&
        inclinationFromVertical <= Math.PI,
    );
    return {
      verticalIncrement: measuredLength * Math.cos(inclinationFromVertical),
      horizontalIncrement: measuredLength * Math.sin(inclinationFromVertical),
      finalDepth:
        initialDepth + measuredLength * Math.cos(inclinationFromVertical),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    measuredLength: 100,
    inclinationFromVertical: 1.0471975511965976,
    initialDepth: 20,
  },
  output: {
    verticalIncrement: 50.000000000000014,
    horizontalIncrement: 86.60254037844386,
    finalDepth: 70.00000000000001,
  },
} satisfies ToolExample<Input, Output>;
export const boreholeDepthInclinationVerticalTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "earth-science/borehole-depth-inclination-vertical-term",
      title: "Borehole Depth Inclination Vertical Term Tool",
      description:
        "Straight constant-inclination borehole segment with depth positive down; no minimum-curvature survey integration.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          measuredLength: { type: "number", minimum: 0 },
          inclinationFromVertical: { type: "number", minimum: 0 },
          initialDepth: { type: "number" },
        },
        required: ["measuredLength", "inclinationFromVertical", "initialDepth"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          verticalIncrement: { type: "number" },
          horizontalIncrement: { type: "number" },
          finalDepth: { type: "number" },
        },
        required: ["verticalIncrement", "horizontalIncrement", "finalDepth"],
      },
      ports: {
        inputs: [
          {
            id: "measuredLength",
            label: "Measured Length",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "inclinationFromVertical",
            label: "Inclination From Vertical",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "initialDepth",
            label: "Initial Depth",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "verticalIncrement",
            label: "Vertical Increment",
            valueType: { type: "number" },
          },
          {
            id: "horizontalIncrement",
            label: "Horizontal Increment",
            valueType: { type: "number" },
          },
          {
            id: "finalDepth",
            label: "Final Depth",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = boreholeDepthInclinationVerticalTermTool.execute;
export default boreholeDepthInclinationVerticalTermTool;
