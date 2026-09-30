import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly income: number;
  readonly committedExpenses: number;
  readonly specifiedReserve: number;
  readonly reserveAlreadyIncluded: boolean;
};
export type Output = {
  readonly availableBalance: number;
  readonly reserveCharged: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    income: { type: "number", minimum: 0 },
    committedExpenses: { type: "number", minimum: 0 },
    specifiedReserve: { type: "number", minimum: 0 },
    reserveAlreadyIncluded: { type: "boolean" },
  },
  required: [
    "income",
    "committedExpenses",
    "specifiedReserve",
    "reserveAlreadyIncluded",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableBalance: { type: "number" },
    reserveCharged: { type: "number" },
  },
  required: ["availableBalance", "reserveCharged"],
} as const;
/** Ledger arithmetic for an independently specified maintenance reserve, without interpreting an endowment instrument or legal duty. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    income,
    committedExpenses,
    specifiedReserve,
    reserveAlreadyIncluded,
  } = request;
  const compute = (): Output => {
    H.domain(income >= 0 && committedExpenses >= 0 && specifiedReserve >= 0);
    return {
      availableBalance:
        income -
        committedExpenses -
        (reserveAlreadyIncluded ? 0 : specifiedReserve),
      reserveCharged: reserveAlreadyIncluded ? 0 : specifiedReserve,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    income: 1000,
    committedExpenses: 300,
    specifiedReserve: 100,
    reserveAlreadyIncluded: false,
  },
  output: { availableBalance: 600, reserveCharged: 100 },
} satisfies ToolExample<Input, Output>;
export const waqfLedgerSpecifiedMaintenanceReserveTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "islamic-studies/waqf-ledger-specified-maintenance-reserve-term",
      title: "Waqf Ledger Specified Maintenance Reserve Term Tool",
      description:
        "Ledger arithmetic for an independently specified maintenance reserve, without interpreting an endowment instrument or legal duty.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          income: { type: "number", minimum: 0 },
          committedExpenses: { type: "number", minimum: 0 },
          specifiedReserve: { type: "number", minimum: 0 },
          reserveAlreadyIncluded: { type: "boolean" },
        },
        required: [
          "income",
          "committedExpenses",
          "specifiedReserve",
          "reserveAlreadyIncluded",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          availableBalance: { type: "number" },
          reserveCharged: { type: "number" },
        },
        required: ["availableBalance", "reserveCharged"],
      },
      ports: {
        inputs: [
          {
            id: "income",
            label: "Income",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "committedExpenses",
            label: "Committed Expenses",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "specifiedReserve",
            label: "Specified Reserve",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "reserveAlreadyIncluded",
            label: "Reserve Already Included",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "availableBalance",
            label: "Available Balance",
            valueType: { type: "number" },
          },
          {
            id: "reserveCharged",
            label: "Reserve Charged",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = waqfLedgerSpecifiedMaintenanceReserveTermTool.execute;
export default waqfLedgerSpecifiedMaintenanceReserveTermTool;
