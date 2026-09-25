import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly population: number;
  readonly taxPerPerson: number;
  readonly servicePerPerson: number;
  readonly transferPerPerson: number;
};
export type Output = {
  readonly revenue: number;
  readonly expenditure: number;
  readonly balance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    population: { type: "integer", minimum: 0 },
    taxPerPerson: { type: "number", minimum: 0 },
    servicePerPerson: { type: "number", minimum: 0 },
    transferPerPerson: { type: "number", minimum: 0 },
  },
  required: [
    "population",
    "taxPerPerson",
    "servicePerPerson",
    "transferPerPerson",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    revenue: { type: "number" },
    expenditure: { type: "number" },
    balance: { type: "number" },
  },
  required: ["revenue", "expenditure", "balance"],
} as const;
/** Calculate population fiscal balance one cohort from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { population, taxPerPerson, servicePerPerson, transferPerPerson } =
    request;
  const compute = (): Output => {
    H.integer(population, 0);
    H.domain(
      taxPerPerson >= 0 && servicePerPerson >= 0 && transferPerPerson >= 0,
    );
    return {
      revenue: population * taxPerPerson,
      expenditure: population * (servicePerPerson + transferPerPerson),
      balance:
        population * (taxPerPerson - servicePerPerson - transferPerPerson),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    population: 1000,
    taxPerPerson: 500,
    servicePerPerson: 300,
    transferPerPerson: 100,
  },
  output: { revenue: 500000, expenditure: 400000, balance: 100000 },
} satisfies ToolExample<Input, Output>;
export const populationFiscalBalanceOneCohortTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "demographic-economics/population-fiscal-balance-one-cohort",
    title: "Population Fiscal Balance One Cohort Tool",
    description:
      "Calculate population fiscal balance one cohort from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        population: { type: "integer", minimum: 0 },
        taxPerPerson: { type: "number", minimum: 0 },
        servicePerPerson: { type: "number", minimum: 0 },
        transferPerPerson: { type: "number", minimum: 0 },
      },
      required: [
        "population",
        "taxPerPerson",
        "servicePerPerson",
        "transferPerPerson",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        revenue: { type: "number" },
        expenditure: { type: "number" },
        balance: { type: "number" },
      },
      required: ["revenue", "expenditure", "balance"],
    },
    ports: {
      inputs: [
        {
          id: "population",
          label: "Population",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "taxPerPerson",
          label: "Tax Per Person",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "servicePerPerson",
          label: "Service Per Person",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "transferPerPerson",
          label: "Transfer Per Person",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "revenue", label: "Revenue", valueType: { type: "number" } },
        {
          id: "expenditure",
          label: "Expenditure",
          valueType: { type: "number" },
        },
        { id: "balance", label: "Balance", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = populationFiscalBalanceOneCohortTool.execute;
export default populationFiscalBalanceOneCohortTool;
