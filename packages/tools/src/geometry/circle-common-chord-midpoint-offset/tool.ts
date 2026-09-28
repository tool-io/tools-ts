import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstRadius: number;
  readonly secondRadius: number;
  readonly centerDistance: number;
};
export type Output = { readonly offset: number; readonly halfChord: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstRadius: { type: "number", exclusiveMinimum: 0 },
    secondRadius: { type: "number", exclusiveMinimum: 0 },
    centerDistance: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["firstRadius", "secondRadius", "centerDistance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { offset: { type: "number" }, halfChord: { type: "number" } },
  required: ["offset", "halfChord"],
} as const;
/** Calculate circle common chord midpoint offset from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { firstRadius, secondRadius, centerDistance } = input;
  const compute = (): Output => {
    H.positive(firstRadius);
    H.positive(secondRadius);
    H.positive(centerDistance);
    H.domain(
      centerDistance <= firstRadius + secondRadius &&
        centerDistance >= Math.abs(firstRadius - secondRadius),
    );
    const offset =
      (centerDistance ** 2 + firstRadius ** 2 - secondRadius ** 2) /
      (2 * centerDistance);
    return {
      offset,
      halfChord: Math.sqrt(Math.max(0, firstRadius ** 2 - offset ** 2)),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { firstRadius: 5, secondRadius: 5, centerDistance: 6 },
  output: { offset: 3, halfChord: 4 },
} satisfies ToolExample<Input, Output>;
export const circleCommonChordMidpointOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geometry/circle-common-chord-midpoint-offset",
    title: "Circle Common Chord Midpoint Offset Tool",
    description:
      "Calculate circle common chord midpoint offset from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstRadius: { type: "number", exclusiveMinimum: 0 },
        secondRadius: { type: "number", exclusiveMinimum: 0 },
        centerDistance: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["firstRadius", "secondRadius", "centerDistance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { offset: { type: "number" }, halfChord: { type: "number" } },
      required: ["offset", "halfChord"],
    },
    ports: {
      inputs: [
        {
          id: "firstRadius",
          label: "First Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondRadius",
          label: "Second Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "centerDistance",
          label: "Center Distance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "offset", label: "Offset", valueType: { type: "number" } },
        { id: "halfChord", label: "Half Chord", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = circleCommonChordMidpointOffsetTool.execute;
export default circleCommonChordMidpointOffsetTool;
