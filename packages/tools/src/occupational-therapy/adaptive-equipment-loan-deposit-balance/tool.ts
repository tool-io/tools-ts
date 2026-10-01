import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly deposit: number;
  readonly retainedDamage: number;
  readonly retainedCleaning: number;
  readonly returned: number;
  readonly outstandingRental: number;
};
export type Output = {
  readonly refundable: number;
  readonly refundDue: number;
  readonly accountBalance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deposit: { type: "number", minimum: 0 },
    retainedDamage: { type: "number", minimum: 0 },
    retainedCleaning: { type: "number", minimum: 0 },
    returned: { type: "number", minimum: 0 },
    outstandingRental: { type: "number", minimum: 0 },
  },
  required: [
    "deposit",
    "retainedDamage",
    "retainedCleaning",
    "returned",
    "outstandingRental",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    refundable: { type: "number" },
    refundDue: { type: "number" },
    accountBalance: { type: "number" },
  },
  required: ["refundable", "refundDue", "accountBalance"],
} as const;
/** Calculate adaptive equipment loan deposit balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    deposit,
    retainedDamage,
    retainedCleaning,
    returned,
    outstandingRental,
  } = request;
  const compute = (): Output => {
    H.domain(
      deposit >= 0 &&
        retainedDamage >= 0 &&
        retainedCleaning >= 0 &&
        retainedDamage + retainedCleaning <= deposit &&
        returned >= 0 &&
        outstandingRental >= 0,
    );
    return {
      refundable: deposit - retainedDamage - retainedCleaning,
      refundDue: deposit - retainedDamage - retainedCleaning - returned,
      accountBalance:
        outstandingRental +
        retainedDamage +
        retainedCleaning +
        returned -
        deposit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    deposit: 100,
    retainedDamage: 10,
    retainedCleaning: 5,
    returned: 50,
    outstandingRental: 20,
  },
  output: { refundable: 85, refundDue: 35, accountBalance: -15 },
} satisfies ToolExample<Input, Output>;
export const adaptiveEquipmentLoanDepositBalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "occupational-therapy/adaptive-equipment-loan-deposit-balance",
      title: "Adaptive Equipment Loan Deposit Balance Tool",
      description:
        "Calculate adaptive equipment loan deposit balance from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          deposit: { type: "number", minimum: 0 },
          retainedDamage: { type: "number", minimum: 0 },
          retainedCleaning: { type: "number", minimum: 0 },
          returned: { type: "number", minimum: 0 },
          outstandingRental: { type: "number", minimum: 0 },
        },
        required: [
          "deposit",
          "retainedDamage",
          "retainedCleaning",
          "returned",
          "outstandingRental",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          refundable: { type: "number" },
          refundDue: { type: "number" },
          accountBalance: { type: "number" },
        },
        required: ["refundable", "refundDue", "accountBalance"],
      },
      ports: {
        inputs: [
          {
            id: "deposit",
            label: "Deposit",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "retainedDamage",
            label: "Retained Damage",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "retainedCleaning",
            label: "Retained Cleaning",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "returned",
            label: "Returned",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "outstandingRental",
            label: "Outstanding Rental",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "refundable",
            label: "Refundable",
            valueType: { type: "number" },
          },
          {
            id: "refundDue",
            label: "Refund Due",
            valueType: { type: "number" },
          },
          {
            id: "accountBalance",
            label: "Account Balance",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = adaptiveEquipmentLoanDepositBalanceTool.execute;
export default adaptiveEquipmentLoanDepositBalanceTool;
