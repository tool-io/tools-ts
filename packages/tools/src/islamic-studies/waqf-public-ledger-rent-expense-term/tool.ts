import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rentDue: number;
  readonly rentCollected: number;
  readonly maintenance: number;
  readonly administration: number;
  readonly reservedFraction: number;
};
export type Output = {
  readonly arrears: number;
  readonly operatingSurplus: number;
  readonly reserved: number;
  readonly distributable: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rentDue: { type: "number", minimum: 0 },
    rentCollected: { type: "number", minimum: 0 },
    maintenance: { type: "number", minimum: 0 },
    administration: { type: "number", minimum: 0 },
    reservedFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "rentDue",
    "rentCollected",
    "maintenance",
    "administration",
    "reservedFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    arrears: { type: "number" },
    operatingSurplus: { type: "number" },
    reserved: { type: "number" },
    distributable: { type: "number" },
  },
  required: ["arrears", "operatingSurplus", "reserved", "distributable"],
} as const;
/** Explicit public-endowment cash ledger with a supplied reserve allocation; no waqf deed or distribution law is interpreted. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    rentDue,
    rentCollected,
    maintenance,
    administration,
    reservedFraction,
  } = request;
  const compute = (): Output => {
    H.domain(
      rentDue >= 0 &&
        rentCollected >= 0 &&
        maintenance >= 0 &&
        administration >= 0,
    );
    H.probability(reservedFraction);
    return {
      arrears: rentDue - rentCollected,
      operatingSurplus: rentCollected - maintenance - administration,
      reserved:
        (rentCollected - maintenance - administration) * reservedFraction,
      distributable:
        (rentCollected - maintenance - administration) * (1 - reservedFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    rentDue: 10000,
    rentCollected: 9000,
    maintenance: 2000,
    administration: 1000,
    reservedFraction: 0.2,
  },
  output: {
    arrears: 1000,
    operatingSurplus: 6000,
    reserved: 1200,
    distributable: 4800,
  },
} satisfies ToolExample<Input, Output>;
export const waqfPublicLedgerRentExpenseTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "islamic-studies/waqf-public-ledger-rent-expense-term",
    title: "Waqf Public Ledger Rent Expense Term Tool",
    description:
      "Explicit public-endowment cash ledger with a supplied reserve allocation; no waqf deed or distribution law is interpreted.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rentDue: { type: "number", minimum: 0 },
        rentCollected: { type: "number", minimum: 0 },
        maintenance: { type: "number", minimum: 0 },
        administration: { type: "number", minimum: 0 },
        reservedFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "rentDue",
        "rentCollected",
        "maintenance",
        "administration",
        "reservedFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        arrears: { type: "number" },
        operatingSurplus: { type: "number" },
        reserved: { type: "number" },
        distributable: { type: "number" },
      },
      required: ["arrears", "operatingSurplus", "reserved", "distributable"],
    },
    ports: {
      inputs: [
        {
          id: "rentDue",
          label: "Rent Due",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rentCollected",
          label: "Rent Collected",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "maintenance",
          label: "Maintenance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "administration",
          label: "Administration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reservedFraction",
          label: "Reserved Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "arrears", label: "Arrears", valueType: { type: "number" } },
        {
          id: "operatingSurplus",
          label: "Operating Surplus",
          valueType: { type: "number" },
        },
        { id: "reserved", label: "Reserved", valueType: { type: "number" } },
        {
          id: "distributable",
          label: "Distributable",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = waqfPublicLedgerRentExpenseTermTool.execute;
export default waqfPublicLedgerRentExpenseTermTool;
