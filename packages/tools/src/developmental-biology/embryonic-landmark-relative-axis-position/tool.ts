import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly landmarkCoordinate: number;
  readonly axisStart: number;
  readonly axisEnd: number;
};
export type Output = { readonly axisFraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    landmarkCoordinate: { type: "number" },
    axisStart: { type: "number" },
    axisEnd: { type: "number" },
  },
  required: ["landmarkCoordinate", "axisStart", "axisEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { axisFraction: { type: "number" } },
  required: ["axisFraction"],
} as const;
/** Normalize a supplied embryonic landmark coordinate between explicit distinct axis endpoints without clipping or assigning developmental stage. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { landmarkCoordinate, axisStart, axisEnd } = request;
  const compute = (): Output => {
    H.domain(axisEnd !== axisStart, "axisEnd");
    return {
      axisFraction: (landmarkCoordinate - axisStart) / (axisEnd - axisStart),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { landmarkCoordinate: 12, axisStart: 10, axisEnd: 18 },
  output: { axisFraction: 0.25 },
} satisfies ToolExample<Input, Output>;
export const embryonicLandmarkRelativeAxisPositionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "developmental-biology/embryonic-landmark-relative-axis-position",
      title: "Embryonic Landmark Relative Axis Position Tool",
      description:
        "Normalize a supplied embryonic landmark coordinate between explicit distinct axis endpoints without clipping or assigning developmental stage.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          landmarkCoordinate: { type: "number" },
          axisStart: { type: "number" },
          axisEnd: { type: "number" },
        },
        required: ["landmarkCoordinate", "axisStart", "axisEnd"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { axisFraction: { type: "number" } },
        required: ["axisFraction"],
      },
      ports: {
        inputs: [
          {
            id: "landmarkCoordinate",
            label: "Landmark Coordinate",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "axisStart",
            label: "Axis Start",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "axisEnd",
            label: "Axis End",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "axisFraction",
            label: "Axis Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = embryonicLandmarkRelativeAxisPositionTool.execute;
export default embryonicLandmarkRelativeAxisPositionTool;
