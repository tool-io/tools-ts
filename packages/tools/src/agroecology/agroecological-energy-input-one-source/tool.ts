import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly quantity: number;
  readonly energyPerUnit: number;
  readonly fieldArea: number;
};
export type Output = {
  readonly totalEnergy: number;
  readonly energyPerArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quantity: { type: "number", minimum: 0 },
    energyPerUnit: { type: "number", minimum: 0 },
    fieldArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["quantity", "energyPerUnit", "fieldArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalEnergy: { type: "number" },
    energyPerArea: { type: "number" },
  },
  required: ["totalEnergy", "energyPerArea"],
} as const;
/** Calculate agroecological energy input one source from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { quantity, energyPerUnit, fieldArea } = request;
  const compute = (): Output => {
    H.domain(quantity >= 0 && energyPerUnit >= 0);
    H.positive(fieldArea);
    return {
      totalEnergy: quantity * energyPerUnit,
      energyPerArea: (quantity * energyPerUnit) / fieldArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { quantity: 50, energyPerUnit: 4, fieldArea: 10 },
  output: { totalEnergy: 200, energyPerArea: 20 },
} satisfies ToolExample<Input, Output>;
export const agroecologicalEnergyInputOneSourceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroecology/agroecological-energy-input-one-source",
    title: "Agroecological Energy Input One Source Tool",
    description:
      "Calculate agroecological energy input one source from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quantity: { type: "number", minimum: 0 },
        energyPerUnit: { type: "number", minimum: 0 },
        fieldArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["quantity", "energyPerUnit", "fieldArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalEnergy: { type: "number" },
        energyPerArea: { type: "number" },
      },
      required: ["totalEnergy", "energyPerArea"],
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
          id: "energyPerUnit",
          label: "Energy Per Unit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fieldArea",
          label: "Field Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "totalEnergy",
          label: "Total Energy",
          valueType: { type: "number" },
        },
        {
          id: "energyPerArea",
          label: "Energy Per Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = agroecologicalEnergyInputOneSourceTool.execute;
export default agroecologicalEnergyInputOneSourceTool;
