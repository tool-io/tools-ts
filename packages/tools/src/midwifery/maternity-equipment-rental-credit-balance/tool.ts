import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rentalDays: number;
  readonly dailyPrice: number;
  readonly deposit: number;
  readonly returnedDeposit: number;
  readonly damageCharge: number;
  readonly paid: number;
};
export type Output = {
  readonly rentalCharge: number;
  readonly retainedDeposit: number;
  readonly balance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rentalDays: { type: "integer", minimum: 0 },
    dailyPrice: { type: "number", minimum: 0 },
    deposit: { type: "number", minimum: 0 },
    returnedDeposit: { type: "number", minimum: 0 },
    damageCharge: { type: "number", minimum: 0 },
    paid: { type: "number", minimum: 0 },
  },
  required: [
    "rentalDays",
    "dailyPrice",
    "deposit",
    "returnedDeposit",
    "damageCharge",
    "paid",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rentalCharge: { type: "number" },
    retainedDeposit: { type: "number" },
    balance: { type: "number" },
  },
  required: ["rentalCharge", "retainedDeposit", "balance"],
} as const;
/** Reconcile rental charges and actual deposit returns on an explicit account ledger. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    rentalDays,
    dailyPrice,
    deposit,
    returnedDeposit,
    damageCharge,
    paid,
  } = request;
  const compute = (): Output => {
    H.integer(rentalDays, 0);
    H.domain(
      dailyPrice >= 0 &&
        deposit >= 0 &&
        returnedDeposit >= 0 &&
        returnedDeposit <= deposit &&
        damageCharge >= 0 &&
        paid >= 0,
    );
    return {
      rentalCharge: rentalDays * dailyPrice,
      retainedDeposit: deposit - returnedDeposit,
      balance:
        rentalDays * dailyPrice +
        damageCharge +
        returnedDeposit -
        deposit -
        paid,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    rentalDays: 10,
    dailyPrice: 5,
    deposit: 100,
    returnedDeposit: 80,
    damageCharge: 20,
    paid: 30,
  },
  output: { rentalCharge: 50, retainedDeposit: 20, balance: 20 },
} satisfies ToolExample<Input, Output>;
export const maternityEquipmentRentalCreditBalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "midwifery/maternity-equipment-rental-credit-balance",
      title: "Maternity Equipment Rental Credit Balance Tool",
      description:
        "Reconcile rental charges and actual deposit returns on an explicit account ledger.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          rentalDays: { type: "integer", minimum: 0 },
          dailyPrice: { type: "number", minimum: 0 },
          deposit: { type: "number", minimum: 0 },
          returnedDeposit: { type: "number", minimum: 0 },
          damageCharge: { type: "number", minimum: 0 },
          paid: { type: "number", minimum: 0 },
        },
        required: [
          "rentalDays",
          "dailyPrice",
          "deposit",
          "returnedDeposit",
          "damageCharge",
          "paid",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          rentalCharge: { type: "number" },
          retainedDeposit: { type: "number" },
          balance: { type: "number" },
        },
        required: ["rentalCharge", "retainedDeposit", "balance"],
      },
      ports: {
        inputs: [
          {
            id: "rentalDays",
            label: "Rental Days",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "dailyPrice",
            label: "Daily Price",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "deposit",
            label: "Deposit",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "returnedDeposit",
            label: "Returned Deposit",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "damageCharge",
            label: "Damage Charge",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "paid",
            label: "Paid",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "rentalCharge",
            label: "Rental Charge",
            valueType: { type: "number" },
          },
          {
            id: "retainedDeposit",
            label: "Retained Deposit",
            valueType: { type: "number" },
          },
          { id: "balance", label: "Balance", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = maternityEquipmentRentalCreditBalanceTool.execute;
export default maternityEquipmentRentalCreditBalanceTool;
