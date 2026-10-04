import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly transferredVolume: number;
  readonly finalVolume: number;
};
export type Output = {
  readonly dilutionFactor: number;
  readonly transferredFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    transferredVolume: { type: "number", exclusiveMinimum: 0 },
    finalVolume: { type: "number" },
  },
  required: ["transferredVolume", "finalVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dilutionFactor: { type: "number" },
    transferredFraction: { type: "number" },
  },
  required: ["dilutionFactor", "transferredFraction"],
} as const;
/** Describe an analytical dilution transfer with common volume units and a final volume including the transfer. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { transferredVolume, finalVolume } = request;
  const compute = (): Output => {
    (H.domain(transferredVolume > 0, "transferredVolume"), transferredVolume);
    H.domain(finalVolume >= transferredVolume, "finalVolume");
    return {
      dilutionFactor: finalVolume / transferredVolume,
      transferredFraction: transferredVolume / finalVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { transferredVolume: 2, finalVolume: 10 },
  output: { dilutionFactor: 5, transferredFraction: 0.2 },
} satisfies ToolExample<Input, Output>;
export const assayDilutionTransferFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biotechnology/assay-dilution-transfer-factor",
    title: "Assay Dilution Transfer Factor Tool",
    description:
      "Describe an analytical dilution transfer with common volume units and a final volume including the transfer.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        transferredVolume: { type: "number", exclusiveMinimum: 0 },
        finalVolume: { type: "number" },
      },
      required: ["transferredVolume", "finalVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dilutionFactor: { type: "number" },
        transferredFraction: { type: "number" },
      },
      required: ["dilutionFactor", "transferredFraction"],
    },
    ports: {
      inputs: [
        {
          id: "transferredVolume",
          label: "Transferred Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "finalVolume",
          label: "Final Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "dilutionFactor",
          label: "Dilution Factor",
          valueType: { type: "number" },
        },
        {
          id: "transferredFraction",
          label: "Transferred Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = assayDilutionTransferFactorTool.execute;
export default assayDilutionTransferFactorTool;
