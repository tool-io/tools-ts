import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly condensate: number;
  readonly drainReturn: number;
  readonly withdrawn: number;
  readonly evaporation: number;
};
export type Output = {
  readonly recovered: number;
  readonly recoveredShare: number;
  readonly netWithdrawal: number;
  readonly evaporativeLossShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    condensate: { type: "number", minimum: 0 },
    drainReturn: { type: "number", minimum: 0 },
    withdrawn: { type: "number", exclusiveMinimum: 0 },
    evaporation: { type: "number", minimum: 0 },
  },
  required: ["condensate", "drainReturn", "withdrawn", "evaporation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recovered: { type: "number" },
    recoveredShare: { type: "number" },
    netWithdrawal: { type: "number" },
    evaporativeLossShare: { type: "number" },
  },
  required: [
    "recovered",
    "recoveredShare",
    "netWithdrawal",
    "evaporativeLossShare",
  ],
} as const;
/** Subtract separately collected condensate and drain returns once from gross withdrawals; report evaporation as a separate share, without adding it again to net withdrawal. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { condensate, drainReturn, withdrawn, evaporation } = request;
  const compute = (): Output => {
    H.positive(withdrawn);
    H.domain(condensate >= 0 && drainReturn >= 0 && evaporation >= 0);
    return {
      recovered: condensate + drainReturn,
      recoveredShare: (condensate + drainReturn) / withdrawn,
      netWithdrawal: withdrawn - condensate - drainReturn,
      evaporativeLossShare: evaporation / withdrawn,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { condensate: 20, drainReturn: 30, withdrawn: 100, evaporation: 5 },
  output: {
    recovered: 50,
    recoveredShare: 0.5,
    netWithdrawal: 50,
    evaporativeLossShare: 0.05,
  },
} satisfies ToolExample<Input, Output>;
export const verticalFarmWaterRecoveryCondensateShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "vertical-farming/vertical-farm-water-recovery-condensate-share",
      title: "Vertical Farm Water Recovery Condensate Share Tool",
      description:
        "Subtract separately collected condensate and drain returns once from gross withdrawals; report evaporation as a separate share, without adding it again to net withdrawal.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          condensate: { type: "number", minimum: 0 },
          drainReturn: { type: "number", minimum: 0 },
          withdrawn: { type: "number", exclusiveMinimum: 0 },
          evaporation: { type: "number", minimum: 0 },
        },
        required: ["condensate", "drainReturn", "withdrawn", "evaporation"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recovered: { type: "number" },
          recoveredShare: { type: "number" },
          netWithdrawal: { type: "number" },
          evaporativeLossShare: { type: "number" },
        },
        required: [
          "recovered",
          "recoveredShare",
          "netWithdrawal",
          "evaporativeLossShare",
        ],
      },
      ports: {
        inputs: [
          {
            id: "condensate",
            label: "Condensate",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "drainReturn",
            label: "Drain Return",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "withdrawn",
            label: "Withdrawn",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "evaporation",
            label: "Evaporation",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "recovered",
            label: "Recovered",
            valueType: { type: "number" },
          },
          {
            id: "recoveredShare",
            label: "Recovered Share",
            valueType: { type: "number", unit: "1" },
          },
          {
            id: "netWithdrawal",
            label: "Net Withdrawal",
            valueType: { type: "number" },
          },
          {
            id: "evaporativeLossShare",
            label: "Evaporative Loss Share",
            valueType: { type: "number", unit: "1" },
          },
        ],
      },
    },
    calculate,
  });
export const run = verticalFarmWaterRecoveryCondensateShareTool.execute;
export default verticalFarmWaterRecoveryCondensateShareTool;
