import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly debt: number;
  readonly acquiredCash: number;
  readonly restrictedCash: number;
  readonly includeRestricted: boolean;
};
export type Output = { readonly usableCash: number; readonly netDebt: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    debt: { type: "number", minimum: 0 },
    acquiredCash: { type: "number", minimum: 0 },
    restrictedCash: { type: "number", minimum: 0 },
    includeRestricted: { type: "boolean" },
  },
  required: ["debt", "acquiredCash", "restrictedCash", "includeRestricted"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { usableCash: { type: "number" }, netDebt: { type: "number" } },
  required: ["usableCash", "netDebt"],
} as const;
/** Calculate acquired cash net debt sign from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { debt, acquiredCash, restrictedCash, includeRestricted } = request;
  const compute = (): Output => {
    H.domain(
      debt >= 0 &&
        acquiredCash >= 0 &&
        restrictedCash >= 0 &&
        restrictedCash <= acquiredCash,
    );
    return {
      usableCash: acquiredCash - (includeRestricted ? 0 : restrictedCash),
      netDebt: debt - acquiredCash + (includeRestricted ? 0 : restrictedCash),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    debt: 100,
    acquiredCash: 40,
    restrictedCash: 10,
    includeRestricted: false,
  },
  output: { usableCash: 30, netDebt: 70 },
} satisfies ToolExample<Input, Output>;
export const acquiredCashNetDebtSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "corporate-finance/acquired-cash-net-debt-sign",
    title: "Acquired Cash Net Debt Sign Tool",
    description:
      "Calculate acquired cash net debt sign from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        debt: { type: "number", minimum: 0 },
        acquiredCash: { type: "number", minimum: 0 },
        restrictedCash: { type: "number", minimum: 0 },
        includeRestricted: { type: "boolean" },
      },
      required: ["debt", "acquiredCash", "restrictedCash", "includeRestricted"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        usableCash: { type: "number" },
        netDebt: { type: "number" },
      },
      required: ["usableCash", "netDebt"],
    },
    ports: {
      inputs: [
        {
          id: "debt",
          label: "Debt",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "acquiredCash",
          label: "Acquired Cash",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "restrictedCash",
          label: "Restricted Cash",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeRestricted",
          label: "Include Restricted",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "usableCash",
          label: "Usable Cash",
          valueType: { type: "number" },
        },
        { id: "netDebt", label: "Net Debt", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = acquiredCashNetDebtSignTool.execute;
export default acquiredCashNetDebtSignTool;
