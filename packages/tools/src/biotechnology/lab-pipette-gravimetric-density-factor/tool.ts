import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossMass: number;
  readonly tareMass: number;
  readonly liquidDensity: number;
};
export type Output = { readonly volume: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossMass: { type: "number" },
    tareMass: { type: "number" },
    liquidDensity: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["grossMass", "tareMass", "liquidDensity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { volume: { type: "number" } },
  required: ["volume"],
} as const;
/** Convert net delivered liquid mass to volume using a caller-supplied matching-temperature density. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossMass, tareMass, liquidDensity } = request;
  const compute = (): Output => {
    H.domain(grossMass >= tareMass);
    H.positive(liquidDensity);
    return { volume: (grossMass - tareMass) / liquidDensity };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { grossMass: 12, tareMass: 10, liquidDensity: 1 },
  output: { volume: 2 },
} satisfies ToolExample<Input, Output>;
export const labPipetteGravimetricDensityFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biotechnology/lab-pipette-gravimetric-density-factor",
    title: "Lab Pipette Gravimetric Density Factor Tool",
    description:
      "Convert net delivered liquid mass to volume using a caller-supplied matching-temperature density.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossMass: { type: "number" },
        tareMass: { type: "number" },
        liquidDensity: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["grossMass", "tareMass", "liquidDensity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { volume: { type: "number" } },
      required: ["volume"],
    },
    ports: {
      inputs: [
        {
          id: "grossMass",
          label: "Gross Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tareMass",
          label: "Tare Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "liquidDensity",
          label: "Liquid Density",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "volume", label: "Volume", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = labPipetteGravimetricDensityFactorTool.execute;
export default labPipetteGravimetricDensityFactorTool;
