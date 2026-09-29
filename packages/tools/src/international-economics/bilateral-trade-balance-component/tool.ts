import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly exports: number;
  readonly imports: number;
  readonly suppliedReexportDebit: number;
  readonly includeReexports: boolean;
};
export type Output = {
  readonly adjustedExports: number;
  readonly balance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exports: { type: "number", minimum: 0 },
    imports: { type: "number", minimum: 0 },
    suppliedReexportDebit: { type: "number", minimum: 0 },
    includeReexports: { type: "boolean" },
  },
  required: ["exports", "imports", "suppliedReexportDebit", "includeReexports"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    adjustedExports: { type: "number" },
    balance: { type: "number" },
  },
  required: ["adjustedExports", "balance"],
} as const;
/** Compute one supplied bilateral trade-balance component under an explicit reexport policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { exports, imports, suppliedReexportDebit, includeReexports } = request;
  const compute = (): Output => {
    H.domain(
      exports >= 0 &&
        imports >= 0 &&
        suppliedReexportDebit >= 0 &&
        suppliedReexportDebit <= exports,
    );
    return {
      adjustedExports: exports - (includeReexports ? 0 : suppliedReexportDebit),
      balance:
        exports - (includeReexports ? 0 : suppliedReexportDebit) - imports,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    exports: 100,
    imports: 80,
    suppliedReexportDebit: 10,
    includeReexports: true,
  },
  output: { adjustedExports: 100, balance: 20 },
} satisfies ToolExample<Input, Output>;
export const bilateralTradeBalanceComponentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-economics/bilateral-trade-balance-component",
    title: "Bilateral Trade Balance Component Tool",
    description:
      "Compute one supplied bilateral trade-balance component under an explicit reexport policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        exports: { type: "number", minimum: 0 },
        imports: { type: "number", minimum: 0 },
        suppliedReexportDebit: { type: "number", minimum: 0 },
        includeReexports: { type: "boolean" },
      },
      required: [
        "exports",
        "imports",
        "suppliedReexportDebit",
        "includeReexports",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        adjustedExports: { type: "number" },
        balance: { type: "number" },
      },
      required: ["adjustedExports", "balance"],
    },
    ports: {
      inputs: [
        {
          id: "exports",
          label: "Exports",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "imports",
          label: "Imports",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedReexportDebit",
          label: "Supplied Reexport Debit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeReexports",
          label: "Include Reexports",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "adjustedExports",
          label: "Adjusted Exports",
          valueType: { type: "number" },
        },
        { id: "balance", label: "Balance", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = bilateralTradeBalanceComponentTool.execute;
export default bilateralTradeBalanceComponentTool;
