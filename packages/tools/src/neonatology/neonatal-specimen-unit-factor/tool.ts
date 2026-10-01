import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly quantity: number; readonly unitFactor: number };
export type Output = { readonly converted: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quantity: { type: "number", minimum: 0 },
    unitFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["quantity", "unitFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { converted: { type: "number" } },
  required: ["converted"],
} as const;
/** Apply an explicit compatible research specimen unit factor without clinical ranges. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { quantity, unitFactor } = request;
  const compute = (): Output => {
    H.domain(quantity >= 0);
    H.positive(unitFactor);
    return { converted: quantity * unitFactor };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { quantity: 120, unitFactor: 0.001 },
  output: { converted: 0.12 },
} satisfies ToolExample<Input, Output>;
export const neonatalSpecimenUnitFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "neonatology/neonatal-specimen-unit-factor",
    title: "Neonatal Specimen Unit Factor Tool",
    description:
      "Apply an explicit compatible research specimen unit factor without clinical ranges.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quantity: { type: "number", minimum: 0 },
        unitFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["quantity", "unitFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { converted: { type: "number" } },
      required: ["converted"],
    },
    ports: {
      inputs: [
        {
          id: "quantity",
          label: "Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unitFactor",
          label: "Unit Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "converted", label: "Converted", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = neonatalSpecimenUnitFactorTool.execute;
export default neonatalSpecimenUnitFactorTool;
