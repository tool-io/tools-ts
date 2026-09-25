import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly angle: number; readonly radius: number };
export type Output = { readonly cubicErrorTerm: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { angle: { type: "number" }, radius: { type: "number" } },
  required: ["angle", "radius"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { cubicErrorTerm: { type: "number" } },
  required: ["cubicErrorTerm"],
} as const;
/** Compute geodesic chord small angle error term from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { angle, radius } = input;
  const compute = (): Output => {
    domain(Math.abs(angle) <= 0.1 && radius >= 0);
    return { cubicErrorTerm: (radius * Math.abs(angle) ** 3) / 24 };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { angle: 0, radius: 2 },
  output: { cubicErrorTerm: 0 },
} satisfies ToolExample<Input, Output>;
export const geodesicChordSmallAngleErrorTermTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "distance/geodesic-chord-small-angle-error-term",
  title: "Geodesic Chord Small Angle Error Term Tool",
  description:
    "Compute geodesic chord small angle error term from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "angle",
        label: "Angle",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "radius",
        label: "Radius",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      {
        id: "cubicErrorTerm",
        label: "Cubic Error Term",
        valueType: { type: "number" },
      },
    ],
  },
});
export const run = geodesicChordSmallAngleErrorTermTool.execute;
export default geodesicChordSmallAngleErrorTermTool;
