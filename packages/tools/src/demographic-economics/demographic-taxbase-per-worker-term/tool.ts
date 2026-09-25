import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly workers: number;
  readonly earnings: number;
  readonly taxableFraction: number;
  readonly effectiveRate: number;
};
export type Output = {
  readonly taxBase: number;
  readonly taxRevenue: number;
  readonly perWorkerRevenue: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    workers: { type: "integer", minimum: 1 },
    earnings: { type: "number", minimum: 0 },
    taxableFraction: { type: "number", minimum: 0, maximum: 1 },
    effectiveRate: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["workers", "earnings", "taxableFraction", "effectiveRate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    taxBase: { type: "number" },
    taxRevenue: { type: "number" },
    perWorkerRevenue: { type: "number" },
  },
  required: ["taxBase", "taxRevenue", "perWorkerRevenue"],
} as const;
/** Calculate demographic taxbase per worker term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { workers, earnings, taxableFraction, effectiveRate } = request;
  const compute = (): Output => {
    H.integer(workers, 1);
    H.domain(earnings >= 0);
    H.probability(taxableFraction);
    H.probability(effectiveRate);
    return {
      taxBase: workers * earnings * taxableFraction,
      taxRevenue: workers * earnings * taxableFraction * effectiveRate,
      perWorkerRevenue: earnings * taxableFraction * effectiveRate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    workers: 100,
    earnings: 1000,
    taxableFraction: 0.8,
    effectiveRate: 0.25,
  },
  output: { taxBase: 80000, taxRevenue: 20000, perWorkerRevenue: 200 },
} satisfies ToolExample<Input, Output>;
export const demographicTaxbasePerWorkerTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "demographic-economics/demographic-taxbase-per-worker-term",
    title: "Demographic Taxbase Per Worker Term Tool",
    description:
      "Calculate demographic taxbase per worker term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        workers: { type: "integer", minimum: 1 },
        earnings: { type: "number", minimum: 0 },
        taxableFraction: { type: "number", minimum: 0, maximum: 1 },
        effectiveRate: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["workers", "earnings", "taxableFraction", "effectiveRate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        taxBase: { type: "number" },
        taxRevenue: { type: "number" },
        perWorkerRevenue: { type: "number" },
      },
      required: ["taxBase", "taxRevenue", "perWorkerRevenue"],
    },
    ports: {
      inputs: [
        {
          id: "workers",
          label: "Workers",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "earnings",
          label: "Earnings",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "taxableFraction",
          label: "Taxable Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "effectiveRate",
          label: "Effective Rate",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "taxBase", label: "Tax Base", valueType: { type: "number" } },
        {
          id: "taxRevenue",
          label: "Tax Revenue",
          valueType: { type: "number" },
        },
        {
          id: "perWorkerRevenue",
          label: "Per Worker Revenue",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = demographicTaxbasePerWorkerTermTool.execute;
export default demographicTaxbasePerWorkerTermTool;
