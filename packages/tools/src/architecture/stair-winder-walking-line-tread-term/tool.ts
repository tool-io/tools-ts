import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly walkingRadius: number;
  readonly angleRadians: number;
};
export type Output = { readonly arcTread: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    walkingRadius: { type: "number", exclusiveMinimum: 0 },
    angleRadians: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["walkingRadius", "angleRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { arcTread: { type: "number" } },
  required: ["arcTread"],
} as const;
/** Calculate stair winder walking line tread term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { walkingRadius, angleRadians } = request;
  const compute = (): Output => {
    H.positive(walkingRadius);
    H.domain(angleRadians > 0 && angleRadians <= Math.PI);
    return { arcTread: walkingRadius * angleRadians };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { walkingRadius: 1.2, angleRadians: 0.5235987755982988 },
  output: { arcTread: 0.6283185307179585 },
} satisfies ToolExample<Input, Output>;
export const stairWinderWalkingLineTreadTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "architecture/stair-winder-walking-line-tread-term",
    title: "Stair Winder Walking Line Tread Term Tool",
    description:
      "Calculate stair winder walking line tread term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        walkingRadius: { type: "number", exclusiveMinimum: 0 },
        angleRadians: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["walkingRadius", "angleRadians"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { arcTread: { type: "number" } },
      required: ["arcTread"],
    },
    ports: {
      inputs: [
        {
          id: "walkingRadius",
          label: "Walking Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "angleRadians",
          label: "Angle Radians",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "arcTread", label: "Arc Tread", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = stairWinderWalkingLineTreadTermTool.execute;
export default stairWinderWalkingLineTreadTermTool;
