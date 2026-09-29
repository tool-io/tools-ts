import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly innerRadius: number;
  readonly thickness: number;
  readonly neutralFraction: number;
  readonly angleRadians: number;
};
export type Output = { readonly length: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    innerRadius: { type: "number", minimum: 0 },
    thickness: { type: "number", minimum: 0 },
    neutralFraction: { type: "number", minimum: 0, maximum: 1 },
    angleRadians: { type: "number", minimum: 0 },
  },
  required: ["innerRadius", "thickness", "neutralFraction", "angleRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { length: { type: "number" } },
  required: ["length"],
} as const;
/** Calculate living hinge neutral axis length from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { innerRadius, thickness, neutralFraction, angleRadians } = request;
  const compute = (): Output => {
    H.domain(innerRadius >= 0 && thickness >= 0 && angleRadians >= 0);
    H.probability(neutralFraction);
    return {
      length: (innerRadius + neutralFraction * thickness) * angleRadians,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    innerRadius: 2,
    thickness: 1,
    neutralFraction: 0.5,
    angleRadians: 3.141592653589793,
  },
  output: { length: 7.853981633974483 },
} satisfies ToolExample<Input, Output>;
export const livingHingeNeutralAxisLengthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-design/living-hinge-neutral-axis-length",
    title: "Living Hinge Neutral Axis Length Tool",
    description:
      "Calculate living hinge neutral axis length from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        innerRadius: { type: "number", minimum: 0 },
        thickness: { type: "number", minimum: 0 },
        neutralFraction: { type: "number", minimum: 0, maximum: 1 },
        angleRadians: { type: "number", minimum: 0 },
      },
      required: ["innerRadius", "thickness", "neutralFraction", "angleRadians"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { length: { type: "number" } },
      required: ["length"],
    },
    ports: {
      inputs: [
        {
          id: "innerRadius",
          label: "Inner Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "thickness",
          label: "Thickness",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "neutralFraction",
          label: "Neutral Fraction",
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
        { id: "length", label: "Length", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = livingHingeNeutralAxisLengthTool.execute;
export default livingHingeNeutralAxisLengthTool;
