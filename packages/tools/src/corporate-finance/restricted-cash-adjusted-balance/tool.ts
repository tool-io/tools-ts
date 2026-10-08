import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reportedCash: number;
  readonly restrictedCash: number;
};
export type Output = {
  readonly unrestrictedCash: number;
  readonly restrictedShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportedCash: { type: "number", minimum: 0 },
    restrictedCash: { type: "number", minimum: 0 },
  },
  required: ["reportedCash", "restrictedCash"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unrestrictedCash: { type: "number" },
    restrictedShare: { type: "number" },
  },
  required: ["unrestrictedCash", "restrictedShare"],
} as const;
/** Separate explicitly recorded restricted cash from reported cash, defining the share as zero when both amounts are zero. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reportedCash, restrictedCash } = request;
  const compute = (): Output => {
    H.domain(
      reportedCash >= 0 &&
        restrictedCash >= 0 &&
        restrictedCash <= reportedCash,
      "reportedCash",
    );
    return {
      unrestrictedCash: reportedCash - restrictedCash,
      restrictedShare: reportedCash === 0 ? 0 : restrictedCash / reportedCash,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reportedCash: 1000, restrictedCash: 250 },
  output: { unrestrictedCash: 750, restrictedShare: 0.25 },
} satisfies ToolExample<Input, Output>;
export const restrictedCashAdjustedBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "trading"],
      fields: [
        "corporate-finance",
        "corporate finance",
        "business and finance",
      ],
      keywords: ["corporate finance", "business and finance"],
    },
    id: "corporate-finance/restricted-cash-adjusted-balance",
    title: "Restricted Cash Adjusted Balance",
    description:
      "Separate explicitly recorded restricted cash from reported cash, defining the share as zero when both amounts are zero.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reportedCash: { type: "number", minimum: 0 },
        restrictedCash: { type: "number", minimum: 0 },
      },
      required: ["reportedCash", "restrictedCash"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unrestrictedCash: { type: "number" },
        restrictedShare: { type: "number" },
      },
      required: ["unrestrictedCash", "restrictedShare"],
    },
    ports: {
      inputs: [
        {
          id: "reportedCash",
          label: "Reported Cash",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "restrictedCash",
          label: "Restricted Cash",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "unrestrictedCash",
          label: "Unrestricted Cash",
          valueType: { type: "number" },
        },
        {
          id: "restrictedShare",
          label: "Restricted Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = restrictedCashAdjustedBalanceTool.execute;
export default restrictedCashAdjustedBalanceTool;
