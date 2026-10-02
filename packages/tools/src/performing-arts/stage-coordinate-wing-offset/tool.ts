import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coordinate: number;
  readonly wingBoundary: number;
  readonly positiveTowardWing: boolean;
};
export type Output = { readonly offset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coordinate: { type: "number" },
    wingBoundary: { type: "number" },
    positiveTowardWing: { type: "boolean" },
  },
  required: ["coordinate", "wingBoundary", "positiveTowardWing"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { offset: { type: "number" } },
  required: ["offset"],
} as const;
/** Calculate stage coordinate wing offset from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coordinate, wingBoundary, positiveTowardWing } = request;
  const compute = (): Output => {
    return {
      offset: (coordinate - wingBoundary) * (positiveTowardWing ? 1 : -1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coordinate: 5, wingBoundary: 3, positiveTowardWing: true },
  output: { offset: 2 },
} satisfies ToolExample<Input, Output>;
export const stageCoordinateWingOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "performing-arts/stage-coordinate-wing-offset",
    title: "Stage Coordinate Wing Offset Tool",
    description:
      "Calculate stage coordinate wing offset from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coordinate: { type: "number" },
        wingBoundary: { type: "number" },
        positiveTowardWing: { type: "boolean" },
      },
      required: ["coordinate", "wingBoundary", "positiveTowardWing"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { offset: { type: "number" } },
      required: ["offset"],
    },
    ports: {
      inputs: [
        {
          id: "coordinate",
          label: "Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "wingBoundary",
          label: "Wing Boundary",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "positiveTowardWing",
          label: "Positive Toward Wing",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "offset", label: "Offset", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = stageCoordinateWingOffsetTool.execute;
export default stageCoordinateWingOffsetTool;
