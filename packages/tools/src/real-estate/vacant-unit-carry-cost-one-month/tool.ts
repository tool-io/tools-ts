import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tax: number;
  readonly insurance: number;
  readonly utilities: number;
  readonly commonCharge: number;
  readonly lostRent: number;
};
export type Output = {
  readonly cashCarry: number;
  readonly totalOpportunityCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tax: { type: "number", minimum: 0 },
    insurance: { type: "number", minimum: 0 },
    utilities: { type: "number", minimum: 0 },
    commonCharge: { type: "number", minimum: 0 },
    lostRent: { type: "number", minimum: 0 },
  },
  required: ["tax", "insurance", "utilities", "commonCharge", "lostRent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cashCarry: { type: "number" },
    totalOpportunityCost: { type: "number" },
  },
  required: ["cashCarry", "totalOpportunityCost"],
} as const;
/** Calculate vacant unit carry cost one month from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tax, insurance, utilities, commonCharge, lostRent } = request;
  const compute = (): Output => {
    H.domain(
      tax >= 0 &&
        insurance >= 0 &&
        utilities >= 0 &&
        commonCharge >= 0 &&
        lostRent >= 0,
    );
    return {
      cashCarry: tax + insurance + utilities + commonCharge,
      totalOpportunityCost:
        tax + insurance + utilities + commonCharge + lostRent,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    tax: 100,
    insurance: 50,
    utilities: 40,
    commonCharge: 60,
    lostRent: 1000,
  },
  output: { cashCarry: 250, totalOpportunityCost: 1250 },
} satisfies ToolExample<Input, Output>;
export const vacantUnitCarryCostOneMonthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "real-estate/vacant-unit-carry-cost-one-month",
    title: "Vacant Unit Carry Cost One Month Tool",
    description:
      "Calculate vacant unit carry cost one month from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tax: { type: "number", minimum: 0 },
        insurance: { type: "number", minimum: 0 },
        utilities: { type: "number", minimum: 0 },
        commonCharge: { type: "number", minimum: 0 },
        lostRent: { type: "number", minimum: 0 },
      },
      required: ["tax", "insurance", "utilities", "commonCharge", "lostRent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cashCarry: { type: "number" },
        totalOpportunityCost: { type: "number" },
      },
      required: ["cashCarry", "totalOpportunityCost"],
    },
    ports: {
      inputs: [
        {
          id: "tax",
          label: "Tax",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "insurance",
          label: "Insurance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "utilities",
          label: "Utilities",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "commonCharge",
          label: "Common Charge",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lostRent",
          label: "Lost Rent",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "cashCarry", label: "Cash Carry", valueType: { type: "number" } },
        {
          id: "totalOpportunityCost",
          label: "Total Opportunity Cost",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = vacantUnitCarryCostOneMonthTool.execute;
export default vacantUnitCarryCostOneMonthTool;
