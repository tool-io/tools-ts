import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly angleRadians: number };
export type Output = { readonly factor: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { angleRadians: { type: "number" } },
  required: ["angleRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { factor: { type: "number" } },
  required: ["factor"],
} as const;
/** Compute circular sector centroid radial factor from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { angleRadians } = input;
  const compute = (): Output => {
    domain(angleRadians > 0 && angleRadians <= 2 * Math.PI);
    return { factor: (4 * Math.sin(angleRadians / 2)) / (3 * angleRadians) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { angleRadians: 3.141592653589793 },
  output: { factor: 0.4244131815783876 },
} satisfies ToolExample<Input, Output>;
export const circularSectorCentroidRadialFactorTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "geometry/circular-sector-centroid-radial-factor",
  title: "Circular Sector Centroid Radial Factor Tool",
  description:
    "Compute circular sector centroid radial factor from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "angleRadians",
        label: "Angle Radians",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [{ id: "factor", label: "Factor", valueType: { type: "number" } }],
  },
});
export const run = circularSectorCentroidRadialFactorTool.execute;
export default circularSectorCentroidRadialFactorTool;
