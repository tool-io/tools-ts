import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly loanDay: number;
  readonly returnDue: number;
  readonly actualDay: number;
  readonly graceDays: number;
};
export type Output = {
  readonly loanAge: number;
  readonly nominalMargin: number;
  readonly graceMargin: number;
  readonly overdue: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    loanDay: { type: "integer" },
    returnDue: { type: "integer" },
    actualDay: { type: "integer" },
    graceDays: { type: "integer", minimum: 0 },
  },
  required: ["loanDay", "returnDue", "actualDay", "graceDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    loanAge: { type: "integer" },
    nominalMargin: { type: "integer" },
    graceMargin: { type: "integer" },
    overdue: { type: "boolean" },
  },
  required: ["loanAge", "nominalMargin", "graceMargin", "overdue"],
} as const;
/** Calculate biosecurity equipment loan expiry margin from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { loanDay, returnDue, actualDay, graceDays } = request;
  const compute = (): Output => {
    H.integer(graceDays, 0);
    H.domain(returnDue >= loanDay && actualDay >= loanDay);
    return {
      loanAge: actualDay - loanDay,
      nominalMargin: returnDue - actualDay,
      graceMargin: returnDue + graceDays - actualDay,
      overdue: actualDay > returnDue + graceDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { loanDay: 100, returnDue: 120, actualDay: 123, graceDays: 5 },
  output: { loanAge: 23, nominalMargin: -3, graceMargin: 2, overdue: false },
} satisfies ToolExample<Input, Output>;
export const biosecurityEquipmentLoanExpiryMarginTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biosecurity/biosecurity-equipment-loan-expiry-margin",
      title: "Biosecurity Equipment Loan Expiry Margin Tool",
      description:
        "Calculate biosecurity equipment loan expiry margin from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          loanDay: { type: "integer" },
          returnDue: { type: "integer" },
          actualDay: { type: "integer" },
          graceDays: { type: "integer", minimum: 0 },
        },
        required: ["loanDay", "returnDue", "actualDay", "graceDays"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          loanAge: { type: "integer" },
          nominalMargin: { type: "integer" },
          graceMargin: { type: "integer" },
          overdue: { type: "boolean" },
        },
        required: ["loanAge", "nominalMargin", "graceMargin", "overdue"],
      },
      ports: {
        inputs: [
          {
            id: "loanDay",
            label: "Loan Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "returnDue",
            label: "Return Due",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "actualDay",
            label: "Actual Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "graceDays",
            label: "Grace Days",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "loanAge", label: "Loan Age", valueType: { type: "integer" } },
          {
            id: "nominalMargin",
            label: "Nominal Margin",
            valueType: { type: "integer" },
          },
          {
            id: "graceMargin",
            label: "Grace Margin",
            valueType: { type: "integer" },
          },
          { id: "overdue", label: "Overdue", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = biosecurityEquipmentLoanExpiryMarginTool.execute;
export default biosecurityEquipmentLoanExpiryMarginTool;
