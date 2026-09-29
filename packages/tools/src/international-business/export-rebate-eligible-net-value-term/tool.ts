import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly invoiceGoods: number;
  readonly returnedGoods: number;
  readonly ineligibleGoods: number;
  readonly rebateRate: number;
  readonly cap: number;
};
export type Output = {
  readonly eligibleNet: number;
  readonly uncappedRebate: number;
  readonly rebate: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    invoiceGoods: { type: "number", minimum: 0 },
    returnedGoods: { type: "number", minimum: 0 },
    ineligibleGoods: { type: "number", minimum: 0 },
    rebateRate: { type: "number", minimum: 0 },
    cap: { type: "number", minimum: 0 },
  },
  required: [
    "invoiceGoods",
    "returnedGoods",
    "ineligibleGoods",
    "rebateRate",
    "cap",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleNet: { type: "number" },
    uncappedRebate: { type: "number" },
    rebate: { type: "number" },
  },
  required: ["eligibleNet", "uncappedRebate", "rebate"],
} as const;
/** Caller-defined disjoint returns and ineligible-value exclusions with an explicit rebate rate and cap. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { invoiceGoods, returnedGoods, ineligibleGoods, rebateRate, cap } =
    request;
  const compute = (): Output => {
    H.domain(
      invoiceGoods >= 0 &&
        returnedGoods >= 0 &&
        ineligibleGoods >= 0 &&
        returnedGoods + ineligibleGoods <= invoiceGoods &&
        rebateRate >= 0 &&
        cap >= 0,
    );
    return {
      eligibleNet: invoiceGoods - returnedGoods - ineligibleGoods,
      uncappedRebate:
        (invoiceGoods - returnedGoods - ineligibleGoods) * rebateRate,
      rebate: Math.min(
        cap,
        (invoiceGoods - returnedGoods - ineligibleGoods) * rebateRate,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    invoiceGoods: 10000,
    returnedGoods: 1000,
    ineligibleGoods: 2000,
    rebateRate: 0.1,
    cap: 1000,
  },
  output: { eligibleNet: 7000, uncappedRebate: 700, rebate: 700 },
} satisfies ToolExample<Input, Output>;
export const exportRebateEligibleNetValueTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-business/export-rebate-eligible-net-value-term",
    title: "Export Rebate Eligible Net Value Term Tool",
    description:
      "Caller-defined disjoint returns and ineligible-value exclusions with an explicit rebate rate and cap.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        invoiceGoods: { type: "number", minimum: 0 },
        returnedGoods: { type: "number", minimum: 0 },
        ineligibleGoods: { type: "number", minimum: 0 },
        rebateRate: { type: "number", minimum: 0 },
        cap: { type: "number", minimum: 0 },
      },
      required: [
        "invoiceGoods",
        "returnedGoods",
        "ineligibleGoods",
        "rebateRate",
        "cap",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleNet: { type: "number" },
        uncappedRebate: { type: "number" },
        rebate: { type: "number" },
      },
      required: ["eligibleNet", "uncappedRebate", "rebate"],
    },
    ports: {
      inputs: [
        {
          id: "invoiceGoods",
          label: "Invoice Goods",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "returnedGoods",
          label: "Returned Goods",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ineligibleGoods",
          label: "Ineligible Goods",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rebateRate",
          label: "Rebate Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cap",
          label: "Cap",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "eligibleNet",
          label: "Eligible Net",
          valueType: { type: "number" },
        },
        {
          id: "uncappedRebate",
          label: "Uncapped Rebate",
          valueType: { type: "number" },
        },
        { id: "rebate", label: "Rebate", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = exportRebateEligibleNetValueTermTool.execute;
export default exportRebateEligibleNetValueTermTool;
