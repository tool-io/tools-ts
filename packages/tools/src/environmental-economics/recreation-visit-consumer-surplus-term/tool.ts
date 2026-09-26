import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly visits: number;
  readonly costCoefficient: number;
  readonly fixedAccessCost: number;
};
export type Output = {
  readonly surplusPerVisit: number;
  readonly totalSurplus: number;
  readonly netSurplus: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    visits: { type: "number", minimum: 0 },
    costCoefficient: { type: "number", exclusiveMaximum: 0 },
    fixedAccessCost: { type: "number", minimum: 0 },
  },
  required: ["visits", "costCoefficient", "fixedAccessCost"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    surplusPerVisit: { type: "number" },
    totalSurplus: { type: "number" },
    netSurplus: { type: "number" },
  },
  required: ["surplusPerVisit", "totalSurplus", "netSurplus"],
} as const;
/** Semi-log travel-cost demand surplus -1/beta per visit; the supplied negative cost coefficient defines this narrow model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { visits, costCoefficient, fixedAccessCost } = request;
  const compute = (): Output => {
    H.domain(visits >= 0 && costCoefficient < 0 && fixedAccessCost >= 0);
    return {
      surplusPerVisit: -1 / costCoefficient,
      totalSurplus: -visits / costCoefficient,
      netSurplus: -visits / costCoefficient - fixedAccessCost,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { visits: 1000, costCoefficient: -0.02, fixedAccessCost: 5000 },
  output: { surplusPerVisit: 50, totalSurplus: 50000, netSurplus: 45000 },
} satisfies ToolExample<Input, Output>;
export const recreationVisitConsumerSurplusTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-economics/recreation-visit-consumer-surplus-term",
    title: "Recreation Visit Consumer Surplus Term Tool",
    description:
      "Semi-log travel-cost demand surplus -1/beta per visit; the supplied negative cost coefficient defines this narrow model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        visits: { type: "number", minimum: 0 },
        costCoefficient: { type: "number", exclusiveMaximum: 0 },
        fixedAccessCost: { type: "number", minimum: 0 },
      },
      required: ["visits", "costCoefficient", "fixedAccessCost"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        surplusPerVisit: { type: "number" },
        totalSurplus: { type: "number" },
        netSurplus: { type: "number" },
      },
      required: ["surplusPerVisit", "totalSurplus", "netSurplus"],
    },
    ports: {
      inputs: [
        {
          id: "visits",
          label: "Visits",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "costCoefficient",
          label: "Cost Coefficient",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fixedAccessCost",
          label: "Fixed Access Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "surplusPerVisit",
          label: "Surplus Per Visit",
          valueType: { type: "number" },
        },
        {
          id: "totalSurplus",
          label: "Total Surplus",
          valueType: { type: "number" },
        },
        {
          id: "netSurplus",
          label: "Net Surplus",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = recreationVisitConsumerSurplusTermTool.execute;
export default recreationVisitConsumerSurplusTermTool;
