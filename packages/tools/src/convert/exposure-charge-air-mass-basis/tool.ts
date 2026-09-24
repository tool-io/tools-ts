import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly charge: number; readonly airMass: number };
export type Output = { readonly exposure: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    charge: { type: "number", minimum: 0 },
    airMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["charge", "airMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { exposure: { type: "number" } },
  required: ["exposure"],
} as const;
/** Return ionization exposure in coulombs per kilogram from explicitly measured charge and air mass. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { charge, airMass } = request;
  const compute = (): Output => {
    H.domain(charge >= 0);
    H.positive(airMass);
    return { exposure: charge / airMass };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { charge: 0.0002, airMass: 2 },
  output: { exposure: 0.0001 },
} satisfies ToolExample<Input, Output>;
export const exposureChargeAirMassBasisTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "convert/exposure-charge-air-mass-basis",
    title: "Exposure Charge Air Mass Basis Tool",
    description:
      "Return ionization exposure in coulombs per kilogram from explicitly measured charge and air mass.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        charge: { type: "number", minimum: 0 },
        airMass: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["charge", "airMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { exposure: { type: "number" } },
      required: ["exposure"],
    },
    ports: {
      inputs: [
        {
          id: "charge",
          label: "Charge",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "airMass",
          label: "Air Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "exposure", label: "Exposure", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = exposureChargeAirMassBasisTool.execute;
export default exposureChargeAirMassBasisTool;
