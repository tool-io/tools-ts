import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cashflow: number;
  readonly years: number;
  readonly baseYield: number;
  readonly bump: number;
  readonly keyRateWeight: number;
};
export type Output = {
  readonly basePv: number;
  readonly bumpedPv: number;
  readonly pvChange: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cashflow: { type: "number" },
    years: { type: "number", minimum: 0 },
    baseYield: { type: "number", exclusiveMinimum: -1 },
    bump: { type: "number" },
    keyRateWeight: { type: "number" },
  },
  required: ["cashflow", "years", "baseYield", "bump", "keyRateWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    basePv: { type: "number" },
    bumpedPv: { type: "number" },
    pvChange: { type: "number" },
  },
  required: ["basePv", "bumpedPv", "pvChange"],
} as const;
/** One annually compounded cash-flow PV response to an explicitly supplied key-rate interpolation weight. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cashflow, years, baseYield, bump, keyRateWeight } = request;
  const compute = (): Output => {
    H.domain(
      years >= 0 && baseYield > -1 && baseYield + bump * keyRateWeight > -1,
    );
    return {
      basePv: cashflow / (1 + baseYield) ** years,
      bumpedPv: cashflow / (1 + baseYield + bump * keyRateWeight) ** years,
      pvChange:
        cashflow / (1 + baseYield + bump * keyRateWeight) ** years -
        cashflow / (1 + baseYield) ** years,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    cashflow: 110,
    years: 1,
    baseYield: 0.1,
    bump: 0.1,
    keyRateWeight: 1,
  },
  output: {
    basePv: 99.99999999999999,
    bumpedPv: 91.66666666666666,
    pvChange: -8.333333333333329,
  },
} satisfies ToolExample<Input, Output>;
export const bondKeyrateOneCashflowBumpTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "financial-economics/bond-keyrate-one-cashflow-bump-term",
    title: "Bond Keyrate One Cashflow Bump Term Tool",
    description:
      "One annually compounded cash-flow PV response to an explicitly supplied key-rate interpolation weight.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cashflow: { type: "number" },
        years: { type: "number", minimum: 0 },
        baseYield: { type: "number", exclusiveMinimum: -1 },
        bump: { type: "number" },
        keyRateWeight: { type: "number" },
      },
      required: ["cashflow", "years", "baseYield", "bump", "keyRateWeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        basePv: { type: "number" },
        bumpedPv: { type: "number" },
        pvChange: { type: "number" },
      },
      required: ["basePv", "bumpedPv", "pvChange"],
    },
    ports: {
      inputs: [
        {
          id: "cashflow",
          label: "Cashflow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "years",
          label: "Years",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "baseYield",
          label: "Base Yield",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bump",
          label: "Bump",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "keyRateWeight",
          label: "Key Rate Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "basePv", label: "Base Pv", valueType: { type: "number" } },
        { id: "bumpedPv", label: "Bumped Pv", valueType: { type: "number" } },
        { id: "pvChange", label: "Pv Change", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = bondKeyrateOneCashflowBumpTermTool.execute;
export default bondKeyrateOneCashflowBumpTermTool;
