import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly chargeNumber: number;
  readonly suppliedFaradayConstant: number;
  readonly voltageDifference: number;
};
export type Output = { readonly electricalMolarEnergy: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    chargeNumber: { type: "integer" },
    suppliedFaradayConstant: { type: "number", exclusiveMinimum: 0 },
    voltageDifference: { type: "number" },
  },
  required: ["chargeNumber", "suppliedFaradayConstant", "voltageDifference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { electricalMolarEnergy: { type: "number" } },
  required: ["electricalMolarEnergy"],
} as const;
/** Calculate the signed electrical zF delta-V contribution to molar electrochemical potential from explicit quantities, excluding the chemical term. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { chargeNumber, suppliedFaradayConstant, voltageDifference } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(chargeNumber) &&
        chargeNumber >= -Number.MAX_SAFE_INTEGER &&
        chargeNumber <= Number.MAX_SAFE_INTEGER,
      "chargeNumber",
    ),
      chargeNumber);
    (H.domain(
      Number.isFinite(suppliedFaradayConstant) && suppliedFaradayConstant > 0,
      "suppliedFaradayConstant",
    ),
      suppliedFaradayConstant);
    return {
      electricalMolarEnergy:
        chargeNumber * suppliedFaradayConstant * voltageDifference,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    chargeNumber: 1,
    suppliedFaradayConstant: 96000,
    voltageDifference: 0.05,
  },
  output: { electricalMolarEnergy: 4800 },
} satisfies ToolExample<Input, Output>;
export const membraneElectrochemicalPotentialTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["biophysics", "physics"],
        keywords: ["biophysics", "physics"],
      },
      id: "biophysics/membrane-electrochemical-potential-term",
      title: "Membrane Electrochemical Potential Term",
      description:
        "Calculate the signed electrical zF delta-V contribution to molar electrochemical potential from explicit quantities, excluding the chemical term.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          chargeNumber: { type: "integer" },
          suppliedFaradayConstant: { type: "number", exclusiveMinimum: 0 },
          voltageDifference: { type: "number" },
        },
        required: [
          "chargeNumber",
          "suppliedFaradayConstant",
          "voltageDifference",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { electricalMolarEnergy: { type: "number" } },
        required: ["electricalMolarEnergy"],
      },
      ports: {
        inputs: [
          {
            id: "chargeNumber",
            label: "Charge Number",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "suppliedFaradayConstant",
            label: "Supplied Faraday Constant",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "voltageDifference",
            label: "Voltage Difference",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "electricalMolarEnergy",
            label: "Electrical Molar Energy",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = membraneElectrochemicalPotentialTermTool.execute;
export default membraneElectrochemicalPotentialTermTool;
