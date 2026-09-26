import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingVolume: number;
  readonly accruedVolume: number;
  readonly exercisedVolume: number;
  readonly expiredVolume: number;
};
export type Output = { readonly closingVolume: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingVolume: { type: "number", minimum: 0 },
    accruedVolume: { type: "number", minimum: 0 },
    exercisedVolume: { type: "number", minimum: 0 },
    expiredVolume: { type: "number", minimum: 0 },
  },
  required: [
    "openingVolume",
    "accruedVolume",
    "exercisedVolume",
    "expiredVolume",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { closingVolume: { type: "number" } },
  required: ["closingVolume"],
} as const;
/** Make-up gas entitlement balance from explicit accrued, exercised and expired volumes in a common unit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingVolume, accruedVolume, exercisedVolume, expiredVolume } =
    request;
  const compute = (): Output => {
    H.domain(
      openingVolume >= 0 &&
        accruedVolume >= 0 &&
        exercisedVolume >= 0 &&
        expiredVolume >= 0 &&
        exercisedVolume + expiredVolume <= openingVolume + accruedVolume,
    );
    return {
      closingVolume:
        openingVolume + accruedVolume - exercisedVolume - expiredVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    openingVolume: 100,
    accruedVolume: 20,
    exercisedVolume: 40,
    expiredVolume: 10,
  },
  output: { closingVolume: 70 },
} satisfies ToolExample<Input, Output>;
export const energyContractMakeupGasCreditBalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "energy-economics/energy-contract-makeup-gas-credit-balance",
      title: "Energy Contract Makeup Gas Credit Balance Tool",
      description:
        "Make-up gas entitlement balance from explicit accrued, exercised and expired volumes in a common unit.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          openingVolume: { type: "number", minimum: 0 },
          accruedVolume: { type: "number", minimum: 0 },
          exercisedVolume: { type: "number", minimum: 0 },
          expiredVolume: { type: "number", minimum: 0 },
        },
        required: [
          "openingVolume",
          "accruedVolume",
          "exercisedVolume",
          "expiredVolume",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { closingVolume: { type: "number" } },
        required: ["closingVolume"],
      },
      ports: {
        inputs: [
          {
            id: "openingVolume",
            label: "Opening Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "accruedVolume",
            label: "Accrued Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "exercisedVolume",
            label: "Exercised Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "expiredVolume",
            label: "Expired Volume",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "closingVolume",
            label: "Closing Volume",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = energyContractMakeupGasCreditBalanceTool.execute;
export default energyContractMakeupGasCreditBalanceTool;
