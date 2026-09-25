import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly area: number; readonly length: number };
export type Output = { readonly geometryFactor: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    area: { type: "number", minimum: 0 },
    length: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["area", "length"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { geometryFactor: { type: "number" } },
  required: ["geometryFactor"],
} as const;
/** Calculate thermal strap area length ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { area, length } = request;
  const compute = (): Output => {
    H.domain(area >= 0);
    H.positive(length);
    return { geometryFactor: area / length };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { area: 4, length: 2 },
  output: { geometryFactor: 2 },
} satisfies ToolExample<Input, Output>;
export const thermalStrapAreaLengthRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cryogenics/thermal-strap-area-length-ratio",
    title: "Thermal Strap Area Length Ratio Tool",
    description:
      "Calculate thermal strap area length ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        area: { type: "number", minimum: 0 },
        length: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["area", "length"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { geometryFactor: { type: "number" } },
      required: ["geometryFactor"],
    },
    ports: {
      inputs: [
        {
          id: "area",
          label: "Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "geometryFactor",
          label: "Geometry Factor",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = thermalStrapAreaLengthRatioTool.execute;
export default thermalStrapAreaLengthRatioTool;
