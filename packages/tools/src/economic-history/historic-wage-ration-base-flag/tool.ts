import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cashWage: number;
  readonly rationQuantity: number;
  readonly suppliedRationPrice: number;
  readonly includeRations: boolean;
};
export type Output = {
  readonly rationValue: number;
  readonly totalCompensation: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cashWage: { type: "number", minimum: 0 },
    rationQuantity: { type: "number", minimum: 0 },
    suppliedRationPrice: { type: "number", minimum: 0 },
    includeRations: { type: "boolean" },
  },
  required: [
    "cashWage",
    "rationQuantity",
    "suppliedRationPrice",
    "includeRations",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rationValue: { type: "number" },
    totalCompensation: { type: "number" },
  },
  required: ["rationValue", "totalCompensation"],
} as const;
/** Calculate historic wage ration base flag from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cashWage, rationQuantity, suppliedRationPrice, includeRations } =
    request;
  const compute = (): Output => {
    H.domain(cashWage >= 0 && rationQuantity >= 0 && suppliedRationPrice >= 0);
    return {
      rationValue: rationQuantity * suppliedRationPrice,
      totalCompensation:
        cashWage + (includeRations ? rationQuantity * suppliedRationPrice : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    cashWage: 10,
    rationQuantity: 2,
    suppliedRationPrice: 3,
    includeRations: true,
  },
  output: { rationValue: 6, totalCompensation: 16 },
} satisfies ToolExample<Input, Output>;
export const historicWageRationBaseFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economic-history/historic-wage-ration-base-flag",
    title: "Historic Wage Ration Base Flag Tool",
    description:
      "Calculate historic wage ration base flag from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cashWage: { type: "number", minimum: 0 },
        rationQuantity: { type: "number", minimum: 0 },
        suppliedRationPrice: { type: "number", minimum: 0 },
        includeRations: { type: "boolean" },
      },
      required: [
        "cashWage",
        "rationQuantity",
        "suppliedRationPrice",
        "includeRations",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rationValue: { type: "number" },
        totalCompensation: { type: "number" },
      },
      required: ["rationValue", "totalCompensation"],
    },
    ports: {
      inputs: [
        {
          id: "cashWage",
          label: "Cash Wage",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rationQuantity",
          label: "Ration Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedRationPrice",
          label: "Supplied Ration Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeRations",
          label: "Include Rations",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "rationValue",
          label: "Ration Value",
          valueType: { type: "number" },
        },
        {
          id: "totalCompensation",
          label: "Total Compensation",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = historicWageRationBaseFlagTool.execute;
export default historicWageRationBaseFlagTool;
