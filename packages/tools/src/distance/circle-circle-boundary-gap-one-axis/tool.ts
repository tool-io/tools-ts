import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstCenter: number;
  readonly secondCenter: number;
  readonly firstRadius: number;
  readonly secondRadius: number;
};
export type Output = { readonly gap: number; readonly disjoint: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstCenter: { type: "number" },
    secondCenter: { type: "number" },
    firstRadius: { type: "number", minimum: 0 },
    secondRadius: { type: "number", minimum: 0 },
  },
  required: ["firstCenter", "secondCenter", "firstRadius", "secondRadius"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "number" }, disjoint: { type: "boolean" } },
  required: ["gap", "disjoint"],
} as const;
/** Calculate circle circle boundary gap one axis from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { firstCenter, secondCenter, firstRadius, secondRadius } = input;
  const compute = (): Output => {
    H.domain(firstRadius >= 0 && secondRadius >= 0);
    const d = Math.abs(firstCenter - secondCenter),
      gap = Math.max(
        0,
        d - firstRadius - secondRadius,
        Math.abs(firstRadius - secondRadius) - d,
      );
    return { gap, disjoint: gap > 0 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { firstCenter: 0, secondCenter: 10, firstRadius: 2, secondRadius: 3 },
  output: { gap: 5, disjoint: true },
} satisfies ToolExample<Input, Output>;
export const circleCircleBoundaryGapOneAxisTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "distance/circle-circle-boundary-gap-one-axis",
    title: "Circle Circle Boundary Gap One Axis Tool",
    description:
      "Calculate circle circle boundary gap one axis from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstCenter: { type: "number" },
        secondCenter: { type: "number" },
        firstRadius: { type: "number", minimum: 0 },
        secondRadius: { type: "number", minimum: 0 },
      },
      required: ["firstCenter", "secondCenter", "firstRadius", "secondRadius"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gap: { type: "number" }, disjoint: { type: "boolean" } },
      required: ["gap", "disjoint"],
    },
    ports: {
      inputs: [
        {
          id: "firstCenter",
          label: "First Center",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondCenter",
          label: "Second Center",
          required: true,
          valueType: { type: "number" },
        },
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
      ],
      outputs: [
        { id: "gap", label: "Gap", valueType: { type: "number" } },
        { id: "disjoint", label: "Disjoint", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = circleCircleBoundaryGapOneAxisTool.execute;
export default circleCircleBoundaryGapOneAxisTool;
