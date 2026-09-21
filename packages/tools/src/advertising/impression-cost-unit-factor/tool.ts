import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cost: number;
  readonly impressions: number;
  readonly reportingUnit: number;
};
export type Output = { readonly unitCost: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cost: { type: "number", minimum: 0 },
    impressions: { type: "integer", minimum: 1 },
    reportingUnit: { type: "integer", minimum: 1 },
  },
  required: ["cost", "impressions", "reportingUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { unitCost: { type: "number" } },
  required: ["unitCost"],
} as const;
/** Calculate impression cost unit factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cost, impressions, reportingUnit } = request;
  const compute = (): Output => {
    H.domain(cost >= 0);
    H.integer(impressions, 1);
    H.integer(reportingUnit, 1);
    return { unitCost: (cost / impressions) * reportingUnit };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cost: 20, impressions: 10000, reportingUnit: 1000 },
  output: { unitCost: 2 },
} satisfies ToolExample<Input, Output>;
export const impressionCostUnitFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "advertising/impression-cost-unit-factor",
    title: "Impression Cost Unit Factor Tool",
    description:
      "Calculate impression cost unit factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cost: { type: "number", minimum: 0 },
        impressions: { type: "integer", minimum: 1 },
        reportingUnit: { type: "integer", minimum: 1 },
      },
      required: ["cost", "impressions", "reportingUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { unitCost: { type: "number" } },
      required: ["unitCost"],
    },
    ports: {
      inputs: [
        {
          id: "cost",
          label: "Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "impressions",
          label: "Impressions",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "reportingUnit",
          label: "Reporting Unit",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "unitCost", label: "Unit Cost", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = impressionCostUnitFactorTool.execute;
export default impressionCostUnitFactorTool;
