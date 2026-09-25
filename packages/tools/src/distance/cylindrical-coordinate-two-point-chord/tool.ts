import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstRadius: number;
  readonly firstAngle: number;
  readonly firstHeight: number;
  readonly secondRadius: number;
  readonly secondAngle: number;
  readonly secondHeight: number;
};
export type Output = { readonly distance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstRadius: { type: "number", minimum: 0 },
    firstAngle: { type: "number" },
    firstHeight: { type: "number" },
    secondRadius: { type: "number", minimum: 0 },
    secondAngle: { type: "number" },
    secondHeight: { type: "number" },
  },
  required: [
    "firstRadius",
    "firstAngle",
    "firstHeight",
    "secondRadius",
    "secondAngle",
    "secondHeight",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { distance: { type: "number" } },
  required: ["distance"],
} as const;
/** Calculate cylindrical coordinate two point chord from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstRadius,
    firstAngle,
    firstHeight,
    secondRadius,
    secondAngle,
    secondHeight,
  } = request;
  const compute = (): Output => {
    H.domain(firstRadius >= 0 && secondRadius >= 0);
    const planar = Math.hypot(
      firstRadius - secondRadius,
      2 *
        Math.sqrt(firstRadius) *
        Math.sqrt(secondRadius) *
        Math.sin((firstAngle - secondAngle) / 2),
    );
    return { distance: Math.hypot(planar, firstHeight - secondHeight) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstRadius: 3,
    firstAngle: 0,
    firstHeight: 0,
    secondRadius: 3,
    secondAngle: 3.141592653589793,
    secondHeight: 8,
  },
  output: { distance: 10 },
} satisfies ToolExample<Input, Output>;
export const cylindricalCoordinateTwoPointChordTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "distance/cylindrical-coordinate-two-point-chord",
    title: "Cylindrical Coordinate Two Point Chord Tool",
    description:
      "Calculate cylindrical coordinate two point chord from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstRadius: { type: "number", minimum: 0 },
        firstAngle: { type: "number" },
        firstHeight: { type: "number" },
        secondRadius: { type: "number", minimum: 0 },
        secondAngle: { type: "number" },
        secondHeight: { type: "number" },
      },
      required: [
        "firstRadius",
        "firstAngle",
        "firstHeight",
        "secondRadius",
        "secondAngle",
        "secondHeight",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { distance: { type: "number" } },
      required: ["distance"],
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
          id: "firstAngle",
          label: "First Angle",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstHeight",
          label: "First Height",
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
          id: "secondAngle",
          label: "Second Angle",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondHeight",
          label: "Second Height",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "distance", label: "Distance", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = cylindricalCoordinateTwoPointChordTool.execute;
export default cylindricalCoordinateTwoPointChordTool;
