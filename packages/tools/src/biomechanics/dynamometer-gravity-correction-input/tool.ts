import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredTorque: number;
  readonly suppliedGravityTorque: number;
};
export type Output = { readonly correctedTorque: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredTorque: { type: "number" },
    suppliedGravityTorque: { type: "number" },
  },
  required: ["measuredTorque", "suppliedGravityTorque"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { correctedTorque: { type: "number" } },
  required: ["correctedTorque"],
} as const;
/** Subtract a supplied signed gravity-torque contribution from a measured dynamometer torque without estimating body-segment properties. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredTorque, suppliedGravityTorque } = request;
  const compute = (): Output => {
    return { correctedTorque: measuredTorque - suppliedGravityTorque };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredTorque: 80, suppliedGravityTorque: 12 },
  output: { correctedTorque: 68 },
} satisfies ToolExample<Input, Output>;
export const dynamometerGravityCorrectionInputTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biomechanics", "engineering"],
      keywords: ["biomechanics", "engineering"],
    },
    id: "biomechanics/dynamometer-gravity-correction-input",
    title: "Dynamometer Gravity Correction Input",
    description:
      "Subtract a supplied signed gravity-torque contribution from a measured dynamometer torque without estimating body-segment properties.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredTorque: { type: "number" },
        suppliedGravityTorque: { type: "number" },
      },
      required: ["measuredTorque", "suppliedGravityTorque"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { correctedTorque: { type: "number" } },
      required: ["correctedTorque"],
    },
    ports: {
      inputs: [
        {
          id: "measuredTorque",
          label: "Measured Torque",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedGravityTorque",
          label: "Supplied Gravity Torque",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "correctedTorque",
          label: "Corrected Torque",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = dynamometerGravityCorrectionInputTool.execute;
export default dynamometerGravityCorrectionInputTool;
