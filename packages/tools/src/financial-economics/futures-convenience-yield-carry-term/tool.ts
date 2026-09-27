import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly spot: number;
  readonly futures: number;
  readonly annualRate: number;
  readonly storageRate: number;
  readonly years: number;
};
export type Output = { readonly impliedConvenienceYield: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    spot: { type: "number", exclusiveMinimum: 0 },
    futures: { type: "number", exclusiveMinimum: 0 },
    annualRate: { type: "number" },
    storageRate: { type: "number" },
    years: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["spot", "futures", "annualRate", "storageRate", "years"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { impliedConvenienceYield: { type: "number" } },
  required: ["impliedConvenienceYield"],
} as const;
/** Continuous proportional cost-of-carry convenience yield, excluding fixed storage costs and futures convexity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { spot, futures, annualRate, storageRate, years } = request;
  const compute = (): Output => {
    H.positive(spot);
    H.positive(futures);
    H.positive(years);
    return {
      impliedConvenienceYield:
        annualRate + storageRate - Math.log(futures / spot) / years,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    spot: 100,
    futures: 100,
    annualRate: 0.05,
    storageRate: 0.02,
    years: 1,
  },
  output: { impliedConvenienceYield: 0.07 },
} satisfies ToolExample<Input, Output>;
export const futuresConvenienceYieldCarryTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "financial-economics/futures-convenience-yield-carry-term",
    title: "Futures Convenience Yield Carry Term Tool",
    description:
      "Continuous proportional cost-of-carry convenience yield, excluding fixed storage costs and futures convexity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        spot: { type: "number", exclusiveMinimum: 0 },
        futures: { type: "number", exclusiveMinimum: 0 },
        annualRate: { type: "number" },
        storageRate: { type: "number" },
        years: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["spot", "futures", "annualRate", "storageRate", "years"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { impliedConvenienceYield: { type: "number" } },
      required: ["impliedConvenienceYield"],
    },
    ports: {
      inputs: [
        {
          id: "spot",
          label: "Spot",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "futures",
          label: "Futures",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "annualRate",
          label: "Annual Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "storageRate",
          label: "Storage Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "years",
          label: "Years",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "impliedConvenienceYield",
          label: "Implied Convenience Yield",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = futuresConvenienceYieldCarryTermTool.execute;
export default futuresConvenienceYieldCarryTermTool;
