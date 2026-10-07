import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly leftCoordinate: number;
  readonly rightCoordinate: number;
  readonly positiveAxisLabel: string;
};
export type Output = {
  readonly rightMinusLeft: number;
  readonly axisLabel: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftCoordinate: { type: "number" },
    rightCoordinate: { type: "number" },
    positiveAxisLabel: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["leftCoordinate", "rightCoordinate", "positiveAxisLabel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rightMinusLeft: { type: "number" },
    axisLabel: { type: "string", maxLength: 8192 },
  },
  required: ["rightMinusLeft", "axisLabel"],
} as const;
/** Compare explicitly marked landmark coordinates on a supplied image axis without detecting posture or diagnosing asymmetry. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { leftCoordinate, rightCoordinate, positiveAxisLabel } = request;
  const compute = (): Output => {
    H.domain(positiveAxisLabel.length > 0, "positiveAxisLabel");
    return {
      rightMinusLeft: rightCoordinate - leftCoordinate,
      axisLabel: positiveAxisLabel,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    leftCoordinate: 12,
    rightCoordinate: 15,
    positiveAxisLabel: "upward",
  },
  output: { rightMinusLeft: 3, axisLabel: "upward" },
} satisfies ToolExample<Input, Output>;
export const postureLandmarkAsymmetryInputTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["chiropractic", "health and medicine"],
      keywords: ["chiropractic", "health and medicine"],
    },
    id: "chiropractic/posture-landmark-asymmetry-input",
    title: "Posture Landmark Asymmetry Input",
    description:
      "Compare explicitly marked landmark coordinates on a supplied image axis without detecting posture or diagnosing asymmetry.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leftCoordinate: { type: "number" },
        rightCoordinate: { type: "number" },
        positiveAxisLabel: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["leftCoordinate", "rightCoordinate", "positiveAxisLabel"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rightMinusLeft: { type: "number" },
        axisLabel: { type: "string", maxLength: 8192 },
      },
      required: ["rightMinusLeft", "axisLabel"],
    },
    ports: {
      inputs: [
        {
          id: "leftCoordinate",
          label: "Left Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rightCoordinate",
          label: "Right Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "positiveAxisLabel",
          label: "Positive Axis Label",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "rightMinusLeft",
          label: "Right Minus Left",
          valueType: { type: "number" },
        },
        { id: "axisLabel", label: "Axis Label", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = postureLandmarkAsymmetryInputTool.execute;
export default postureLandmarkAsymmetryInputTool;
