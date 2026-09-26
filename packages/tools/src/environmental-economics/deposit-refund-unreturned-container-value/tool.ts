import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sold: number;
  readonly returned: number;
  readonly depositPerContainer: number;
  readonly handlingCostPerReturn: number;
};
export type Output = {
  readonly unreturned: number;
  readonly retainedDeposits: number;
  readonly handlingCost: number;
  readonly netBalance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sold: { type: "integer", minimum: 0 },
    returned: { type: "integer", minimum: 0 },
    depositPerContainer: { type: "number", minimum: 0 },
    handlingCostPerReturn: { type: "number", minimum: 0 },
  },
  required: [
    "sold",
    "returned",
    "depositPerContainer",
    "handlingCostPerReturn",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unreturned: { type: "integer" },
    retainedDeposits: { type: "number" },
    handlingCost: { type: "number" },
    netBalance: { type: "number" },
  },
  required: ["unreturned", "retainedDeposits", "handlingCost", "netBalance"],
} as const;
/** Calculate deposit refund unreturned container value from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sold, returned, depositPerContainer, handlingCostPerReturn } =
    request;
  const compute = (): Output => {
    H.integer(sold, 0);
    H.integer(returned, 0, sold);
    H.domain(depositPerContainer >= 0 && handlingCostPerReturn >= 0);
    return {
      unreturned: sold - returned,
      retainedDeposits: (sold - returned) * depositPerContainer,
      handlingCost: returned * handlingCostPerReturn,
      netBalance:
        (sold - returned) * depositPerContainer -
        returned * handlingCostPerReturn,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sold: 1000,
    returned: 800,
    depositPerContainer: 0.1,
    handlingCostPerReturn: 0.02,
  },
  output: {
    unreturned: 200,
    retainedDeposits: 20,
    handlingCost: 16,
    netBalance: 4,
  },
} satisfies ToolExample<Input, Output>;
export const depositRefundUnreturnedContainerValueTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "environmental-economics/deposit-refund-unreturned-container-value",
      title: "Deposit Refund Unreturned Container Value Tool",
      description:
        "Calculate deposit refund unreturned container value from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sold: { type: "integer", minimum: 0 },
          returned: { type: "integer", minimum: 0 },
          depositPerContainer: { type: "number", minimum: 0 },
          handlingCostPerReturn: { type: "number", minimum: 0 },
        },
        required: [
          "sold",
          "returned",
          "depositPerContainer",
          "handlingCostPerReturn",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          unreturned: { type: "integer" },
          retainedDeposits: { type: "number" },
          handlingCost: { type: "number" },
          netBalance: { type: "number" },
        },
        required: [
          "unreturned",
          "retainedDeposits",
          "handlingCost",
          "netBalance",
        ],
      },
      ports: {
        inputs: [
          {
            id: "sold",
            label: "Sold",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "returned",
            label: "Returned",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "depositPerContainer",
            label: "Deposit Per Container",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "handlingCostPerReturn",
            label: "Handling Cost Per Return",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "unreturned",
            label: "Unreturned",
            valueType: { type: "integer" },
          },
          {
            id: "retainedDeposits",
            label: "Retained Deposits",
            valueType: { type: "number" },
          },
          {
            id: "handlingCost",
            label: "Handling Cost",
            valueType: { type: "number" },
          },
          {
            id: "netBalance",
            label: "Net Balance",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = depositRefundUnreturnedContainerValueTool.execute;
export default depositRefundUnreturnedContainerValueTool;
