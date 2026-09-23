import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingMass: number;
  readonly recoveredMass: number;
  readonly sampleWithdrawn: number;
};
export type Output = {
  readonly unaccountedLoss: number;
  readonly recoveryExcludingSample: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingMass: { type: "number" },
    recoveredMass: { type: "number", minimum: 0 },
    sampleWithdrawn: { type: "number", minimum: 0 },
  },
  required: ["openingMass", "recoveredMass", "sampleWithdrawn"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unaccountedLoss: { type: "number" },
    recoveryExcludingSample: { type: "number" },
  },
  required: ["unaccountedLoss", "recoveryExcludingSample"],
} as const;
/** Calculate purification loss sample withdrawal term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingMass, recoveredMass, sampleWithdrawn } = request;
  const compute = (): Output => {
    H.domain(
      openingMass > sampleWithdrawn &&
        sampleWithdrawn >= 0 &&
        recoveredMass >= 0,
    );
    return {
      unaccountedLoss: openingMass - recoveredMass - sampleWithdrawn,
      recoveryExcludingSample: recoveredMass / (openingMass - sampleWithdrawn),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { openingMass: 100, recoveredMass: 70, sampleWithdrawn: 10 },
  output: { unaccountedLoss: 20, recoveryExcludingSample: 0.7777777777777778 },
} satisfies ToolExample<Input, Output>;
export const purificationLossSampleWithdrawalTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biotechnology/purification-loss-sample-withdrawal-term",
      title: "Purification Loss Sample Withdrawal Term Tool",
      description:
        "Calculate purification loss sample withdrawal term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          openingMass: { type: "number" },
          recoveredMass: { type: "number", minimum: 0 },
          sampleWithdrawn: { type: "number", minimum: 0 },
        },
        required: ["openingMass", "recoveredMass", "sampleWithdrawn"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          unaccountedLoss: { type: "number" },
          recoveryExcludingSample: { type: "number" },
        },
        required: ["unaccountedLoss", "recoveryExcludingSample"],
      },
      ports: {
        inputs: [
          {
            id: "openingMass",
            label: "Opening Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "recoveredMass",
            label: "Recovered Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "sampleWithdrawn",
            label: "Sample Withdrawn",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "unaccountedLoss",
            label: "Unaccounted Loss",
            valueType: { type: "number" },
          },
          {
            id: "recoveryExcludingSample",
            label: "Recovery Excluding Sample",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = purificationLossSampleWithdrawalTermTool.execute;
export default purificationLossSampleWithdrawalTermTool;
