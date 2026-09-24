import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly molesPerArea: number;
  readonly molarMass: number;
};
export type Output = { readonly massPerArea: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    molesPerArea: { type: "number" },
    molarMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["molesPerArea", "molarMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { massPerArea: { type: "number" } },
  required: ["massPerArea"],
} as const;
/** Convert signed molar surface excess into mass surface excess using kilograms per mole. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { molesPerArea, molarMass } = request;
  const compute = (): Output => {
    H.positive(molarMass);
    return { massPerArea: molesPerArea * molarMass };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { molesPerArea: 0.002, molarMass: 0.05 },
  output: { massPerArea: 0.0001 },
} satisfies ToolExample<Input, Output>;
export const surfaceExcessMolarArealMassFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "convert/surface-excess-molar-areal-mass-factor",
    title: "Surface Excess Molar Areal Mass Factor Tool",
    description:
      "Convert signed molar surface excess into mass surface excess using kilograms per mole.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        molesPerArea: { type: "number" },
        molarMass: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["molesPerArea", "molarMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { massPerArea: { type: "number" } },
      required: ["massPerArea"],
    },
    ports: {
      inputs: [
        {
          id: "molesPerArea",
          label: "Moles Per Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "molarMass",
          label: "Molar Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "massPerArea",
          label: "Mass Per Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = surfaceExcessMolarArealMassFactorTool.execute;
export default surfaceExcessMolarArealMassFactorTool;
