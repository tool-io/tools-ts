import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly beforeMassKg: number;
  readonly afterMassKg: number;
  readonly dispensedMassKg: number;
};
export type Output = {
  readonly netInventoryGainKg: number;
  readonly apparentLossKg: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    beforeMassKg: { type: "number", minimum: 0 },
    afterMassKg: { type: "number", minimum: 0 },
    dispensedMassKg: { type: "number", minimum: 0 },
  },
  required: ["beforeMassKg", "afterMassKg", "dispensedMassKg"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netInventoryGainKg: { type: "number" },
    apparentLossKg: { type: "number" },
  },
  required: ["netInventoryGainKg", "apparentLossKg"],
} as const;
/** Reconcile explicit before/after cryogenic inventory and dispensed mass without attributing a residual to boil-off alone. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { beforeMassKg, afterMassKg, dispensedMassKg } = request;
  const compute = (): Output => {
    H.domain(
      beforeMassKg >= 0 && afterMassKg >= 0 && dispensedMassKg >= 0,
      "beforeMassKg",
    );
    return {
      netInventoryGainKg: afterMassKg - beforeMassKg,
      apparentLossKg: dispensedMassKg - afterMassKg + beforeMassKg,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { beforeMassKg: 20, afterMassKg: 65, dispensedMassKg: 50 },
  output: { netInventoryGainKg: 45, apparentLossKg: 5 },
} satisfies ToolExample<Input, Output>;
export const cryogenicFillBeforeAfterMassBalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["cryogenics", "physics"],
        keywords: ["cryogenics", "physics"],
      },
      id: "cryogenics/cryogenic-fill-before-after-mass-balance",
      title: "Cryogenic Fill Before After Mass Balance",
      description:
        "Reconcile explicit before/after cryogenic inventory and dispensed mass without attributing a residual to boil-off alone.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          beforeMassKg: { type: "number", minimum: 0 },
          afterMassKg: { type: "number", minimum: 0 },
          dispensedMassKg: { type: "number", minimum: 0 },
        },
        required: ["beforeMassKg", "afterMassKg", "dispensedMassKg"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          netInventoryGainKg: { type: "number" },
          apparentLossKg: { type: "number" },
        },
        required: ["netInventoryGainKg", "apparentLossKg"],
      },
      ports: {
        inputs: [
          {
            id: "beforeMassKg",
            label: "Before Mass Kg",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "afterMassKg",
            label: "After Mass Kg",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "dispensedMassKg",
            label: "Dispensed Mass Kg",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "netInventoryGainKg",
            label: "Net Inventory Gain Kg",
            valueType: { type: "number" },
          },
          {
            id: "apparentLossKg",
            label: "Apparent Loss Kg",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = cryogenicFillBeforeAfterMassBalanceTool.execute;
export default cryogenicFillBeforeAfterMassBalanceTool;
