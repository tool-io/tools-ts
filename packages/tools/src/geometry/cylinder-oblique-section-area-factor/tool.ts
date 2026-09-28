import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly radius: number;
  readonly normalAxisCosine: number;
};
export type Output = { readonly area: number; readonly factor: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radius: { type: "number" },
    normalAxisCosine: { type: "number" },
  },
  required: ["radius", "normalAxisCosine"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { area: { type: "number" }, factor: { type: "number" } },
  required: ["area", "factor"],
} as const;
/** Compute cylinder oblique section area factor from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { radius, normalAxisCosine } = input;
  const compute = (): Output => {
    domain(radius >= 0);
    domain(normalAxisCosine > 0 && normalAxisCosine <= 1);
    return {
      area: (Math.PI * radius * radius) / normalAxisCosine,
      factor: 1 / normalAxisCosine,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { radius: 1, normalAxisCosine: 0.5 },
  output: { area: 6.283185307179586, factor: 2 },
} satisfies ToolExample<Input, Output>;
export const cylinderObliqueSectionAreaFactorTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "geometry/cylinder-oblique-section-area-factor",
  title: "Cylinder Oblique Section Area Factor Tool",
  description:
    "Compute cylinder oblique section area factor from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "radius",
        label: "Radius",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "normalAxisCosine",
        label: "Normal Axis Cosine",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      { id: "area", label: "Area", valueType: { type: "number" } },
      { id: "factor", label: "Factor", valueType: { type: "number" } },
    ],
  },
});
export const run = cylinderObliqueSectionAreaFactorTool.execute;
export default cylinderObliqueSectionAreaFactorTool;
