import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalMass: number;
  readonly originalCenter: number;
  readonly partMass: number;
  readonly displacement: number;
};
export type Output = { readonly newCenter: number; readonly shift: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalMass: { type: "number", exclusiveMinimum: 0 },
    originalCenter: { type: "number" },
    partMass: { type: "number", minimum: 0 },
    displacement: { type: "number" },
  },
  required: ["totalMass", "originalCenter", "partMass", "displacement"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { newCenter: { type: "number" }, shift: { type: "number" } },
  required: ["newCenter", "shift"],
} as const;
/** Calculate product center mass shift one part from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalMass, originalCenter, partMass, displacement } = request;
  const compute = (): Output => {
    H.positive(totalMass);
    H.domain(partMass >= 0 && partMass <= totalMass);
    return {
      newCenter: originalCenter + (partMass * displacement) / totalMass,
      shift: (partMass * displacement) / totalMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalMass: 10, originalCenter: 2, partMass: 2, displacement: 3 },
  output: { newCenter: 2.6, shift: 0.6 },
} satisfies ToolExample<Input, Output>;
export const productCenterMassShiftOnePartTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-design/product-center-mass-shift-one-part",
    title: "Product Center Mass Shift One Part Tool",
    description:
      "Calculate product center mass shift one part from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalMass: { type: "number", exclusiveMinimum: 0 },
        originalCenter: { type: "number" },
        partMass: { type: "number", minimum: 0 },
        displacement: { type: "number" },
      },
      required: ["totalMass", "originalCenter", "partMass", "displacement"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { newCenter: { type: "number" }, shift: { type: "number" } },
      required: ["newCenter", "shift"],
    },
    ports: {
      inputs: [
        {
          id: "totalMass",
          label: "Total Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "originalCenter",
          label: "Original Center",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "partMass",
          label: "Part Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "displacement",
          label: "Displacement",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "newCenter", label: "New Center", valueType: { type: "number" } },
        { id: "shift", label: "Shift", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = productCenterMassShiftOnePartTool.execute;
export default productCenterMassShiftOnePartTool;
