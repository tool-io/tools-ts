import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceConcentration: number;
  readonly transferVolume: number;
  readonly diluentVolume: number;
  readonly deadVolume: number;
};
export type Output = {
  readonly nextConcentration: number;
  readonly dilutionFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceConcentration: { type: "number" },
    transferVolume: { type: "number", minimum: 0 },
    diluentVolume: { type: "number", minimum: 0 },
    deadVolume: { type: "number", minimum: 0 },
  },
  required: [
    "sourceConcentration",
    "transferVolume",
    "diluentVolume",
    "deadVolume",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nextConcentration: { type: "number" },
    dilutionFraction: { type: "number" },
  },
  required: ["nextConcentration", "dilutionFraction"],
} as const;
/** Apply a one-step dilution where an explicit dead volume carries the source concentration into the next well. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceConcentration, transferVolume, diluentVolume, deadVolume } =
    request;
  const compute = (): Output => {
    H.domain(transferVolume >= 0 && diluentVolume >= 0 && deadVolume >= 0);
    H.positive(transferVolume + deadVolume + diluentVolume);
    return {
      nextConcentration:
        (sourceConcentration * (transferVolume + deadVolume)) /
        (transferVolume + deadVolume + diluentVolume),
      dilutionFraction:
        (transferVolume + deadVolume) /
        (transferVolume + deadVolume + diluentVolume),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourceConcentration: 10,
    transferVolume: 20,
    diluentVolume: 80,
    deadVolume: 0,
  },
  output: { nextConcentration: 2, dilutionFraction: 0.2 },
} satisfies ToolExample<Input, Output>;
export const microplateDilutionTransferCarryoverTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biotechnology/microplate-dilution-transfer-carryover-term",
      title: "Microplate Dilution Transfer Carryover Term Tool",
      description:
        "Apply a one-step dilution where an explicit dead volume carries the source concentration into the next well.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sourceConcentration: { type: "number" },
          transferVolume: { type: "number", minimum: 0 },
          diluentVolume: { type: "number", minimum: 0 },
          deadVolume: { type: "number", minimum: 0 },
        },
        required: [
          "sourceConcentration",
          "transferVolume",
          "diluentVolume",
          "deadVolume",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          nextConcentration: { type: "number" },
          dilutionFraction: { type: "number" },
        },
        required: ["nextConcentration", "dilutionFraction"],
      },
      ports: {
        inputs: [
          {
            id: "sourceConcentration",
            label: "Source Concentration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "transferVolume",
            label: "Transfer Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "diluentVolume",
            label: "Diluent Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "deadVolume",
            label: "Dead Volume",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "nextConcentration",
            label: "Next Concentration",
            valueType: { type: "number" },
          },
          {
            id: "dilutionFraction",
            label: "Dilution Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = microplateDilutionTransferCarryoverTermTool.execute;
export default microplateDilutionTransferCarryoverTermTool;
